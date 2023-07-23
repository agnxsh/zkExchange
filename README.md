<h1>The Problem</h1>

<p>Data is only anonymous with respect to its context. In our project, we particularly highlight the problems in modern-day verification. With the uprising of Data-Privacy Laws it's getting excessively hard to abide by policies, and take decisions over the legitimacies of certain outcomes.</p>

<p>One such problem is the Proof of Solvency. It is a mechanism in which verifying organisations such as Auditing Companies / Public Forums shall have a way to validate that the total amount of assets in a private/public bank is more than its total liabilities.<p>

<p>Every time a bank/business goes bankrupt, a common question that arises is whether we can rely on external auditing companies, government authenticators, or special policies and methods are needed to validate the Proof of Solvency, but in that process we end up giving away a lot of innocent user-data to these agencies solely relying on their word, that the data won't get laundered.</p>

<h2>What if we didn't have to do that?</h2>

<p>There could be several ways to mask/privatise the user-data, but the best way to anonymise is not reveal it AT ALL. We are planning to achieve this with one of the marvels of modern-day cryptography, that is, Zero-Knowledge Proofs.</p>

<h2>A Background</h2>

<p>Zero-knowledge proofs (ZKPs) are a type of cryptographic protocol that allows one party (the prover) to prove to another party (the verifier) that a certain statement is true, without revealing any additional information beyond the validity of the statement. In other words, ZKPs allow you to prove that you know a piece of information without actually revealing what that information is.</p>

[Click here to read more](https://blog.cryptographyengineering.com/2014/11/27/zero-knowledge-proofs-illustrated-primer/)

<h2>Some important properties</h2>

<p>Some properties of ZKPs include:

- Completeness: If the statement is true, the verifier will always accept the proof provided by the prover.

- Soundness: If the statement is false, no prover, no matter how powerful, can convince the verifier that it is true.

- Zero-knowledge: The verifier learns nothing beyond the validity of the statement being proved.

- Non-interactivity: The proof can be generated without interaction between the prover and the verifier, or with only a limited amount of interaction.

ZKPs have a wide range of applications, such as in blockchain technology, authentication systems, and secure communication protocols, where it is important to prove the authenticity of information without revealing sensitive details.</p>

![An-interactive-zero-knowledge-protocol](https://user-images.githubusercontent.com/80243668/232093830-ff30f438-d032-484f-a038-b0eb465d8f89.png)

<h2>ZKP Implemenation Overview: Using zkSNARKs</h2>

zk-SNARKs (Zero-Knowledge Succinct Non-Interactive Argument of Knowledge) are a specific type of ZKP that are designed to be highly efficient and allow for very fast verification of proofs.

One of the key advantages of zk-SNARKs is that they are able to prove the validity of a statement without requiring any interaction between the prover and the verifier. This means that once a proof has been generated, it can be easily verified by anyone without the need for further communication with the prover.

Another important feature of zk-SNARKs is that they are "succinct," meaning that the proof itself is very small, usually just a few hundred bytes.

<h2>Our Solution: zkExchange</h2>

<h4>A 3rd party auditing software that ingests data through csv balance sheets and proves the information regarding assets and ongoing liabilities without revealing any data at all to the verifier, thereby abiding by sensitive data-privacy laws, using Zero-Knowledge Proofs</h4>

In simple terms, here the proof is nothing but a file containing a token of legitimacy, for the audited company (the Prover), generated in WebAssembly or a C++ Executable, that will be provided to the Verification API provided to the auditing (the Verifier) side. Thereby, the Verifier can get a authentication status whether the Proof gets verified or not without having to look into or audit the real data.  Moreover, since zk-SNARKS are non-interactive, the Verifier never really has to interact with the Prover (or the real data) to authenticate.

<h2>Algorithm</h2>

<h4>The Prover's Side</h4>

1. The software initially ingests the data, preferrably csv/xls balance sheets consisting the users' sensitive information, structures it to a more workable form.
2. Feeds it into the ZKP cryptosystem and generates a proof in O(N logN) time.
3. Passes it over to the Verification API either internally or as a data packet via a HTTP response.

<h4>The Verifier's Side</h4>

1. The Verifier receives it and verifies the proof in O(1) time.

Our Project folders are structured in the following way:

- `/zkExchange`
   - `zkDataPrep/`
   - `zkCircuits/`
   - `zkVerifier/`
   - `README/`
 
-```zkDataPrep``` - An integral library written in Typescript, that decomposes the datasets by hashing and storing them in a Merkle Sum Tree, one of the  fastest ways to prepare data before feeding them to ZKP modules.

-```zkCircuits``` - The primary module that feeds the user data into the cryptographic system, and thereby generates a proof which is furthermore entirely independent of the data.

-```zkVerfier``` - The verification library that will essentially work as a scalable API and shall be provided to whoever applies for a Proof of Solvency over the bank or agency.

-```README``` - Overview and Documentation

