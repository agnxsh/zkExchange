import { Node, HashFunction } from './types';
import Utils from './utils';
import Entry from './entry';

export default function indexOf(username: string, balance: bigint, nodes: Node[][], hash: HashFunction): number {
  const usernameToBigInit = Utils.parseUsername(username);

  const entry = new Entry(usernameToBigInit, balance);

  const leaf = entry.computeLeaf();

  return nodes[0].map((x) => x.hash).indexOf(leaf.hash);
}
