import { ethers } from "ethers";
import "dotenv/config";
import { program } from 'commander';
import { attach, connect, CONTRACT } from "./helpers";

async function vote(privateKey: string, ballotContractAddress: string, proposal: number, amount: string) {
    const { ALCHEMY_API_KEY } = process.env;
    const provider = new ethers.providers.AlchemyProvider("ropsten", ALCHEMY_API_KEY);

    const wallet = await connect(privateKey, provider);
    const contract = attach(ballotContractAddress, CONTRACT.BALLOT, wallet);
    const tx = await contract.vote(proposal, ethers.utils.parseEther(amount));
    await tx.wait();
    console.log(`${wallet.address} cast ${amount} votes for proposal ${proposal}`)
}

async function main() {
    program
        .option('-c, --contract_address <string>', 'Contract address.', process.env.BALLOT_CONTRACT_ADDRESS)
        .option('-k, --key <string>', 'Private key to vote with.', process.env.PRIVATE_KEY)
        .option('-p, --proposal <number>', 'Proposal to vote for.')
        .option('-a, --amount <number>', 'Amount of votes to spend.', '1')
        .parse(process.argv);

    const options = program.opts();
    await vote(options.key, options.contract_address, options.proposal, options.amount);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
