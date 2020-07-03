import { BigInt } from "@graphprotocol/graph-ts"
import { NewToken, NewNFToken, NewAddress, NewMarket } from "../generated/Controller/Controller";

import { createToken } from "./token"
import { Official, Token } from "../generated/schema";

export function handleTokenCreated(event: NewToken): void {
    createToken(event.params.newToken, false, BigInt.fromI32(0));
}

export function handleNewNFToken(event: NewNFToken): void {
    createToken(event.params.newToken, true, event.params.category);
}

export function handleNewAddress(event: NewAddress): void {
    let official = Official.load(event.params.contractAddress.toHexString());
    
    if (official == null) {
        official = new Official(event.params.contractAddress.toHexString());
    }

    if (event.params.kind == BigInt.fromI32(7)) {
        official.category = event.params.kind;
        official.description = "COMMISSIONS";
    } else if (event.params.kind == BigInt.fromI32(8)) {
        official.category = event.params.kind;
        official.description = "P2P";
    } else if (event.params.kind == BigInt.fromI32(9)) {
        official.category = event.params.kind;
        official.description = "P2P-COMMODITY";
    } else {
        official.category = event.params.kind;
        official.description = "Other";
    }

    official.save();
}

export function handleNewMarket(event: NewMarket): void {
    let official = Official.load(event.params.market.toHexString());
    
    if (official == null) {
        official = new Official(event.params.market.toHexString());
    }

    official.category = BigInt.fromI32(10);
    let market = "Market";
    let tokenA = Token.load(event.params.tokenA.toHexString());
    let tokenB = Token.load(event.params.tokenB.toHexString());

    if ((tokenA != null) && (tokenB != null)) {
        official.description = market.concat(tokenA.tokenSymbol).concat("-").concat(tokenB.tokenSymbol);
    } else {
        official.description = market.concat(event.params.tokenA.toHexString()).concat("-").concat(event.params.tokenB.toHexString());
    }
    
    official.save();
}