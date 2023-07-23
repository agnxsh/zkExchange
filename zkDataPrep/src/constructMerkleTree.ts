import { Node, HashFunction } from './types';
import { rootNode } from './rootNode';
import Entry from './entry';

export default function constructMerkleTree(
  entries: Entry[],
  depth: number,
  nodes: Node[][],
  hash: HashFunction,
): Node {
  //if entries are not a power of 2, I'm filling it with 0 entries, we do this
  //for the ease of proof generation while coding in circom (zk-circuits)
  while (entries.length < 2 ** depth) {
    entries.push(Entry.zero_entity);
  }

  //looping over each level of the Merkle Sum Tree
  for (let i = 0; i < depth; i++) {
    nodes[i] = [];

    //if the level is 0, the nodes are leaf nodes, hence here the hashing starts
    if (i == 0) {
      for (const entry of entries) {
        nodes[i].push(entry.computeLeaf() as Node);
      }
    }
    //else the nodes are the middle nodes, we need to create them from the previous level
    else {
      for (let j = 0; j < nodes[i - 1].length; j += 2) {
        nodes[i].push(rootNode(nodes[i - 1][j], nodes[i - 1][j + 1], hash));
      }
    }
  }

  //returns the root
  return rootNode(nodes[depth - 1][0], nodes[depth - 1][1], hash);
}
