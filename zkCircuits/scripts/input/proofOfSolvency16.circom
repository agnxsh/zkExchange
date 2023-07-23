pragma circom 2.1.3;

include "../../circuits/proofOfSolvency.circom";

component main {public [rootHash, assetsSum]} = PytPos(16);
