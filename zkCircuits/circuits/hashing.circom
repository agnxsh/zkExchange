pragma circom 2.1.3;

include "../node_modules/circomlib/circuits/poseidon.circom";

//taking input of user entry as (username and balance) and outputs a hash of it (leafHash)

template ToLeafHash(){
    signal input username;
    signal input balance;

    signal output out;

    component poseidonHasher = PoseidonHasher(2);

    poseidonHasher.in[0] <== username;
    poseidonHasher.in[1] <== balance;

    out <== poseidonHasher.out;
}


template PoseidonHasher(n){
    signal input in[n];
    signal output out;

    component hasher = Poseidon(n);

    for(var i=0 ; i < n;i++){
        hasher.inputs[i] <== in[i];
    }

    out <== hasher.out;
}
