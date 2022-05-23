# Report

## What I did
I created a bunch of scripts to handle some basic voting use-cases - e.g. minting, delegating, creating snapshots, querying ballots and voting power, and so on.
This required some modifications to the contracts themselves - e.g. I needed to keep track of the ballots created by the token contract to make querying ballots for the token possible.

## A run through
### 1. Deploy the Token
I first deployed the token by running `yarn deployToken`. This created a token at address 0xF6c1A03d8f51f6314935Eb01254bCb87f5497900 - [transaction](https://ropsten.etherscan.io/tx/0xaca07ee3dd7005513c8391f666b84a6d4032dd47153db3d56a19a0ddaab94943) - which I saved in my `.env` file to make further scripts simpler. The console output was:
```
Using address 0x7343830c55D62818Ab8026Ec190ee88DE006E322
Wallet balance 1.7904422887769271
Awaiting confirmations
Token contract deployed at 0xe85893dE326b4d0a6E5eB47147C1fEc25b174e14
```

### 2. Minting some coins
I then minted a coin using `yarn mint`, which minted 1 coin for the address saved for my environment - [transaction](https://ropsten.etherscan.io/tx/0x41ef8763dcc46edf443928f08525fd7848957f57ef62699f163977cc53e2beab). The console output was:
```
Using address 0x7343830c55D62818Ab8026Ec190ee88DE006E322
Wallet balance 1.7251502433431296
Minting 1 coins for address 0x7343830c55D62818Ab8026Ec190ee88DE006E322
Awaiting confirmations
1 coin minted for address 0x7343830c55D62818Ab8026Ec190ee88DE006E322
```

### 3. Delegating
I ran `yarn delegate` to convert my votes to voting power - [transaction](https://ropsten.etherscan.io/tx/0xaf66a70d9b2b1fba89e62304f7d19922745c99f470b857f003b78acf1bf2ae29) - which printed:
```
Using address 0x7343830c55D62818Ab8026Ec190ee88DE006E322
Wallet balance 1.722387079420274
Delegating votes for address 0x7343830c55D62818Ab8026Ec190ee88DE006E322
Awaiting confirmations
Votes delegated for address 0x7343830c55D62818Ab8026Ec190ee88DE006E322
```

### 4. Deploy some ballots
I then deployed three ballots using the token, by running `yarn deployDefaultBallot`, a script that creates ballots with some standard proposal names. This created ballots at addresses:
1. 0x28c77Cf4677EcF2b620B5714A2c6CdD919307Fc8 - [transaction](https://ropsten.etherscan.io/tx/0x3fb703ed4e6542f174d8e7c13d4ff6f10b742fc5d9f66312090a550b5d755ce0)
2. 0x4D8F7BA25100D5Ee92432995cE6Cf03E2DF1a065 - [transaction](https://ropsten.etherscan.io/tx/0x31c4c42080c688be2a2af6bd8955bd784bf879231d6f6db41212a56c9482a4d9)
3. 0x264A408904E7e8D832d453EDb16635FDd560c014 - [transaction](https://ropsten.etherscan.io/tx/0x68844864411e217b4f7cf47835cdcbda7a57d23772cd99552d2f796fee6e1a08)

I quickly checked that the ballots were deployed using `yarn getBallotVotes`, which printed:
```
Using address 0x7343830c55D62818Ab8026Ec190ee88DE006E322
Wallet balance 1.6868864307839133
Querying 3 ballots for token at 0xe85893dE326b4d0a6E5eB47147C1fEc25b174e14
--- Ballot 0 votes ---
Proposal 1 - 0 votes
Proposal 2 - 0 votes
Proposal 3 - 0 votes
The winning proposal for ballot 0 is 0
--- Ballot 1 votes ---
Proposal 1 - 0 votes
Proposal 2 - 0 votes
Proposal 3 - 0 votes
The winning proposal for ballot 1 is 0
--- Ballot 2 votes ---
Proposal 1 - 0 votes
Proposal 2 - 0 votes
Proposal 3 - 0 votes
The winning proposal for ballot 2 is 0
```

And I verified that I had voting power for the first ballot by running `yarn getVotingPower`:
```
Using address 0x7343830c55D62818Ab8026Ec190ee88DE006E322
Wallet balance 1.6868864307839133
Getting voting power for address: 0x7343830c55D62818Ab8026Ec190ee88DE006E322
0x7343830c55D62818Ab8026Ec190ee88DE006E322 has 1000000000000000000 voting power
```

### 5. Voting
Next, I voted for a few proposals. The commands being:
1. `yarn vote -a 0.4 -p 0 -c 0x28c77Cf4677EcF2b620B5714A2c6CdD919307Fc8`:
```
Using address 0x7343830c55D62818Ab8026Ec190ee88DE006E322
Wallet balance 1.6868864307839133
0x7343830c55D62818Ab8026Ec190ee88DE006E322 cast 0.4 votes for proposal 0
```
2. `yarn vote -a 0.1 -p 1 -c 0x4D8F7BA25100D5Ee92432995cE6Cf03E2DF1a065`:
```
Using address 0x7343830c55D62818Ab8026Ec190ee88DE006E322
Wallet balance 1.685284509705903
0x7343830c55D62818Ab8026Ec190ee88DE006E322 cast 0.1 votes for proposal 1
```
3. `yarn vote -a 0.1 -p 2 -c 0x264A408904E7e8D832d453EDb16635FDd560c014`
```
Using address 0x7343830c55D62818Ab8026Ec190ee88DE006E322
Wallet balance 1.6833648327373885
0x7343830c55D62818Ab8026Ec190ee88DE006E322 cast 0.1 votes for proposal 2
```
4. `yarn vote -a 0.2 -p 1 -c 0x264A408904E7e8D832d453EDb16635FDd560c014`
```
Using address 0x7343830c55D62818Ab8026Ec190ee88DE006E322
Wallet balance 1.6819793824652776
0x7343830c55D62818Ab8026Ec190ee88DE006E322 cast 0.2 votes for proposal 1
```

I verifed this with another run of `yarn getBallotVotes`, which printed:
```
Using address 0x7343830c55D62818Ab8026Ec190ee88DE006E322
Wallet balance 1.6809809265413926
Querying 3 ballots for token at 0xe85893dE326b4d0a6E5eB47147C1fEc25b174e14
--- Ballot 0 votes ---
Proposal 1 - 400000000000000000 votes
Proposal 2 - 0 votes
Proposal 3 - 0 votes
The winning proposal for ballot 0 is 0
--- Ballot 1 votes ---
Proposal 1 - 0 votes
Proposal 2 - 100000000000000000 votes
Proposal 3 - 0 votes
The winning proposal for ballot 1 is 1
--- Ballot 2 votes ---
Proposal 1 - 0 votes
Proposal 2 - 200000000000000000 votes
Proposal 3 - 100000000000000000 votes
The winning proposal for ballot 2 is 1
```

### 6. Creating a snapshot
I then created a snapshot (by exposing the `_snapshot()` function on `ERC20Snapshots`) using `yarn createSnapshot` - [transaction](https://ropsten.etherscan.io/tx/0xc22abe9bb63a4b1e6e8aa7fb1501393f68692dd05cca26b89c281c9d72deef50):
```
Using address 0x7343830c55D62818Ab8026Ec190ee88DE006E322
Wallet balance 1.6809809265413926
Creating snapshot
Snapshot created
```
And checked it was created with `yarn getSnapshots`:
```
Using address 0x7343830c55D62818Ab8026Ec190ee88DE006E322
Wallet balance 1.8816777831360267
Retrieving 1 snapshots
Snapshot 0 has id 1
Snapshots retrieved
```

