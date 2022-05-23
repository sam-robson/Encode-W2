import { ethers } from "ethers";
import "dotenv/config";
import { program } from 'commander';
import { attach, connect, CONTRACT } from "./helpers";

// todo fix this, being weird
// Gets voting power for the key for the ballot
async function getVotingPower(privateKey: string, ballotContractAddress: string) {
    const { ALCHEMY_API_KEY } = process.env;
    const provider = new ethers.providers.AlchemyProvider("ropsten", ALCHEMY_API_KEY);

    const wallet = await connect(privateKey, provider);
    const contract = attach(ballotContractAddress, CONTRACT.BALLOT, wallet);
    console.log(`Getting voting power for address: ${wallet.address}`)
    const votingPower = await contract.votingPower(wallet.address);
    console.log(`${wallet.address} has ${votingPower} voting power`)
}

async function main() {
    program
        .option('-c, --contract_address <string>', 'Contract address.', process.env.BALLOT_CONTRACT_ADDRESS)
        .option('-k, --key <string>', 'Private key to vote with.', process.env.PRIVATE_KEY)
        .parse(process.argv);

    const options = program.opts();
    await getVotingPower(options.key, options.contract_address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
