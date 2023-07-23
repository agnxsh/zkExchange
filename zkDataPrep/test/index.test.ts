import { MerkleProof, MerkleSumTree } from '../src';
import Entry from '../src/entry';

describe('Merkle Sum Tree', () => {
  let tree: MerkleSumTree;

  beforeEach(() => {
    const pathToCsv = 'test/entryPatterns/entry-16-valid.csv';

    tree = new MerkleSumTree(pathToCsv);
  });

  it('Should not initialise the merkle sum tree if the csv contains invalid balance type', () => {
    const pathToInvalidCsv = 'test/entryPatterns/entry-16-invalid-balance-type.csv';
    const fun1 = () => new MerkleSumTree(pathToInvalidCsv);
    expect(fun1).toThrow('Balance must be a number');
  });

  it('Should initialise the merkle sum tree with the right parameters', () => {
    expect(tree.depth).toEqual(4);
    expect(tree.root.sum).toEqual(BigInt(84359));
  });

  it('Should not allow to initialize a tree with at least a negative balance', () => {
    // build invalid tree
    const pathToInvalidCsv = 'test/entryPatterns/entry-16-neg-balance.csv';
    const fun = () => new MerkleSumTree(pathToInvalidCsv);

    expect(fun).toThrow('entry balance cant be negative');
  });

  it('Should generate different root hashes when changing the entry order', () => {
    const pathToCsvWithSwitchedOrder = 'test/entryPatterns/entry-16-valid-switched-order.csv';

    let tree2 = new MerkleSumTree(pathToCsvWithSwitchedOrder);

    expect(tree.root.hash).not.toEqual(tree2.root.hash);
  });

  it('Should generate a tree which depth should be log2(next power of two of number of entryPatterns)', () => {
    const pathToCsvWith17entryPatterns = 'test/entryPatterns/entry-17-valid.csv';
    const pathToCsvWith15entryPatterns = 'test/entryPatterns/entry-15-valid.csv';

    const tree17 = new MerkleSumTree(pathToCsvWith17entryPatterns);
    const tree15 = new MerkleSumTree(pathToCsvWith15entryPatterns);

    expect(tree17.depth).toEqual(5);
    expect(tree15.depth).toEqual(4);
  });

  it('Should generate a tree filled up with zero entries node if the number of entries provided in the csv file is not a power of two', () => {
    const pathToCsvWith17entryPatterns = 'test/entryPatterns/entry-17-valid.csv';
    const tree17 = new MerkleSumTree(pathToCsvWith17entryPatterns);

    for (let i = 17; i < 32; i += 1) {
      expect(tree17.leaves[i]).toEqual(Entry.zero_entity.computeLeaf());
    }
  });

  //let the numberOfEntries = [32, 512, 262144]
  //let expectedSum = [1534390, 25911479]
  let numberOfEntries = [32, 512];
  let expectedSum = [1534390, 25911479];

  //for the sake of calculation this expectedSum for these particular entries are computed by hand
  for (let i = 0; i < numberOfEntries.length; i++) {
    it(`Should generate a tree with the correct total sum starting from ${numberOfEntries[i]} leaves and verify a proof`, () => {
      const pathToCsv = `test/entryPatterns/entry-${numberOfEntries[i]}-valid.csv`;

      const tree2 = new MerkleSumTree(pathToCsv);

      const proof: MerkleProof = tree2.createProof(0);

      expect(tree2.verifyProof(proof)).toBeTruthy();
      expect(tree2.root.sum).toEqual(BigInt(expectedSum[i]));
    });
  }

  it(`Should return -1 as index if the entry that doesn't match the existing entries in the merkle-sum-tree`, () => {
    const index = tree.indexOf('notAKey', BigInt(1000));
    expect(index).toBe(-1);
  });

  it('Should create valid proofs for each inserted entry and verify it', () => {
    // get all entries from the tree
    const entries = tree.entries;

    // loop over each entry and generate a proof for it
    for (let i = 0; i < entries.length; i += 1) {
      const proof: MerkleProof = tree.createProof(i);
      expect(proof.siblingsHashes).toHaveLength(tree.depth);
      expect(proof.entry).toEqual(entries[i]);
      expect(proof.entry.balance).toEqual(tree.leaves[i].sum);
      expect(proof.rootHash).toEqual(tree.root.hash);
      expect(tree.verifyProof(proof)).toBeTruthy();
    }
  });

  it('Should not create a proof if the entry does not exist', () => {
    const indexOf = tree.indexOf('gAdsIaKy', BigInt(7530));

    // Query proof for a non existing leaf
    const fun = () => tree.createProof(indexOf);

    expect(fun).toThrow('The leaf does not exist in this tree');
  });

  it("Shouldn't verify a proof with a wrong entry", () => {
    const proof: MerkleProof = tree.createProof(0);

    const invalidEntry = new Entry(BigInt(22323), BigInt(0));

    // add invalid entry to the proof
    proof.entry = invalidEntry;

    expect(tree.verifyProof(proof)).toBeFalsy();
  });

  it("Shouldn't verify a proof against a wrong root hash", () => {
    const proof: MerkleProof = tree.createProof(0);

    // add invalid leaf hash
    proof.rootHash = BigInt(7);

    expect(tree.verifyProof(proof)).toBeFalsy();
  });
});
