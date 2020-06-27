import { Transfer, ERC721, NewJson } from "../generated/templates/ERC721/ERC721";
import { Token, Commodity, Gold, Diamond } from "../generated/schema";
import { BigDecimal, BigInt, Address } from "@graphprotocol/graph-ts";
import { pushCommodity, popCommodity } from "./tokenBalance";
import { addTokenHolder } from "./token";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function handleTransfer(event: Transfer): void {

    let commodityId = event.address.toHexString().concat("-").concat(event.params._tokenId.toString());

    if (event.params._to == Address.fromString(ZERO_ADDRESS)) {
        burnCommodity(event.address.toHexString(), event.params._tokenId);
    } else {
        pushCommodity(commodityId, event.address, event.params._to.toHexString());
        addTokenHolder(event.address.toHexString(), event.params._to.toHexString());
    }

    if (event.params._from != Address.fromString(ZERO_ADDRESS)) {
        popCommodity(commodityId, event.address, event.params._from.toHexString());
    }

    updateOwner(event.address.toHexString(), event.params._tokenId, event.params._from, event.params._to);
}

export function handleNewJson(event: NewJson): void {
    let token = Token.load(event.address.toHexString());
    let id = event.address.toHexString().concat("-").concat(event.params.tokenId.toString());

    let commodity = Commodity.load(id);

    if (commodity == null) {
        commodity = new Commodity(id);

        commodity.tokenId = event.params.tokenId;

        if (token.nftCategory == BigInt.fromI32(1)) {
            let gold = new Gold(id);
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
            let diamond = new Diamond(id);
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
    } else {
        if (token.nftCategory == BigInt.fromI32(1)) {
            let gold = new Gold(id);
            
            gold.isLive = true;

            gold.save();
        } else if (token.nftCategory == BigInt.fromI32(2)) {
            let diamond = new Diamond(id);
            
            diamond.isLive = true;

            diamond.save();
        }
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