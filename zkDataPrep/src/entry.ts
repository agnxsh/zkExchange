import { poseidon } from 'circomlibjs';
import { Node } from './types';
import Utils from './utils';

export default class Entry {
  private readonly _usernameToBigInt: bigint;
  private readonly _balance: bigint;
  private readonly _username: string;

  public static zero_entity = new Entry(BigInt(0), BigInt(0));

  constructor(usernameToBigInit: bigint, balance: bigint) {
    if (balance < BigInt(0)) {
      throw new Error('entry balance cant be negative!');
    }
    this._usernameToBigInt = usernameToBigInit;
    this._balance = balance;
    this._username = Utils.stringifyUsername(usernameToBigInit);

    //Freezing the object to prevent any further changes
    Object.freeze(this);
  }

  public computeLeaf(): Node {
    const hashPreimage: bigint[] = [this._usernameToBigInt, this._balance];

    const leaf: Node = { hash: poseidon(hashPreimage), sum: this._balance };

    return leaf;
  }

  public get balance(): bigint {
    return this._balance;
  }

  public get usernameToBigInt(): bigint {
    return this._usernameToBigInt;
  }

  public get username(): string {
    return this._username;
  }
}
