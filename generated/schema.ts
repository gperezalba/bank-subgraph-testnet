// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Identity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Identity entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Identity entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Identity", id.toString(), this);
  }

  static load(id: string): Identity | null {
    return store.get("Identity", id) as Identity | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get dataHash(): Bytes {
    let value = this.get("dataHash");
    return value.toBytes();
  }

  set dataHash(value: Bytes) {
    this.set("dataHash", Value.fromBytes(value));
  }

  get owner(): Bytes {
    let value = this.get("owner");
    return value.toBytes();
  }

  set owner(value: Bytes) {
    this.set("owner", Value.fromBytes(value));
  }

  get recovery(): Bytes {
    let value = this.get("recovery");
    return value.toBytes();
  }

  set recovery(value: Bytes) {
    this.set("recovery", Value.fromBytes(value));
  }

  get state(): i32 {
    let value = this.get("state");
    return value.toI32();
  }

  set state(value: i32) {
    this.set("state", Value.fromI32(value));
  }

  get wallet(): string {
    let value = this.get("wallet");
    return value.toString();
  }

  set wallet(value: string) {
    this.set("wallet", Value.fromString(value));
  }

  get lastModification(): BigInt {
    let value = this.get("lastModification");
    return value.toBigInt();
  }

  set lastModification(value: BigInt) {
    this.set("lastModification", Value.fromBigInt(value));
  }

  get creationTime(): BigInt {
    let value = this.get("creationTime");
    return value.toBigInt();
  }

  set creationTime(value: BigInt) {
    this.set("creationTime", Value.fromBigInt(value));
  }
}

export class Token extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Token entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Token entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Token", id.toString(), this);
  }

  static load(id: string): Token | null {
    return store.get("Token", id) as Token | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get tokenDecimals(): i32 {
    let value = this.get("tokenDecimals");
    return value.toI32();
  }

  set tokenDecimals(value: i32) {
    this.set("tokenDecimals", Value.fromI32(value));
  }

  get tokenSymbol(): string {
    let value = this.get("tokenSymbol");
    return value.toString();
  }

  set tokenSymbol(value: string) {
    this.set("tokenSymbol", Value.fromString(value));
  }

  get tokenName(): string {
    let value = this.get("tokenName");
    return value.toString();
  }

  set tokenName(value: string) {
    this.set("tokenName", Value.fromString(value));
  }

  get totalSupply(): BigInt {
    let value = this.get("totalSupply");
    return value.toBigInt();
  }

  set totalSupply(value: BigInt) {
    this.set("totalSupply", Value.fromBigInt(value));
  }

  get holders(): Array<string> | null {
    let value = this.get("holders");
    if (value === null) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set holders(value: Array<string> | null) {
    if (value === null) {
      this.unset("holders");
    } else {
      this.set("holders", Value.fromStringArray(value as Array<string>));
    }
  }

  get updated(): boolean {
    let value = this.get("updated");
    return value.toBoolean();
  }

  set updated(value: boolean) {
    this.set("updated", Value.fromBoolean(value));
  }

  get isNFT(): boolean {
    let value = this.get("isNFT");
    return value.toBoolean();
  }

  set isNFT(value: boolean) {
    this.set("isNFT", Value.fromBoolean(value));
  }

  get nftCategory(): BigInt | null {
    let value = this.get("nftCategory");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set nftCategory(value: BigInt | null) {
    if (value === null) {
      this.unset("nftCategory");
    } else {
      this.set("nftCategory", Value.fromBigInt(value as BigInt));
    }
  }
}

export class Wallet extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Wallet entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Wallet entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Wallet", id.toString(), this);
  }

  static load(id: string): Wallet | null {
    return store.get("Wallet", id) as Wallet | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get name(): string | null {
    let value = this.get("name");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set name(value: string | null) {
    if (value === null) {
      this.unset("name");
    } else {
      this.set("name", Value.fromString(value as string));
    }
  }

  get identity(): string | null {
    let value = this.get("identity");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set identity(value: string | null) {
    if (value === null) {
      this.unset("identity");
    } else {
      this.set("identity", Value.fromString(value as string));
    }
  }

  get isBankUser(): boolean {
    let value = this.get("isBankUser");
    return value.toBoolean();
  }

  set isBankUser(value: boolean) {
    this.set("isBankUser", Value.fromBoolean(value));
  }

  get balances(): Array<string> | null {
    let value = this.get("balances");
    if (value === null) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set balances(value: Array<string> | null) {
    if (value === null) {
      this.unset("balances");
    } else {
      this.set("balances", Value.fromStringArray(value as Array<string>));
    }
  }

  get transactions(): Array<string> | null {
    let value = this.get("transactions");
    if (value === null) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set transactions(value: Array<string> | null) {
    if (value === null) {
      this.unset("transactions");
    } else {
      this.set("transactions", Value.fromStringArray(value as Array<string>));
    }
  }
}

export class Name extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Name entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Name entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Name", id.toString(), this);
  }

  static load(id: string): Name | null {
    return store.get("Name", id) as Name | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get name(): string | null {
    let value = this.get("name");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set name(value: string | null) {
    if (value === null) {
      this.unset("name");
    } else {
      this.set("name", Value.fromString(value as string));
    }
  }

  get wallet(): string {
    let value = this.get("wallet");
    return value.toString();
  }

  set wallet(value: string) {
    this.set("wallet", Value.fromString(value));
  }

  get owner(): Bytes | null {
    let value = this.get("owner");
    if (value === null) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set owner(value: Bytes | null) {
    if (value === null) {
      this.unset("owner");
    } else {
      this.set("owner", Value.fromBytes(value as Bytes));
    }
  }
}

export class TokenBalance extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save TokenBalance entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save TokenBalance entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("TokenBalance", id.toString(), this);
  }

  static load(id: string): TokenBalance | null {
    return store.get("TokenBalance", id) as TokenBalance | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get token(): string {
    let value = this.get("token");
    return value.toString();
  }

  set token(value: string) {
    this.set("token", Value.fromString(value));
  }

  get wallet(): string {
    let value = this.get("wallet");
    return value.toString();
  }

  set wallet(value: string) {
    this.set("wallet", Value.fromString(value));
  }

  get balance(): BigInt {
    let value = this.get("balance");
    return value.toBigInt();
  }

  set balance(value: BigInt) {
    this.set("balance", Value.fromBigInt(value));
  }

  get commodities(): Array<string> | null {
    let value = this.get("commodities");
    if (value === null) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set commodities(value: Array<string> | null) {
    if (value === null) {
      this.unset("commodities");
    } else {
      this.set("commodities", Value.fromStringArray(value as Array<string>));
    }
  }

  get updated(): boolean {
    let value = this.get("updated");
    return value.toBoolean();
  }

  set updated(value: boolean) {
    this.set("updated", Value.fromBoolean(value));
  }
}

export class BankTransaction extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save BankTransaction entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save BankTransaction entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("BankTransaction", id.toString(), this);
  }

  static load(id: string): BankTransaction | null {
    return store.get("BankTransaction", id) as BankTransaction | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get transaction(): string {
    let value = this.get("transaction");
    return value.toString();
  }

  set transaction(value: string) {
    this.set("transaction", Value.fromString(value));
  }

  get kind(): BigInt | null {
    let value = this.get("kind");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set kind(value: BigInt | null) {
    if (value === null) {
      this.unset("kind");
    } else {
      this.set("kind", Value.fromBigInt(value as BigInt));
    }
  }

  get concept(): string | null {
    let value = this.get("concept");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set concept(value: string | null) {
    if (value === null) {
      this.unset("concept");
    } else {
      this.set("concept", Value.fromString(value as string));
    }
  }

  get bankFee(): string | null {
    let value = this.get("bankFee");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set bankFee(value: string | null) {
    if (value === null) {
      this.unset("bankFee");
    } else {
      this.set("bankFee", Value.fromString(value as string));
    }
  }

  get info(): string | null {
    let value = this.get("info");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set info(value: string | null) {
    if (value === null) {
      this.unset("info");
    } else {
      this.set("info", Value.fromString(value as string));
    }
  }
}

export class Transaction extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Transaction entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Transaction entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Transaction", id.toString(), this);
  }

  static load(id: string): Transaction | null {
    return store.get("Transaction", id) as Transaction | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get from(): string {
    let value = this.get("from");
    return value.toString();
  }

  set from(value: string) {
    this.set("from", Value.fromString(value));
  }

  get to(): string {
    let value = this.get("to");
    return value.toString();
  }

  set to(value: string) {
    this.set("to", Value.fromString(value));
  }

  get currency(): string {
    let value = this.get("currency");
    return value.toString();
  }

  set currency(value: string) {
    this.set("currency", Value.fromString(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    return value.toBigInt();
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }

  get data(): Bytes {
    let value = this.get("data");
    return value.toBytes();
  }

  set data(value: Bytes) {
    this.set("data", Value.fromBytes(value));
  }

  get fee(): BigInt {
    let value = this.get("fee");
    return value.toBigInt();
  }

  set fee(value: BigInt) {
    this.set("fee", Value.fromBigInt(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get isBankTransaction(): boolean {
    let value = this.get("isBankTransaction");
    return value.toBoolean();
  }

  set isBankTransaction(value: boolean) {
    this.set("isBankTransaction", Value.fromBoolean(value));
  }

  get bankTransaction(): string | null {
    let value = this.get("bankTransaction");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set bankTransaction(value: string | null) {
    if (value === null) {
      this.unset("bankTransaction");
    } else {
      this.set("bankTransaction", Value.fromString(value as string));
    }
  }

  get nftCategory(): BigInt | null {
    let value = this.get("nftCategory");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set nftCategory(value: BigInt | null) {
    if (value === null) {
      this.unset("nftCategory");
    } else {
      this.set("nftCategory", Value.fromBigInt(value as BigInt));
    }
  }

  get nftDescription(): string | null {
    let value = this.get("nftDescription");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set nftDescription(value: string | null) {
    if (value === null) {
      this.unset("nftDescription");
    } else {
      this.set("nftDescription", Value.fromString(value as string));
    }
  }

  get officialCategory(): BigInt | null {
    let value = this.get("officialCategory");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set officialCategory(value: BigInt | null) {
    if (value === null) {
      this.unset("officialCategory");
    } else {
      this.set("officialCategory", Value.fromBigInt(value as BigInt));
    }
  }

  get officialDescription(): string | null {
    let value = this.get("officialDescription");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set officialDescription(value: string | null) {
    if (value === null) {
      this.unset("officialDescription");
    } else {
      this.set("officialDescription", Value.fromString(value as string));
    }
  }
}

export class BankFee extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save BankFee entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save BankFee entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("BankFee", id.toString(), this);
  }

  static load(id: string): BankFee | null {
    return store.get("BankFee", id) as BankFee | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get transaction(): string {
    let value = this.get("transaction");
    return value.toString();
  }

  set transaction(value: string) {
    this.set("transaction", Value.fromString(value));
  }

  get fee(): BigInt | null {
    let value = this.get("fee");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set fee(value: BigInt | null) {
    if (value === null) {
      this.unset("fee");
    } else {
      this.set("fee", Value.fromBigInt(value as BigInt));
    }
  }

  get kind(): BigInt | null {
    let value = this.get("kind");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set kind(value: BigInt | null) {
    if (value === null) {
      this.unset("kind");
    } else {
      this.set("kind", Value.fromBigInt(value as BigInt));
    }
  }

  get info(): string | null {
    let value = this.get("info");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set info(value: string | null) {
    if (value === null) {
      this.unset("info");
    } else {
      this.set("info", Value.fromString(value as string));
    }
  }
}

export class Commodity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Commodity entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Commodity entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Commodity", id.toString(), this);
  }

  static load(id: string): Commodity | null {
    return store.get("Commodity", id) as Commodity | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get tokenId(): BigInt {
    let value = this.get("tokenId");
    return value.toBigInt();
  }

  set tokenId(value: BigInt) {
    this.set("tokenId", Value.fromBigInt(value));
  }

  get gold(): string | null {
    let value = this.get("gold");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set gold(value: string | null) {
    if (value === null) {
      this.unset("gold");
    } else {
      this.set("gold", Value.fromString(value as string));
    }
  }

  get diamond(): string | null {
    let value = this.get("diamond");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set diamond(value: string | null) {
    if (value === null) {
      this.unset("diamond");
    } else {
      this.set("diamond", Value.fromString(value as string));
    }
  }
}

export class Gold extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Gold entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Gold entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Gold", id.toString(), this);
  }

  static load(id: string): Gold | null {
    return store.get("Gold", id) as Gold | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get owner(): string | null {
    let value = this.get("owner");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set owner(value: string | null) {
    if (value === null) {
      this.unset("owner");
    } else {
      this.set("owner", Value.fromString(value as string));
    }
  }

  get reference(): string | null {
    let value = this.get("reference");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set reference(value: string | null) {
    if (value === null) {
      this.unset("reference");
    } else {
      this.set("reference", Value.fromString(value as string));
    }
  }

  get token(): string | null {
    let value = this.get("token");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set token(value: string | null) {
    if (value === null) {
      this.unset("token");
    } else {
      this.set("token", Value.fromString(value as string));
    }
  }

  get weight_brute(): BigInt | null {
    let value = this.get("weight_brute");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set weight_brute(value: BigInt | null) {
    if (value === null) {
      this.unset("weight_brute");
    } else {
      this.set("weight_brute", Value.fromBigInt(value as BigInt));
    }
  }

  get weight_fine(): BigInt | null {
    let value = this.get("weight_fine");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set weight_fine(value: BigInt | null) {
    if (value === null) {
      this.unset("weight_fine");
    } else {
      this.set("weight_fine", Value.fromBigInt(value as BigInt));
    }
  }

  get law(): BigInt | null {
    let value = this.get("law");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set law(value: BigInt | null) {
    if (value === null) {
      this.unset("law");
    } else {
      this.set("law", Value.fromBigInt(value as BigInt));
    }
  }

  get isLive(): boolean {
    let value = this.get("isLive");
    return value.toBoolean();
  }

  set isLive(value: boolean) {
    this.set("isLive", Value.fromBoolean(value));
  }

  get isFake(): boolean {
    let value = this.get("isFake");
    return value.toBoolean();
  }

  set isFake(value: boolean) {
    this.set("isFake", Value.fromBoolean(value));
  }

  get commodity(): string | null {
    let value = this.get("commodity");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set commodity(value: string | null) {
    if (value === null) {
      this.unset("commodity");
    } else {
      this.set("commodity", Value.fromString(value as string));
    }
  }
}

export class Diamond extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Diamond entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Diamond entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Diamond", id.toString(), this);
  }

  static load(id: string): Diamond | null {
    return store.get("Diamond", id) as Diamond | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get owner(): string | null {
    let value = this.get("owner");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set owner(value: string | null) {
    if (value === null) {
      this.unset("owner");
    } else {
      this.set("owner", Value.fromString(value as string));
    }
  }

  get reference(): string | null {
    let value = this.get("reference");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set reference(value: string | null) {
    if (value === null) {
      this.unset("reference");
    } else {
      this.set("reference", Value.fromString(value as string));
    }
  }

  get token(): string | null {
    let value = this.get("token");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set token(value: string | null) {
    if (value === null) {
      this.unset("token");
    } else {
      this.set("token", Value.fromString(value as string));
    }
  }

  get color(): BigInt | null {
    let value = this.get("color");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set color(value: BigInt | null) {
    if (value === null) {
      this.unset("color");
    } else {
      this.set("color", Value.fromBigInt(value as BigInt));
    }
  }

  get clarity(): BigInt | null {
    let value = this.get("clarity");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set clarity(value: BigInt | null) {
    if (value === null) {
      this.unset("clarity");
    } else {
      this.set("clarity", Value.fromBigInt(value as BigInt));
    }
  }

  get cut(): BigInt | null {
    let value = this.get("cut");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set cut(value: BigInt | null) {
    if (value === null) {
      this.unset("cut");
    } else {
      this.set("cut", Value.fromBigInt(value as BigInt));
    }
  }

  get carat_weight(): BigInt | null {
    let value = this.get("carat_weight");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set carat_weight(value: BigInt | null) {
    if (value === null) {
      this.unset("carat_weight");
    } else {
      this.set("carat_weight", Value.fromBigInt(value as BigInt));
    }
  }

  get isLive(): boolean {
    let value = this.get("isLive");
    return value.toBoolean();
  }

  set isLive(value: boolean) {
    this.set("isLive", Value.fromBoolean(value));
  }

  get isFake(): boolean {
    let value = this.get("isFake");
    return value.toBoolean();
  }

  set isFake(value: boolean) {
    this.set("isFake", Value.fromBoolean(value));
  }

  get commodity(): string | null {
    let value = this.get("commodity");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set commodity(value: string | null) {
    if (value === null) {
      this.unset("commodity");
    } else {
      this.set("commodity", Value.fromString(value as string));
    }
  }
}

export class Official extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Official entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Official entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Official", id.toString(), this);
  }

  static load(id: string): Official | null {
    return store.get("Official", id) as Official | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get category(): BigInt {
    let value = this.get("category");
    return value.toBigInt();
  }

  set category(value: BigInt) {
    this.set("category", Value.fromBigInt(value));
  }

  get description(): string {
    let value = this.get("description");
    return value.toString();
  }

  set description(value: string) {
    this.set("description", Value.fromString(value));
  }
}
