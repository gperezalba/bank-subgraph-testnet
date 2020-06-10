import { Address, BigDecimal, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { Transfer } from "../generated/templates/Token/Token"

import { 
    Transaction,
    Token,
    TokenBalance, 
    Wallet
} from "../generated/schema"

import { Token as TokenContract } from "../generated/templates/Token/Token"

import { pushWalletTransaction } from "./wallet"
import { addToken } from "./controller"
import { zeroBD, getBalance } from "./helpers"

export function handleTransfer(event: Transfer): void {
    /*addToken(event.address);
    updateTokenBalance(event.address, event.params.to.toHexString());
    updateTokenBalance(event.address, event.params.from.toHexString());
    addTokenHolder(event.address.toHexString(), event.params.to.toHexString());
    newTransaction(event);*/
}

/***************************************************************/
// TOKEN
/***************************************************************/

export function addTokenHolder(tokenAddress: string, holder: string): void {
    let token = Token.load(tokenAddress);

    if (token !== null) { //Si el token no existe no hago nada
        let id = tokenAddress.toString().concat('-').concat(holder);
        let tokenBalance = TokenBalance.load(id);

        if (tokenBalance == null) {
            loadTokenBalance(Address.fromString(tokenAddress), holder);
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
    //comprobar que el from sea el owner del moento sino no es un burn
    let token = Token.load(id);

    if (token !== null) {
        token.totalSupply = token.totalSupply.minus(amount);
        token.save();
    }
}

/***************************************************************/
// TRANSACTION
/***************************************************************/

export function newTransaction(event: Transfer): void {
    let txId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
    let tx = Transaction.load(txId);

    if (tx == null) {
        let txId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
        tx = createTransaction(
            txId, 
            event.params.from, 
            event.params.to, 
            event.address.toHexString(), 
            event.params.value.toBigDecimal(), 
            event.params.data, 
            event.block.timestamp, 
            event.transaction.gasUsed.toBigDecimal().times(event.transaction.gasPrice.toBigDecimal()),
            false
        );
    }

    if (event.params.from == Address.fromI32(0)) {
        handleTokenMint(event.address.toString(), event.params.value.toBigDecimal());
    }

    if (event.params.to == Address.fromI32(0)) {
        handleTokenBurn(event.address.toString(), event.params.value.toBigDecimal());
    }

    pushWalletTransaction(tx as Transaction, event.params.to.toHexString());
    pushWalletTransaction(tx as Transaction, event.params.from.toHexString());
}

export function createTransaction(
    txId: string,
    from: Address,
    to: Address,
    currency: string,
    amount: BigDecimal,
    data: Bytes,
    timestamp: BigInt,
    fee: BigDecimal,
    isBankTransaction: boolean
): 
    Transaction 
{
    let tx = new Transaction(txId);

    tx.from = from;
    tx.to = to;
    tx.currency = currency;
    tx.amount = amount;
    tx.data = data;
    tx.timestamp = timestamp;
    tx.fee = fee;
    tx.isBankTransaction = isBankTransaction;

    tx.save();

    return tx as Transaction;
}

/***************************************************************/
// TOKEN BALANCE
/***************************************************************/

export function updateTokenBalance(tokenAddress: Address, walletAddress: string): void {
    let token = Token.load(tokenAddress.toHexString());

    if (token !== null) { //Si el token no existe no hago nada

        let id = tokenAddress.toHexString().concat('-').concat(walletAddress);
        let tokenBalance = TokenBalance.load(id);

        if (tokenBalance == null) { //no existe aún, al crearlo se actualiza/inicializa
            loadTokenBalance(tokenAddress, walletAddress);
        } else { //actualizar si ya existía
            updateBalance(tokenAddress, walletAddress);
    
            //tokenBalance.save();
        }
    }
}

function loadTokenBalance(tokenAddress: Address, walletAddress: string): void {
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
                wallet = new Wallet(walletAddress);
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

function updateBalance(tokenAddress: Address, walletAddress: string): void {
    let id = tokenAddress.toHexString().concat('-').concat(walletAddress);
    let tokenBalance = TokenBalance.load(id);
    
    if (tokenAddress == Address.fromI32(0)) {
        tokenBalance.balance = getBalance(Address.fromString(walletAddress), tokenAddress);
    } else {
        let token = TokenContract.bind(tokenAddress);
        tokenBalance.balance = token.balanceOf(Address.fromString(walletAddress)).toBigDecimal();
    }

    tokenBalance.save();
}