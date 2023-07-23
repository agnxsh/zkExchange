# zkDataPrep

## Structuring datasets into Merkle Sum Trees

This is a Typescript (backend-friendly) library used to create Merkle Sum Trees where each node entry is `username -> balance`. The root of this tree contains the aggregated sum of all the node entries, thereby, representing the total assets/liabilities of a firm.

But coming to the point.

## What is a Merkle Sum Tree?

A merkle sum tree is a binary Merkle Tree with the following properties:

- Each entry of the merkle tree is a struct, of username and balance
- Each leaf node of the merkle tree contains a hash and a sum. The hash is equal to `h(username, balance)`. The sum is equal to the balance itself, at the node level.
- Each non-leaf node contains a hash and a sum. The hash is equal to `h(left_child.hash, left_child.sum, right_child.hash, right_child.sum)`. The sum is therefore equal to the sum of the sum of it's children.
- The root node represents the executed/constructed state of the tree and contains all the users'/entry balances. The `merkleSumTree()` is a Typescript implementation of a Merkle Sum Tree and it provides all the functions to construct the above mentioned modified Merkle Tree by just ingesting data from a csv file, picking up only the `username -> balance`.

This diagram is a representation of a similar Merkle Sum Tree

![image](https://github.com/teamHITK/zkExchange/assets/80243668/49f3907f-4357-4967-8914-6a6de76fb78d)

## Hashing Algorihtm

In this implementation we're using [Poseidon Hash](https://eprint.iacr.org/2019/458.pdf), a zkSNARK friendly hashing algorithm introduced in 2019, compatible with Secure Multi-Party Computation (MPC). 

### Why Poseidon?

- Permutation-based Design: Poseidon Hash is built upon a permutation-based design, utilizing a series of permutation rounds to process the input data. The permutation function employed in Poseidon is based on the Merkle-Damgård construction.

- Customizable Parameters: Poseidon allows for customizable parameters, such as the number of permutation rounds, the number of words processed per round, and the size of the internal state. These parameters can be adjusted depending on the specific security requirements and performance considerations of the application.

- Efficient Arithmetic Circuit Implementation: Poseidon is highly optimized for arithmetic circuits commonly used in zk-SNARKs. It exhibits efficient behavior when implemented within these circuits, offering faster computation times and reduced circuit sizes compared to other hash functions.

- Resistance to Cryptographic Attacks: Poseidon has undergone extensive analysis and evaluation for security. It has been designed to resist known cryptographic attacks, including differential and linear attacks. However, as with any cryptographic primitive, ongoing analysis and scrutiny are essential to ensure its continued security.

- Trusted Setup Compatibility: Poseidon is compatible with trusted setup procedures commonly used in certain zk-SNARK constructions. The structure of Poseidon allows for efficient and secure generation of the necessary cryptographic parameters during the trusted setup phase.

- Multiple Variants: Poseidon comes in different variants, such as Poseidon-128, Poseidon-192, and Poseidon-256, which differ in the number of rounds and the width of the internal state. These variants offer flexibility in choosing the appropriate security level and performance trade-offs.
## Setup

### Installing the package

- The package can be directly installed from the npm registry with the following command:
  ```
  $ npm i @0xagnish/zk-data-prep
  ```

### For Database

- Import your database to a csv file, for example [this](https://github.com/teamHITK/zkExchange/blob/master/zkDataPrep/test/entryPatterns/entry-16-valid.csv)

## API Guide

### new MerkleSumTree (pathToCsv : string) : MerkleSumTree

```ts
import { MerkleSumTree } from '0xagnish/zk-data-prep';

const pathToCsv = 'test/entryPatterns/entry-16-valid.csv';

const tree = new MerkleSumTree(pathToCsv);
//constructs a tree using the given entries in the csv dataset
```
# entries: [] Entry

The entries contain the username parsed as BigInt. This transformation is needed in order to make the entries hashing friendly and later on operate with zkSNARKs.

```ts
const entries = tree.entries
// [
//       Entry {
//         _usernameToBigInt: 7440338505707899769n,
//         _balance: 7534n,
//         _username: 'gAdsIaKy'
//       },
//       Entry {
//         _usernameToBigInt: 6008493982388733799n,
//         _balance: 2060n,
//         _username: 'SbuqOZGg'
//       },
//       ...
// ]
```

# leaves : [] Node

```ts
const root = tree.root 
    // {
    //   hash: 5256203632563331423195629050622063453704745190370457907459595269961493651429n,
    //   sum: 84359n
    // }
```

# indexOf (username: string, balance: bigint) : number

Returns the index of an entry in the tree. If the entry does not exist in the tree, it returns -1.

```ts
const index = tree.indexOf("gAdsIaKy", BigInt(7534)) // 0
```

# createProof (index: number) : MerkleProof

Creates a proof of membership for an entry identified by its index. The MerkleProof contains the path from the leaf to the root.

```ts
const proof = tree.createProof(0)
```

# verifyProof(proof: MerkleProof) : boolean

Verifies a proof and returns true or false. It verifies that a leaf is included in the tree and that the sum computed from the leaf to the root is equal to the total sum of the tree.

```ts
tree.verifyProof(proof)
```

# Benchmarking

To construct a Merkle Sum Tree with 262144 (2**18 leaves) it takes:
| Time taken  | OS/Kernel  | RAM
| -----  | -----  | -----
| 108s  | Ubuntu 22 LTS | 8 GB
| 154s  | Macbook Air M1  | 8 GB

