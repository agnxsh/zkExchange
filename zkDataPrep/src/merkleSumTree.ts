import { poseidon } from 'circomlibjs';
import _createProof from './createProof';
import _constructMerkleTree from './constructMerkleTree';
import _indexOfEntry from './indexOfEntry';
import { MerkleProof, Node } from './types';
import Entry from './entry';
import Utils from './utils';
import _verifyProof from './verifyProof';
import _indexOf from './indexOfEntry';
/**
 * A Merkle Sum Tree is a binary Merkle Tree with the following properties:
 * - Each entry of a Merkle Sum Tree is a pair of a username and a balance.
 * - Each Leaf Node contains a hash and a sum. The hash is equal to H(username, balance). The sum is equal to the balance itself.
 * - Each Middle Node contains a hash and a sum. The hash is equal to H(LeftChild.hash, LeftChild.sum, RightChild.hash, RightChild.sum). The sum is equal to the sum of the sums of its children.
 * - The Root Node represents the committed state of the Tree and contains the sum of all the entries' balances.
 * The MerkleSumTree class is a TypeScript implementation of a Merkle Sum tree and it
 * provides all the functions to create a tree starting from a csv file that contains a list of entries in the format  `username -> balance`.
 */

export default class MerkleSumTree {
  static readonly maxDepth = 32;
  private _root: Node;
  private readonly _nodes: Node[][];
  private readonly _depth: number;
  private readonly _entries: Entry[];

  /**
   * Intitializes the tree with the csv file containing the entries of the tree.
   * @param path to the csv file storing the entries.
   */
  constructor(path: string) {
    this._nodes = [];
    this._entries = Utils.parseCsvToEntryData(path);

    //fetch the depth of the tree from the log base 2 of the number of entries rounded to the next integer
    this._depth = Math.ceil(Math.log2(this._entries.length));

    if (this._depth < 1 || this._depth > MerkleSumTree.maxDepth) {
      throw new Error('The tree must be having a depth between 1 and 32');
    }

    //build the tree from the entries
    this._root = _constructMerkleTree(this._entries, this._depth, this._nodes, poseidon);

    //freezing the tree entries
    Object.freeze(this._entries);
    Object.freeze(this._root);
    Object.freeze(this._nodes);
  }

  //returns the root node of the tree
  public get root(): Node {
    return this._root;
  }

  //returns the depth of the tree
  public get depth(): number {
    return this._depth;
  }

  //returns the list of leaves of the tree
  public get leaves(): Node[] {
    return this._nodes[0].slice();
  }

  public get entries(): Entry[] {
    return this._entries;
  }
  /**
   * Returns the index of a leaf. If the leaf does not exist it returns -1.
   * @param username username of the queried entry.
   * @param balance balance of the queried entry.
   * @returns Index of the leaf.
   */
  public indexOf(username: string, balance: bigint): number {
    return _indexOf(username, balance, this._nodes, poseidon);
  }

  /**
   * Returns the index of the leaf, if the leaf doesn't exist it returns -1
   * @param index Index of the proof's leaf
   * @returns MerkleProof object
   */
  public createProof(index: number): MerkleProof {
    return _createProof(index, this._entries, this._depth, this._nodes, this._root);
  }

  /**
   * Verifies the proof and returns true or false
   * It verifies that a leaf is included in the tree and that the sum computed from the leaf to the root is equal to the total sum of the tree.
   */
  public verifyProof(proof: MerkleProof): boolean {
    return _verifyProof(proof, poseidon);
  }
}
