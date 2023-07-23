const path = require("path");
const { assert } = require("chai");
const wasm_tester = require("circom_tester").wasm;
const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;

exports.p = Scalar.fromString(
  "21888242871839275222246405745257275088548364400416034343698204186575808495617"
);
const Fr = new F1Field(exports.p);

const { MerkleSumTree } = require("pyt-merkle-sum-tree");

const createCircomInput = requirye("./helperfunc.js");

describe("Circuit Testing", function async() {
  const pathToCsv = "test/entryPatterns/entry-16.csv";
  // total sum of the liablities is 3273939304
  console.log("Constructing Merkle Sum Tree");
  console.log("Initializing the Merkle Sum Tree from the given data set......");
  const tree = new MerkleSumTree(pathToCsv);

  //getting the index of the user we want to create a proof for
  console.log("Getting the Merkle Proof for that particular user.....");
  const entryIndex = tree.indexOf("dxGaEAii", BigInt(11888));

  //creating a Merkle Proof for that user
  const proof = tree.createProof(entryIndex);

  beforeEach(async function () {
    this.timeout(100000);
    circuit = await wasm_tester(
      path.join(__dirname, "../scripts/input", "proofOfSolvency16.circom")
    );
  });

  it("Should verify a proof of inclusion of an existing entry if assetsSum > liabilitiesSum", async () => {
    console.log(
      "Packing the inputs into the circom zkSNARK construction..., putting assets 1 more than liabilities..."
    );
    const input = createCircomInput(proof, BigInt(3273939305));
    console.log("Computing the leaf hashes of the given user data");
    const expectedLeafHashOutput = proof.entry.computeLeaf().hash;
    console.log("Calculating the witness....");
    let witness = await circuit.calculateWitness(input);
    await circuit.assertOut(witness, { leafHash: expectedLeafHashOutput });
    await circuit.checkConstraints(witness);
    console.log("Proof Verified!");
  });

  it("Should verify a proof of inclusion of an existing entry if assetsSum = liabilitiesSum", async () => {
    console.log("Packing the inputs into the circom zkSNARK construction...");
    const input = createCircomInput(proof, BigInt(3273939304));
    console.log("Computing the leaf hashes of the given user data");
    const expectedLeafHashOutput = proof.entry.computeLeaf().hash;
    console.log("Calculating the witness....");
    let witness = await circuit.calculateWitness(input);
    await circuit.assertOut(witness, { leafHash: expectedLeafHashOutput });
    await circuit.checkConstraints(witness);
    console.log("Proof Verified!");
  });

  it("Should NOT verify a proof of inclusion of an existing entry if assetsSum < liabilitiesSum", async () => {
    console.log("Packing the inputs into the circom zkSNARK construction...");
    const input = createCircomInput(proof, BigInt(3273939303));
    try {
      console.log("Computing the leaf hashes of the given user data");
      console.log("Calculating the witness....");
      let witness = await circuit.calculateWitness(input);
      await circuit.checkConstraints(witness);
      console.log("Proof Not Verified!");
      assert(false);
    } catch (e) {
      assert.equal(e.message.slice(0, 21), "Error: Assert Failed.");
      assert.equal(
        e.message.slice(22, 59),
        "Error in template PytPos_154 line: 65"
      );
    }
  });
  it("Should NOT verify a proof of inclusion of an entry if the entry is NON-EXISTENT", async () => {
    console.log("Packing the inputs into the circom zkSNARK construction...");
    const input = createCircomInput(proof, BigInt(3273939305));
    console.log("Adding a fake user intentionally!");
    input.username = BigInt(123456789);
    try {
      let witness = await circuit.calculateWitness(input);
      await circuit.checkConstraints(witness);

      assert(false);
    } catch (e) {
      assert.equal(e.message.slice(0, 21), "Error: Assert Failed.");
      assert.equal(
        e.message.slice(22, 59),
        "Error in template PytPos_154 line: 59"
      );
    }
  });
  it("Should NOT verify a proof of inclusion based on the inclusion of an INVALID root", async () => {
    console.log("Packing the inputs into the circom zkSNARK construction...");
    const input = createCircomInput(proof, BigInt(3273939305));
    console.log("Adding an invalid root intentionally!");
    input.rootHash = input.rootHash + 1n;
    try {
      let witness = await circuit.calculateWitness(input);
      await circuit.checkConstraints(witness);

      assert(false);
    } catch (e) {
      assert.equal(e.message.slice(0, 21), "Error: Assert Failed.");
      assert.equal(
        e.message.slice(22, 59),
        "Error in template PytPos_154 line: 59"
      );
    }
  });
  it("Should generate an ERROR if one of the balances overflows 2**252", async () => {
    console.log("Packing the inputs into the circom zkSNARK construction...");
    const input = createCircomInput(proof, BigInt(3273939305));
    console.log("Adding a balance that overflows 2**252 to the input!");
    input.balance = exports.p - 1n;
    try {
      let witness = await circuit.calculateWitness(input);
      await circuit.checkConstraints(witness);

      assert(false);
    } catch (e) {
      assert.equal(e.message.slice(0, 21), "Error: Assert Failed.");
      assert.equal(
        e.message.slice(22, 59),
        "Error in template Num2Bits_73 line: 3"
      );
    }
  });
  it("Should generate an ERROR if sum of 2 balances overflows 2**252", async () => {
    console.log("Packing the inputs into the circom zkSNARK construction...");
    const input = createCircomInput(proof, BigInt(3273939305));
    console.log(
      "Adding a balance that will overflows 2**252 when added to another balance!"
    );
    input.balance = BigInt(2 ** 252) - 1n;
    try {
      let witness = await circuit.calculateWitness(input);
      await circuit.checkConstraints(witness);

      assert(false);
    } catch (e) {
      assert.equal(e.message.slice(0, 21), "Error: Assert Failed.");
      assert.equal(
        e.message.slice(22, 59),
        "Error in template Num2Bits_73 line: 3"
      );
    }
  });
});
