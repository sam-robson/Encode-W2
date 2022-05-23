import { ethers } from "ethers";
import "dotenv/config";
import { program } from 'commander';
import { attach, connect, CONTRACT } from "./helpers";

// Queries votes for every ballot associated with the token
async function getBallotVotes(privateKey: string, tokenContractAddress: string) {
    const { ALCHEMY_API_KEY } = process.env;
    const provider = new ethers.providers.AlchemyProvider("ropsten", ALCHEMY_API_KEY);

    const wallet = await connect(privateKey, provider);
    const tokenContract = attach(tokenContractAddress, CONTRACT.TOKEN, wallet);

    const ballotsLength = await tokenContract.getBallotsLength();

    console.log(`Querying ${ballotsLength} ballots for token at ${tokenContractAddress}`)
    for (let i = 0; i < ballotsLength; i++) {
        const ballotAddress = await tokenContract.ballots(i)
        const ballotContract = attach(ballotAddress, CONTRACT.BALLOT, wallet);
        const proposalsLength = await ballotContract.getProposalsLength();
        console.log(`--- Ballot ${i} votes ---`);
        for (let j = 0; j < proposalsLength; j++) {
            const votes = await ballotContract.proposals(j);
            const voteName = ethers.utils.parseBytes32String(votes.name)
            console.log(`${voteName} - ${votes.voteCount} votes`)
        }
        const winner = await ballotContract.winningProposal()
        console.log(`The winning proposal for ballot ${i} is ${winner}`);
    }
}

async function main() {
    program
        .option('-c, --contract_address <string>', 'Contract address.', process.env.TOKEN_CONTRACT_ADDRESS)
        .option('-k, --key <string>', 'Private key to vote with.', process.env.PRIVATE_KEY)
        .parse(process.argv);

    const options = program.opts();
    await getBallotVotes(options.key, options.contract_address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
