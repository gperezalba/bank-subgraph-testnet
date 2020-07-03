import { Address, BigDecimal, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { Transfer } from "../generated/templates/Token/Token"

import { 
    Transaction, Wallet, Official
} from "../generated/schema"

import { pushWalletTransaction, loadWallet } from "./wallet"
import { handleTokenMint, handleTokenBurn } from "./token";

export function newTransaction(event: Transfer): void {

    let fromWallet = Wallet.load(event.params.from.toHexString());

    if (fromWallet == null) {
        fromWallet = loadWallet(event.params.from, false);
    }

    if (!fromWallet.isBankUser) {
        let txId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
        let tx = Transaction.load(txId);

        if (tx == null) {
            let txId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
            tx = createTransaction(
                txId, 
                event.params.from, 
                event.params.to, 
                event.address.toHexString(), 
                event.params.value, 
                event.params.data, 
                event.block.timestamp, 
                event.transaction.gasUsed.times(event.transaction.gasPrice),
                false
            );
        }

        pushWalletTransaction(tx as Transaction, event.params.to.toHexString());
        pushWalletTransaction(tx as Transaction, event.params.from.toHexString());
    }

    if (event.params.from == Address.fromI32(0)) {
        handleTokenMint(event.address.toHexString(), event.params.value);
    }

    if (event.params.to == Address.fromI32(0)) {
        handleTokenBurn(event.address.toHexString(), event.params.value);
    }
}

export function createTransaction(
    txId: string,
    from: Address,
    to: Address,
    currency: string,
    amount: BigInt,
    data: Bytes,
    timestamp: BigInt,
    fee: BigInt,
    isBankTransaction: boolean
): 
    Transaction 
{
    let tx = new Transaction(txId);

    let fromWallet = loadWallet(from, false);
    let toWallet = loadWallet(to, false);

    tx.from = fromWallet.id;
    tx.to = toWallet.id;
    tx.currency = currency;
    tx.amount = amount;
    tx.data = data;
    tx.timestamp = timestamp;
    tx.fee = fee;
    tx.isBankTransaction = isBankTransaction;

    let officialFrom = Official.load(fromWallet.id);
    let officialTo = Official.load(toWallet.id);

    if (officialFrom != null) {
        tx.officialCategory = officialFrom.category;
        tx.officialDescription = officialFrom.description
    } else if (officialTo != null) {
        tx.officialCategory = officialTo.category;
        tx.officialDescription = officialTo.description
    } else {
        tx.officialCategory = BigInt.fromI32(0);
        tx.officialDescription = "";
    }

    tx.save();

    return tx as Transaction;
}