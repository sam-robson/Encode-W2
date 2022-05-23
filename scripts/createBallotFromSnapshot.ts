import { ethers } from "ethers";
import "dotenv/config";
import { program } from 'commander';
import { attach, connect, CONTRACT } from "./helpers";

async function createBallotFromSnapshot(privateKey: string, tokenContractAddress: string, snapshotId: number) {
    const { ALCHEMY_API_KEY } = process.env;
    const provider = new ethers.providers.AlchemyProvider("ropsten", ALCHEMY_API_KEY);

    const wallet = await connect(privateKey, provider);
    const contract = attach(tokenContractAddress, CONTRACT.TOKEN, wallet);

    // To recreate, just set the data on the contract manually? i.e. dont worry about signing things with the original addresses?
}

async function main() {
    program
        .option('-c, --contract_address <string>', 'Contract address.', process.env.TOKEN_CONTRACT_ADDRESS)
        .option('-k, --key <string>', 'Private key to vote with.', process.env.PRIVATE_KEY)
        .option('-s, --snapshotId <string>', 'Snapshot ID.')
        .parse(process.argv);

    const options = program.opts();
    await createBallotFromSnapshot(options.key, options.contract_address, options.snapshotId);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
