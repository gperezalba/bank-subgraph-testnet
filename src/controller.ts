import { Address, BigDecimal } from "@graphprotocol/graph-ts"
import { NewToken } from "../generated/Controller/Controller"
import { Token } from "../generated/schema"

import { Token as TokenContract } from "../generated/templates/Token/Token"
import { Token as TokenTemplate } from "../generated/templates"

import { addTokenHolder, updateTokenBalance } from "./token"

export function handleTokenCreated(event: NewToken): void {
    addToken(event.params.newToken);
}

export function addToken(tokenAddress: Address): void {
    let token = Token.load(tokenAddress.toHexString());

    if (token == null) {
        token = new Token(tokenAddress.toHexString());
        let contract = TokenContract.bind(tokenAddress);
    
        token.tokenSymbol = contract.symbol();
        token.tokenName = contract.name();
        token.tokenDecimals = contract.decimals();
        token.totalSupply = contract.totalSupply().toBigDecimal();
        token.holders = [];

        TokenTemplate.create(tokenAddress);
    }

    token.save();
}