import { HashFunction, Node } from './types';

export function rootNode(childL: Node, childR: Node, hash: HashFunction) {
  const createRootNode = { hash: hash([childL.hash, childR.hash, childR.sum]), sum: childL.sum + childR.sum };

  if (createRootNode.sum < BigInt(0)) {
    throw new Error('Root Node sum cannot be negative!!');
  }
  return createRootNode;
}
