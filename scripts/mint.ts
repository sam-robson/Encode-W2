import { ethers } from "ethers";
import "dotenv/config";
import { program } from 'commander';
import { attach, connect, CONTRACT } from "./helpers";

// Mints amount coins for a given account
async function mint(privateKey: string, tokenContractAddress: string, amount: string) {
    const { ALCHEMY_API_KEY } = process.env;
    const provider = new ethers.providers.AlchemyProvider("ropsten", ALCHEMY_API_KEY);

    const wallet = await connect(privateKey, provider);
    const contract = attach(tokenContractAddress, CONTRACT.TOKEN, wallet);
    console.log(`Minting ${amount} coins for address ${wallet.address}`)
    const tx = await contract.mint(wallet.address, ethers.utils.parseEther(amount));
    console.log("Awaiting confirmations");
    await tx.wait();
    console.log(`${amount} coin minted for address ${wallet.address}`)
}

async function main() {
    program
        .option('-c, --contract_address <string>', 'Contract address.', process.env.TOKEN_CONTRACT_ADDRESS)
        .option('-k, --key <string>', 'Private key to vote with.', process.env.PRIVATE_KEY)
        .option('-a, --amount <string>', 'Amount of votes to mint.', '1')
        .parse(process.argv);

    const options = program.opts();
    await mint(options.key, options.contract_address, options.amount);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
