import { MerkleProof, Node } from './types';
import Entry from './entry';

//this function prepares the fills the merkle sum tree with the appropriate data
export default function createProof(
  index: number,
  entries: Entry[],
  depth: number,
  nodes: Node[][],
  root: Node,
): MerkleProof {
  if (index < 0 || index >= nodes[0].length) {
    throw new Error('The leaf does not exist in this tree');
  }

  const siblingsHashes: bigint[] = [];
  const siblingsSums: bigint[] = [];
  const pathIndices: number[] = [];
  const leafIndex = index;

  for (let level = 0; level < depth; level++) {
    const position = index % 2;
    const levelStartIndex = index - position;
    const levelEndIndex = levelStartIndex + 2;

    pathIndices[level] = position;

    for (let i = levelStartIndex; i < levelEndIndex; i++) {
      if (i != index) {
        siblingsHashes[level] = nodes[level][i].hash;
        siblingsSums[level] = nodes[level][i].sum;
      }
    }
    index = Math.floor(index / 2);
  }

  return {
    rootHash: root.hash,
    entry: entries[leafIndex],
    pathIndices,
    siblingsHashes,
    siblingsSums,
  };
}
