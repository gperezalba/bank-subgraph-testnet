import { Transfer, NewJson } from "../generated/templates/PNFTInterface/PNFTInterface";
import { BigDecimal, BigInt, Address, Bytes } from "@graphprotocol/graph-ts";
import { Token, PackableId, Packable, Wallet, Transaction } from "../generated/schema";
import { NewPNFToken } from "../generated/Controller/Controller";
import { updatePackableTokenBalance } from "./tokenBalance";
import { loadWallet, pushWalletTransaction } from "./wallet";
import { createTransaction } from "./transaction";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function handleTransfer(event: Transfer): void {
    let packableId = event.address.toHexString().concat("-").concat(event.params._tokenId.toString());

    updatePackableTokenBalance(event.params._from.toHexString(), packableId)
    updatePackableTokenBalance(event.params._to.toHexString(), packableId)

    newPackableTransaction(event);
}

export function handleNewJson(event: NewJson): void {
    createPackableId(event);
}

export function createPackable(event: NewPNFToken): void {
    let packable = new Packable(event.params.newToken.toHexString());
    packable.token = event.params.newToken.toHexString();
    packable.tokenKind = event.params.category;
    packable.ids = [];
    packable.save();
}

function createPackableId(event: NewJson): void {
    let packable = Packable.load(event.address.toHexString());
    let packableId = event.address.toHexString().concat("-").concat(event.params.tokenId.toHexString());
    let packableIdEntity = PackableId.load(packableId);

    if (packableIdEntity == null) {
        packableIdEntity = new PackableId(packableId);
    }

    packableIdEntity.packable = packable.id;
    packableIdEntity.tokenId = event.params.tokenId.toHexString();
    packableIdEntity.metadata = event.params.json;

    packableIdEntity.save();

    pushPackableId(event.address.toHexString(), event.params.tokenId.toHexString());
}

function pushPackableId(tokenAddress: string, tokenId: string): void {
    let packable = Packable.load(tokenAddress);
    let ids = packable.ids;

    if (!ids.includes(tokenId)) {
        ids.push(tokenId);
        packable.ids = ids;
        packable.save();
    }
}

function newPackableTransaction(event: Transfer): void {

    let fromWallet = Wallet.load(event.params._from.toHexString());

    if (fromWallet == null) {
        fromWallet = loadWallet(event.params._from, false);
    }

    if (!fromWallet.isBankUser) {
        let txId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
        let tx = Transaction.load(txId);

        if (tx == null) {
            let txId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
            tx = createTransaction(
                txId, 
                event.params._from, 
                event.params._to, 
                event.address.toHexString(), 
                event.params._amount,
                event.params._tokenId.toHexString(),
                new Bytes(0), 
                event.block.timestamp, 
                event.transaction.gasUsed.times(event.transaction.gasPrice),
                false
            );
        }

        pushWalletTransaction(tx as Transaction, event.params._to.toHexString());
        pushWalletTransaction(tx as Transaction, event.params._from.toHexString());
    }
}
