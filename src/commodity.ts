import { Transfer, ERC721, NewJson, FakeToken } from "../generated/templates/ERC721/ERC721";
import { Token, Commodity, Wallet, Transaction, Gold, Diamond } from "../generated/schema";
import { BigDecimal, BigInt, Address, Bytes } from "@graphprotocol/graph-ts";
import { pushCommodity, popCommodity, getOneEther } from "./tokenBalance";
import { addTokenHolder } from "./token";
import { loadWallet, pushWalletTransaction } from "./wallet";
import { createTransaction } from "./transaction";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function handleTransfer(event: Transfer): void {

    let commodityId = event.address.toHexString().concat("-").concat(event.params._tokenId.toString());

    if (event.params._from == Address.fromString(ZERO_ADDRESS)) {
        mintCommodity(event.address.toHexString(), event.params._tokenId);
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
    newTransaction(event);
}

export function handleNewJson(event: NewJson): void {
    let token = Token.load(event.address.toHexString());
    let id = event.address.toHexString().concat("-").concat(event.params.tokenId.toString());

    let commodity = Commodity.load(id);

    if (commodity == null) {
        commodity = new Commodity(id);
    }

    commodity.token = token.id;
    commodity.tokenId = event.params.tokenId;

    let tokenNFT = ERC721.bind(event.address);
    let ref = tokenNFT.try_getRefById(event.params.tokenId);
    if (!ref.reverted) {
        commodity.reference = ref.value;
    } else {
        commodity.reference = "reverted";
    }

    commodity.isLive = true;
    commodity.isFake = false;

    let json: Array<BigInt> = event.params.json;
    commodity.key0 = json[0];
    commodity.key1 = json[1];
    commodity.key2 = json[2];
    commodity.key3 = json[3];
    commodity.key4 = json[4];

    commodity.nftCategory = token.nftCategory;

    /******************** */

    let gold = Gold.load(id);
    let diamond = Diamond.load(id);

    if (token.nftCategory == BigInt.fromI32(1)) {
        if (gold == null) {
            gold = new Gold(id);
        }
    } else {
        if (diamond == null) {
            diamond = new Diamond(id);
        }
    }

    if (token.nftCategory == BigInt.fromI32(1)) {
        let tokenNFT = ERC721.bind(event.address);
        gold.token = event.address.toHexString();
        gold.isLive = true;
        gold.isFake = false;

        let ref = tokenNFT.try_getRefById(event.params.tokenId);

        if (!ref.reverted) {
            gold.reference = ref.value;
        } else {
            gold.reference = "reverted";
        }

        let json: Array<BigInt> = event.params.json;
        gold.weight_brute = json[0];
        gold.law = json[1];
        gold.weight_fine = json[0].times(json[1]).div(BigInt.fromI32(1000).times(getOneEther()));

        gold.save();
        commodity.gold = id;
    } else if (token.nftCategory == BigInt.fromI32(2)) {
        let token = ERC721.bind(event.address);
        diamond.token = event.address.toHexString();
        diamond.isLive = true;
        diamond.isFake = false;

        let ref = token.try_getRefById(event.params.tokenId);

        if (!ref.reverted) {
            diamond.reference = ref.value;
        } else {
            diamond.reference = "reverted";
        }

        let json: Array<BigInt> = event.params.json;
        diamond.color = json[0];
        diamond.clarity = json[1];
        diamond.cut = json[2];
        diamond.carat_weight = json[3];

        diamond.save();
        commodity.diamond = id;
    }


    /******************** */

    commodity.save();
}

function updateOwner(tokenAddress: string, tokenId: BigInt, from: Address, to: Address): void {
    let token = Token.load(tokenAddress);
    let id = tokenAddress.concat("-").concat(tokenId.toString());
    let commodity = Commodity.load(id);

    if (commodity != null) {
        commodity.owner = to.toHexString();
    }

    commodity.save();
}

function burnCommodity(tokenAddress: string, tokenId: BigInt): void {
    let id = tokenAddress.concat("-").concat(tokenId.toString());
    let commodity = Commodity.load(id);

    if (commodity != null) {
        commodity.isLive = false;
    }

    commodity.save();
}

export function mintCommodity(tokenAddress: string, tokenId: BigInt): void {
    let id = tokenAddress.concat("-").concat(tokenId.toString());
    let commodity = Commodity.load(id);

    if (commodity == null) {
        commodity = new Commodity(id);
    }

    commodity.isLive = true;

    commodity.save();
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
                event.params._tokenId,
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

export function handleFakeToken(event: FakeToken): void {
    let id = event.address.toHexString().concat("-").concat(event.params.tokenId.toString());
    let commodity = Commodity.load(id);

    if (commodity != null) {
        commodity.isFake = true;
    }

    commodity.save();
}