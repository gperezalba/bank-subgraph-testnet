import { Address, BigDecimal, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { Transfer } from "../generated/templates/Token/Token"

import { 
    Transaction,
    Token,
    TokenBalance
} from "../generated/schema"

import { Token as TokenContract } from "../generated/templates/Token/Token"
import { Token as TokenTemplate } from "../generated/templates"
import { pushWalletTransaction } from "./wallet"
import { updateTokenBalance, createTokenBalance } from "./tokenBalance"
import { newTransaction } from "./transaction"

const PI_ADDRESS = "0x0000000000000000000000000000000000000000";

export function handleTransfer(event: Transfer): void {
    //creo la entidad si no existe, aunque siempre existirá
    createToken(event.address);
    //actualizo los tokenBalance de ambas partes y si no existe lo crea
    updateTokenBalance(event.address, event.params.to.toHexString());
    updateTokenBalance(event.address, event.params.from.toHexString());
    //actualizo el array de holders del token
    addTokenHolder(event.address.toHexString(), event.params.to.toHexString());
    //creo la entidad Transaction
    newTransaction(event);
}

/***************************************************************/
// TOKEN
/***************************************************************/

export function createToken(tokenAddress: Address): void {
    let token = Token.load(tokenAddress.toHexString());
  
    if (token == null) {
        token = new Token(tokenAddress.toHexString());
  
        if (tokenAddress.toHexString() != PI_ADDRESS) {
            
            let contract = TokenContract.bind(tokenAddress);
        
            let symbol = contract.try_symbol();
            let name = contract.try_name();
            let decimals = contract.try_decimals();
            let supply = contract.try_totalSupply();

            if (!symbol.reverted) {
                token.tokenSymbol = symbol.value;
            } else {
                token.tokenSymbol = "";
            }

            if (!name.reverted) {
                token.tokenName = name.value;
            } else {
                token.tokenName = "";
            }

            if (!decimals.reverted) {
                token.tokenDecimals = decimals.value;
            } else {
                token.tokenDecimals = 0;
            }

            if (!supply.reverted) {
                token.totalSupply = supply.value.toBigDecimal();
            } else {
                token.totalSupply = BigDecimal.fromString('0');
            }

            if ((!symbol.reverted) && (!name.reverted) && (!decimals.reverted) && (!supply.reverted)) {
                token.updated = true;
            } else {
                token.updated = false;
            }

        } else {
            token.tokenSymbol = "PI";
            token.tokenName = "PI";
            token.tokenDecimals = 18;
            token.totalSupply = BigDecimal.fromString('0');
            token.updated = true;
        }

        TokenTemplate.create(tokenAddress);
    }
  
    token.save();
}

export function addTokenHolder(tokenAddress: string, holder: string): void {
    let token = Token.load(tokenAddress);

    if (token !== null) { //Si el token no existe no hago nada
        let id = tokenAddress.toString().concat('-').concat(holder);
        let tokenBalance = TokenBalance.load(id);

        if (tokenBalance == null) {
            createTokenBalance(Address.fromString(tokenAddress), holder);
        }

        let currentHolders = token.holders;

        //Si el holder no está en el array ya, lo incluyo
        if (!currentHolders.includes(id)) {
            currentHolders.push(id);
            token.holders = currentHolders;
            token.save();
        }
    }
}

export function handleTokenMint(id: string, amount: BigDecimal): void {
    let token = Token.load(id);

    if (token !== null) {
        token.totalSupply = token.totalSupply.plus(amount);
        token.save();
    }
}
  
export function handleTokenBurn(id: string, amount: BigDecimal): void {
    let token = Token.load(id);

    if (token !== null) {
        token.totalSupply = token.totalSupply.minus(amount);
        token.save();
    }
}