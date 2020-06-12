import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts"

import { 
    Token,
    TokenBalance, 
    Wallet
} from "../generated/schema"

import { Token as TokenContract } from "../generated/templates/Token/Token"
import { zeroBD, getBalance } from "./helpers"
import { loadWallet, getPiBalance } from "./wallet";

const PI_ADDRESS = "0x0000000000000000000000000000000000000000";

export function createTokenBalance(tokenAddress: Address, walletAddress: string): void {
    let token = Token.load(tokenAddress.toHexString());

    if (token !== null) { //Si el token no existe no hago nada
        let id = tokenAddress.toHexString().concat('-').concat(walletAddress);
        let tokenBalance = TokenBalance.load(id);
        
        if (tokenBalance == null) { //Si no existe el tokenBalance lo creo
            tokenBalance = new TokenBalance(id);
            tokenBalance.token = token.id;
            tokenBalance.balance = zeroBD();

            let wallet = Wallet.load(walletAddress);

            if (wallet == null) { //Si no existe el wallet lo creo
                wallet = loadWallet(Address.fromString(walletAddress), false)
                //Añado al wallet este tokenBalance ya que como lo acabo de crear no lo tendrá
                wallet.balances.push(tokenBalance.id);
            }

            tokenBalance.wallet = wallet.id;

            //si el wallet existía pero no tenia el tokenBalance, lo incluyo
            if (!wallet.balances.includes(id)) { 
                wallet.balances.push(tokenBalance.id);
            }

            wallet.save();
            tokenBalance.save();

            updateBalance(tokenAddress, walletAddress);
        }
    }
}

export function updateTokenBalance(tokenAddress: Address, walletAddress: string): void {
    let token = Token.load(tokenAddress.toHexString());

    if (token !== null) { //Si el token no existe no hago nada

        let id = tokenAddress.toHexString().concat('-').concat(walletAddress);
        let tokenBalance = TokenBalance.load(id);

        if (tokenBalance == null) { //no existe aún, al crearlo se actualiza/inicializa
            createTokenBalance(tokenAddress, walletAddress);
        } else { //actualizar si ya existía
            updateBalance(tokenAddress, walletAddress);
        }
    }
}

export function updateBalance(tokenAddress: Address, walletAddress: string): void {
    let id = tokenAddress.toHexString().concat('-').concat(walletAddress);
    let tokenBalance = TokenBalance.load(id);
    
    if (tokenAddress.toHexString() == PI_ADDRESS) {
        /*let balance = getBalance(Address.fromString(walletAddress));
        if (balance != (BigInt.fromI32(-1).toBigDecimal())) {
            tokenBalance.balance = balance;
            tokenBalance.updated = true;
        } else {
            tokenBalance.balance = BigDecimal.fromString('0');
            tokenBalance.updated = false;
        }*/

        let wallet = Wallet.load(walletAddress);
        if (wallet != null) {
            if (wallet.isBankUser) {
                let balance = getPiBalance(Address.fromString(walletAddress));

                if (balance != (BigInt.fromI32(-1).toBigDecimal())) {
                    tokenBalance.balance = balance;
                    tokenBalance.updated = true;
                } else {
                    tokenBalance.balance = BigDecimal.fromString('0');
                    tokenBalance.updated = false;
                }
            }
        }
    } else {
        let token = TokenContract.bind(tokenAddress);
        let balance = token.try_balanceOf(Address.fromString(walletAddress));

        if (!balance.reverted) {
            tokenBalance.balance = balance.value.toBigDecimal();
            tokenBalance.updated = true;
        } else {
            tokenBalance.balance = BigDecimal.fromString('0');
            tokenBalance.updated = false;
        }
    }

    tokenBalance.save();
}