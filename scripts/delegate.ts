import { ethers } from "ethers";
import "dotenv/config";
import { program } from 'commander';
import { attach, connect, CONTRACT } from "./helpers";

// Delegate votes for an address
async function delegate(privateKey: string, tokenContractAddress: string) {
    const { ALCHEMY_API_KEY } = process.env;
    const provider = new ethers.providers.AlchemyProvider("ropsten", ALCHEMY_API_KEY);

    const wallet = await connect(privateKey, provider);
    const contract = attach(tokenContractAddress, CONTRACT.TOKEN, wallet);
    console.log(`Delegating votes for address ${wallet.address}`)
    const tx = await contract.delegate(wallet.address);
    console.log("Awaiting confirmations");
    await tx.wait();
    console.log(`Votes delegated for address ${wallet.address}`)
}

async function main() {
    program
        .option('-c, --contract_address <string>', 'Contract address.', process.env.TOKEN_CONTRACT_ADDRESS)
        .option('-k, --key <string>', 'Private key to vote with.', process.env.PRIVATE_KEY)
        .parse(process.argv);

    const options = program.opts();
    await delegate(options.key, options.contract_address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
