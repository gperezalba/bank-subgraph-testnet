import { Address, BigDecimal, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { Transfer } from "../generated/templates/Token/Token"

import { 
    Transaction, Wallet
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
                event.params.value.toBigDecimal(), 
                event.params.data, 
                event.block.timestamp, 
                event.transaction.gasUsed.toBigDecimal().times(event.transaction.gasPrice.toBigDecimal()),
                false
            );
        }

        pushWalletTransaction(tx as Transaction, event.params.to.toHexString());
        pushWalletTransaction(tx as Transaction, event.params.from.toHexString());
    }

    if (event.params.from == Address.fromI32(0)) {
        handleTokenMint(event.address.toString(), event.params.value.toBigDecimal());
    }

    if (event.params.to == Address.fromI32(0)) {
        handleTokenBurn(event.address.toString(), event.params.value.toBigDecimal());
    }
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