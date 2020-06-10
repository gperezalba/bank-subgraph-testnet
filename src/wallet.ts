import { Address } from "@graphprotocol/graph-ts"
import { Transfer } from "../generated/templates/Wallet/Wallet"

import { 
    Wallet,
    Token,
    Transaction,
    BankTransaction,
    BankFee
} from "../generated/schema"

import { Token as TokenContract } from "../generated/templates/Token/Token"

import { createTransaction } from "./token"

export function handleTransfer(event: Transfer): void {
    let txId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
    let tx = Transaction.load(txId);

    if (tx == null) {
        let txId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
        createTransaction(
            txId, 
            event.address, 
            event.params.to, 
            event.params.tokenAddress.toHexString(), 
            event.params.value.toBigDecimal(), 
            event.params.data, 
            event.block.timestamp, 
            event.transaction.gasUsed.toBigDecimal().times(event.transaction.gasPrice.toBigDecimal()),
            true
        );

        tx = Transaction.load(txId);
    }

    let bankTxId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
    let bankTransaction = BankTransaction.load(bankTxId);

    if (bankTransaction == null) {
        bankTransaction = new BankTransaction(bankTxId);
    }

    bankTransaction.transaction = tx.id;
    bankTransaction.kind = event.params.kind;
    bankTransaction.concept = event.params.data.toHexString();
    
    let bankFee = BankFee.load(bankTxId);

    if (bankFee == null) {
        bankFee = new BankFee(bankTxId);
    }

    bankFee.kind = event.params.kind;
    bankFee.fee = event.params.commission.toBigDecimal();

    bankFee.save();

    bankTransaction.bankFee = bankFee.id;

    bankTransaction.save();

    pushWalletBankTransaction(bankTransaction as BankTransaction, event.params.to.toHexString());
    pushWalletBankTransaction(bankTransaction as BankTransaction, event.address.toHexString());
}

export function pushWalletTransaction(tx: Transaction, walletAddress: string): void {
    let currency = tx.currency as string;
    let token = Token.load(currency);

    if (token !== null) {

        let wallet = loadWallet(Address.fromString(walletAddress), false);

        let txs = wallet.transactions;
    
        if (!txs.includes(tx.id)) {
            txs.push(tx.id);
            wallet.transactions = txs;
        }
    
        wallet.save();
    }
}

export function pushWalletBankTransaction(bankTx: BankTransaction, walletAddress: string): void {
    let tx = Transaction.load(bankTx.transaction);
    let token = Token.load(tx.currency);

    if (token !== null) {

        let wallet = loadWallet(Address.fromString(walletAddress), true);

        let txs = wallet.bankTransactions;
    
        if (!txs.includes(bankTx.id)) {
            txs.push(bankTx.id);
            wallet.bankTransactions = txs;
        }
    
        wallet.save();
    }
}

export function loadWallet(address: Address, isBankUser: boolean): Wallet {
    let wallet = Wallet.load(address.toHexString());

    if (wallet == null) {
        wallet = new Wallet(address.toHexString());
        wallet.isBankUser = isBankUser;
        wallet.transactions = [];
        wallet.bankTransactions = [];
    }

    wallet.save();

    return wallet as Wallet;
}