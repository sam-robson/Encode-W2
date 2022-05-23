// todo create snapshot of ballot state
import { ethers } from "ethers";
import "dotenv/config";
import { program } from 'commander';
import { attach, connect, CONTRACT } from "./helpers";

async function getSnapshots(privateKey: string, tokenContractAddress: string) {
    const { ALCHEMY_API_KEY } = process.env;
    const provider = new ethers.providers.AlchemyProvider("ropsten", ALCHEMY_API_KEY);

    const wallet = await connect(privateKey, provider);
    const contract = attach(tokenContractAddress, CONTRACT.TOKEN, wallet);
    const numSnapshots = await contract.getSnapshotIdsLength();
    let snapshots = []
    console.log(`Retrieving ${numSnapshots} snapshots`);
    for (let i = 0; i < numSnapshots; i++) {
        const snapshot = await contract.snapshotIds(i);
        snapshots.push(snapshot);
        console.log(`Snapshot ${i} has id ${snapshot}`);
    }
    console.log("Snapshots retrieved");
}

async function main() {
    program
        .option('-c, --contract_address <string>', 'Contract address.', process.env.TOKEN_CONTRACT_ADDRESS)
        .option('-k, --key <string>', 'Private key to vote with.', process.env.PRIVATE_KEY)
        .parse(process.argv);

    const options = program.opts();
    await getSnapshots(options.key, options.contract_address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
