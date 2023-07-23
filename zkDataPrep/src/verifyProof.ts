import { rootNode } from './rootNode';
import { HashFunction, MerkleProof, Node } from './types';

export default function verifyProof(proof: MerkleProof, hash: HashFunction): boolean {
  let sum = proof.entry.balance;

  let node: Node = proof.entry.computeLeaf();

  for (let i = 0; i < proof.siblingsHashes.length; i++) {
    const siblingNode = { hash: proof.siblingsHashes[i], sum: proof.siblingsSums[i] };

    if (proof.pathIndices[i] == 0) {
      node = rootNode(node, siblingNode, hash);
    } else {
      node = rootNode(siblingNode, node, hash);
    }

    sum += siblingNode.sum;
  }
  return proof.rootHash === node.hash && sum === node.sum;
}
