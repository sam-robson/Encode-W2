import { ethers } from "ethers";
import "dotenv/config";
import { program } from 'commander';
import { attach, connect, CONTRACT } from "./helpers";

// Gets number of votes for address x
async function getVotes(privateKey: string, tokenContractAddress: string) {
    const { ALCHEMY_API_KEY } = process.env;
    const provider = new ethers.providers.AlchemyProvider("ropsten", ALCHEMY_API_KEY);

    const wallet = await connect(privateKey, provider);
    const contract = attach(tokenContractAddress, CONTRACT.TOKEN, wallet);
    console.log(`Getting votes for address: ${wallet.address}`)
    const amount = await contract.getVotes(wallet.address);
    console.log(`${wallet.address} has ${amount} votes`)
}

async function main() {
    program
        .option('-c, --contract_address <string>', 'Contract address.', process.env.TOKEN_CONTRACT_ADDRESS)
        .option('-k, --key <string>', 'Private key to vote with.', process.env.PRIVATE_KEY)
        .parse(process.argv);

    const options = program.opts();
    await getVotes(options.key, options.contract_address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
