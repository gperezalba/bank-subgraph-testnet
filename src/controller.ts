import { NewToken } from "../generated/Controller/Controller";

import { createToken } from "./token"

export function handleTokenCreated(event: NewToken): void {
    createToken(event.params.newToken);
}