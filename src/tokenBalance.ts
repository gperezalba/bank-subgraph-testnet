import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts"

import { 
    Token,
    TokenBalance, 
    Wallet
} from "../generated/schema"

import { Token as TokenContract } from "../generated/templates/Token/Token"
import { loadWallet, getPiBalance } from "./wallet";
import { Balance } from '../generated/templates/Balance/Balance'

const PI_ADDRESS = "0x0000000000000000000000000000000000000000";

export function createTokenBalance(tokenAddress: Address, walletAddress: string): void {
    let token = Token.load(tokenAddress.toHexString());

    if (token !== null) { //Si el token no existe no hago nada
        let id = tokenAddress.toHexString().concat('-').concat(walletAddress);
        let tokenBalance = TokenBalance.load(id);
        
        if (tokenBalance == null) { //Si no existe el tokenBalance lo creo
            tokenBalance = new TokenBalance(id);
            tokenBalance.token = token.id;
            tokenBalance.balance = BigInt.fromI32(0);
            tokenBalance.commodities = [];
            tokenBalance.updated = false;

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
        let balance = getBalance(Address.fromString(walletAddress));
        if (balance != (BigInt.fromI32(-1))) {
            tokenBalance.balance = balance;
            tokenBalance.updated = true;
        } else {
            tokenBalance.balance = BigInt.fromI32(0);
            tokenBalance.updated = false;
        }
    } else {
        let token = TokenContract.bind(tokenAddress);
        let balance = token.try_balanceOf(Address.fromString(walletAddress));

        let tokenEntity = Token.load(tokenAddress.toHexString());

        if (!balance.reverted) {
            tokenBalance.balance = balance.value;
            tokenBalance.updated = true;
            if (tokenEntity.isNFT) {
                tokenBalance.balance = tokenBalance.balance.times(getOneEther());
            }
        } else {
            tokenBalance.balance = BigInt.fromI32(0);
            tokenBalance.updated = false;
        }
    }

    tokenBalance.save();
}

export function pushCommodity(commodityId: string, tokenAddress: Address, walletAddress: string): void {
    updateTokenBalance(tokenAddress, walletAddress);

    let id = tokenAddress.toHexString().concat('-').concat(walletAddress);
    let tokenBalance = TokenBalance.load(id);

    let array = tokenBalance.commodities;
    array.push(commodityId);
    tokenBalance.commodities = array;

    tokenBalance.save();
}

export function popCommodity(commodityId: string, tokenAddress: Address, walletAddress: string): void {
    updateTokenBalance(tokenAddress, walletAddress);

    let id = tokenAddress.toHexString().concat('-').concat(walletAddress);
    let tokenBalance = TokenBalance.load(id);

    let array = tokenBalance.commodities;
    let index = array.indexOf(commodityId);
    if (index > -1) {
        array.splice(index, 1);
    }
    tokenBalance.commodities = array;

    tokenBalance.save();
}    

export function getBalance(address: Address): BigInt {
    let contractAddress = "0x24098602159d8deaEb1F9382b34336884F340886";
    let contract = Balance.bind(Address.fromString(contractAddress) as Address);
    let balance = contract.try_getBalance(address);
  
    if (!balance.reverted) {
      return balance.value;
    } else {
      return BigInt.fromI32(-1);
    }
}

export function getOneEther(): BigInt {
    let n = BigInt.fromI32(1);
    for(let i = 0; i < 18; i++) {
        n = n.times(BigInt.fromI32(10));
    }
    return n;
}