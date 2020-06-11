import { Address, Bytes } from "@graphprotocol/graph-ts"
import { Transfer } from "../generated/templates/Wallet/Wallet"

import { 
    Wallet,
    Token,
    Transaction,
    BankTransaction,
    BankFee
} from "../generated/schema"

import { Token as TokenContract } from "../generated/templates/Token/Token"

import { createTransaction } from "./transaction"
import { updateTokenBalance } from "./tokenBalance"

const PI_ADDRESS = "0x0000000000000000000000000000000000000000";

export function handleTransfer(event: Transfer): void {

    if (event.params.tokenAddress.toHexString() == PI_ADDRESS) {
        updateTokenBalance(Address.fromI32(0), event.params.to.toHexString());
        updateTokenBalance(Address.fromI32(0), event.address.toHexString());
    }

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
            new Bytes(0), 
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

    bankTransaction.transaction = txId;
    bankTransaction.kind = event.params.kind;
    bankTransaction.concept = event.params.data;
    
    let bankFee = BankFee.load(bankTxId);

    if (bankFee == null) {
        bankFee = new BankFee(bankTxId);
    }

    bankFee.kind = event.params.kind;
    bankFee.fee = event.params.commission.toBigDecimal();

    bankFee.save();

    bankTransaction.bankFee = bankFee.id;

    bankTransaction.save();

    //pushWalletBankTransaction(bankTransaction as BankTransaction, event.params.to.toHexString());
    //pushWalletBankTransaction(bankTransaction as BankTransaction, event.address.toHexString());
    pushWalletTransaction(tx as Transaction, event.params.to.toHexString());
    pushWalletTransaction(tx as Transaction, event.address.toHexString());
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