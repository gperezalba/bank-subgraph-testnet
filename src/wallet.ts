import { Address, Bytes, BigDecimal, BigInt } from "@graphprotocol/graph-ts"
import { Transfer, Receive } from "../generated/templates/Wallet/Wallet"

import { 
    Wallet,
    Token,
    Transaction,
    BankTransaction,
    BankFee
} from "../generated/schema"

import { Wallet as WalletContract } from "../generated/templates/Wallet/Wallet"

import { createTransaction } from "./transaction"
import { updateTokenBalance } from "./tokenBalance"

const PI_ADDRESS = "0x0000000000000000000000000000000000000000";

export function handleTransfer(event: Transfer): void {

    if (event.params.tokenAddress.toHexString() == PI_ADDRESS) {
        updateTokenBalance(event.params.tokenAddress, event.params.to.toHexString());
        updateTokenBalance(event.params.tokenAddress, event.address.toHexString());
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
            event.params.value, 
            new Bytes(0), 
            event.block.timestamp, 
            event.transaction.gasUsed.times(event.transaction.gasPrice),
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
    bankFee.fee = event.params.commission;

    bankFee.save();

    bankTransaction.bankFee = bankFee.id;

    bankTransaction.save();

    pushWalletTransaction(tx as Transaction, event.params.to.toHexString());
    pushWalletTransaction(tx as Transaction, event.address.toHexString());
}

export function handleReceive(event: Receive): void {
    if (event.params.tokenAddress.toHexString() == PI_ADDRESS) {

        let fromWallet = Wallet.load(event.params._from.toHexString());

        if (fromWallet == null) {
            fromWallet = loadWallet(event.params._from, false);
        }

        if (!fromWallet.isBankUser) {
            updateTokenBalance(event.params.tokenAddress, event.params._from.toHexString());
            updateTokenBalance(event.params.tokenAddress, event.address.toHexString());

            let txId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
            let tx = Transaction.load(txId);

            if (tx == null) {
                let txId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
                createTransaction(
                    txId, 
                    event.params._from, 
                    event.address, 
                    event.params.tokenAddress.toHexString(), 
                    event.params.value, 
                    new Bytes(0), 
                    event.block.timestamp, 
                    event.transaction.gasUsed.times(event.transaction.gasPrice),
                    true
                );

                tx = Transaction.load(txId);
            }

            pushWalletTransaction(tx as Transaction, event.params._from.toHexString());
            pushWalletTransaction(tx as Transaction, event.address.toHexString());
        }
    }
}

export function pushWalletTransaction(tx: Transaction, walletAddress: string): void {
    let currency = tx.currency as string;
    let token = Token.load(currency);

    if (token != null) {

        let wallet = loadWallet(Address.fromString(walletAddress), false);

        let txs = wallet.transactions;
    
        if (!txs.includes(tx.id)) {
            txs.push(tx.id);
            wallet.transactions = txs;
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
    }

    wallet.save();

    return wallet as Wallet;
}

export function getPiBalance(walletAddress: Address): BigInt {
    let wallet = WalletContract.bind(walletAddress);
    let balance = wallet.try_getInfo();

    if (!balance.reverted) {
        return balance.value.value1[balance.value.value1.length - 1];
    } else {
        return BigInt.fromI32(-1);
    }
}