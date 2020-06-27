import { BigInt } from "@graphprotocol/graph-ts"
import { NewToken, NewNFToken } from "../generated/Controller/Controller";

import { createToken } from "./token"

export function handleTokenCreated(event: NewToken): void {
    createToken(event.params.newToken, false, BigInt.fromI32(0));
}

export function handleNewNFToken(event: NewNFToken): void {
    createToken(event.params.newToken, true, event.params.category);
  }