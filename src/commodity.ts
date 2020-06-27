import { Transfer, ERC721, NewJson } from "../generated/templates/ERC721/ERC721";
import { Token, Commodity, Gold, Diamond, Wallet, Transaction } from "../generated/schema";
import { BigDecimal, BigInt, Address, Bytes } from "@graphprotocol/graph-ts";
import { pushCommodity, popCommodity } from "./tokenBalance";
import { addTokenHolder } from "./token";
import { loadWallet, pushWalletTransaction } from "./wallet";
import { createTransaction } from "./transaction";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function handleTransfer(event: Transfer): void {

    let commodityId = event.address.toHexString().concat("-").concat(event.params._tokenId.toString());

    if (event.params._from == Address.fromString(ZERO_ADDRESS)) {
        mintCommodity(event);
    } else {
        popCommodity(commodityId, event.address, event.params._from.toHexString());
    }

    if (event.params._to == Address.fromString(ZERO_ADDRESS)) {
        burnCommodity(event.address.toHexString(), event.params._tokenId);
    } else {
        pushCommodity(commodityId, event.address, event.params._to.toHexString());
        addTokenHolder(event.address.toHexString(), event.params._to.toHexString());
    }

    updateOwner(event.address.toHexString(), event.params._tokenId, event.params._from, event.params._to);
    //newTransaction(event);
}

export function handleNewJson(event: NewJson): void {
    let token = Token.load(event.address.toHexString());
    let id = event.address.toHexString().concat("-").concat(event.params.tokenId.toString());

    let commodity = Commodity.load(id);

    let gold = Gold.load(id);
    let diamond = Diamond.load(id);

    if (commodity == null) {
        commodity = new Commodity(id);
        if (token.nftCategory == BigInt.fromI32(1)) {
            gold = new Gold(id);
        } else {
            diamond = new Diamond(id);
        }
    }

    commodity.tokenId = event.params.tokenId;

    if (token.nftCategory == BigInt.fromI32(1)) {
        let token = ERC721.bind(event.address);
        gold.token = event.address.toHexString();
        gold.owner = ZERO_ADDRESS;
        gold.isLive = true;

        let ref = token.try_getRefById(event.params.tokenId);

        if (!ref.reverted) {
            gold.reference = ref.value;
        } else {
            gold.reference = "reverted";
        }

        let json: Array<BigInt> = event.params.json;
        gold.weight_brute = json[0].toBigDecimal();
        gold.law = json[1].toBigDecimal();
        gold.weight_fine = json[2].toBigDecimal();

        gold.save();
        commodity.gold = id;
    } else if (token.nftCategory == BigInt.fromI32(2)) {
        let token = ERC721.bind(event.address);
        diamond.token = event.address.toHexString();
        diamond.owner = ZERO_ADDRESS;
        diamond.isLive = true;

        let ref = token.try_getRefById(event.params.tokenId);

        if (!ref.reverted) {
            diamond.reference = ref.value;
        } else {
            diamond.reference = "reverted";
        }

        let json: Array<BigInt> = event.params.json;
        diamond.color = json[0].toBigDecimal();
        diamond.clarity = json[1].toBigDecimal();
        diamond.cut = json[2].toBigDecimal();
        diamond.carat_weight = json[3].toBigDecimal();

        diamond.save();
        commodity.diamond = id;
    }

    commodity.save();
}

function updateOwner(tokenAddress: string, tokenId: BigInt, from: Address, to: Address): void {
    let token = Token.load(tokenAddress);
    let id = tokenAddress.concat("-").concat(tokenId.toString());

    if (token.nftCategory == BigInt.fromI32(1)) {
        let gold = Gold.load(id);
        
        gold.owner = to.toHexString();

        gold.save();
    } else if (token.nftCategory == BigInt.fromI32(2)) {
        let diamond = Diamond.load(id);
        
        diamond.owner = to.toHexString();

        diamond.save();
    }
}

export function mintCommodity(event: Transfer): void {
    let token = Token.load(event.address.toHexString());
    let id = event.address.toHexString().concat("-").concat(event.params._tokenId.toString());

    let commodity = Commodity.load(id);
    let gold = Gold.load(id);
    let diamond = Diamond.load(id);

    if (commodity == null) {
        commodity = new Commodity(id);
        if (token.nftCategory == BigInt.fromI32(1)) {
            gold = new Gold(id);
        } else {
            diamond = new Diamond(id);
        }
    }

    commodity.tokenId = event.params._tokenId;

    if (token.nftCategory == BigInt.fromI32(1)) {
        let token = ERC721.bind(event.address);
        gold.token = event.address.toHexString();
        gold.owner = ZERO_ADDRESS;
        gold.isLive = true;

        let ref = token.try_getRefById(event.params._tokenId);

        if (!ref.reverted) {
            gold.reference = ref.value;
        } else {
            gold.reference = "reverted";
        }

        gold.save();
        commodity.gold = id;
    } else if (token.nftCategory == BigInt.fromI32(2)) {
        let token = ERC721.bind(event.address);
        diamond.token = event.address.toHexString();
        diamond.owner = ZERO_ADDRESS;
        diamond.isLive = true;

        let ref = token.try_getRefById(event.params._tokenId);

        if (!ref.reverted) {
            diamond.reference = ref.value;
        } else {
            diamond.reference = "reverted";
        }

        diamond.save();
        commodity.diamond = id;
    }

    commodity.save();
}

function burnCommodity(tokenAddress: string, tokenId: BigInt): void {
    let token = Token.load(tokenAddress);
    let id = tokenAddress.concat("-").concat(tokenId.toString());

    if (token.nftCategory == BigInt.fromI32(1)) {
        let gold = Gold.load(id);
        
        gold.isLive = false;

        gold.save();
    } else if (token.nftCategory == BigInt.fromI32(2)) {
        let diamond = Diamond.load(id);
        
        diamond.isLive = false;

        diamond.save();
    }
}

function newTransaction(event: Transfer): void {

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
                event.params._tokenId.toBigDecimal(), 
                new Bytes(0), 
                event.block.timestamp, 
                event.transaction.gasUsed.toBigDecimal().times(event.transaction.gasPrice.toBigDecimal()),
                false
            );
        }

        pushWalletTransaction(tx as Transaction, event.params._to.toHexString());
        pushWalletTransaction(tx as Transaction, event.params._from.toHexString());
    }
}