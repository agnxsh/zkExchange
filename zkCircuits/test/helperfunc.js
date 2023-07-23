function createCircomInput(merkleProof, assetsSum) {
  return {
    rootHash: merkleProof.rootHash,
    username: merkleProof.entry.usernameToBigInt,
    balance: merkleProof.entry.balance,
    pathIndices: merkleProof.pathIndices,
    siblingsHashes: merkleProof.siblingsHashes,
    siblingsSums: merkleProof.siblingsSums,
    assetsSum,
  };
}

module.exports = createCircomInput;
