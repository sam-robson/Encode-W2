import { ethers } from "ethers";
import "dotenv/config";
import { Option, program } from 'commander';
import * as tokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import { attach, connect, CONTRACT } from "./helpers";

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}

async function deployBallot(proposalStrings: string[]) {
    const proposalBytes = convertStringArrayToBytes32(proposalStrings);

    const { PRIVATE_KEY, ALCHEMY_API_KEY, TOKEN_CONTRACT_ADDRESS } = process.env;
    const provider = new ethers.providers.AlchemyProvider("ropsten", ALCHEMY_API_KEY);
    const wallet = await connect(PRIVATE_KEY, provider)
    const tokenContract = attach(TOKEN_CONTRACT_ADDRESS, CONTRACT.TOKEN, wallet)

    console.log(`Deploying CustomBallot contract using the Token contract at address ${TOKEN_CONTRACT_ADDRESS} with proposals: ${proposalStrings}`);
    const ballotContractTx = await tokenContract.createBallot(proposalBytes);
    const receipt = await ballotContractTx.wait();
    const event = receipt.events?.find((f: any) => f.event === "BallotCreated")!;
    console.log(`CustomBallot deployed at address: ${event.args![0]}`);
}

async function deployToken() {
    const { PRIVATE_KEY, ALCHEMY_API_KEY } = process.env;
    const provider = new ethers.providers.AlchemyProvider("ropsten", ALCHEMY_API_KEY);
    const wallet = await connect(PRIVATE_KEY, provider)

    const contractFactory = new ethers.ContractFactory(
        tokenJson.abi,
        tokenJson.bytecode,
        wallet
    );
    const contract = await contractFactory.deploy();
    console.log("Awaiting confirmations");
    await contract.deployed();
    console.log(`Token contract deployed at ${contract.address}`);
}

const BALLOT_ARG = "ballot";
const TOKEN_ARG = "token";

async function main() {
    program
        .addOption(new Option('-c, --contract <string>', 'Contract to deploy.').choices([BALLOT_ARG, TOKEN_ARG]))
        .option('-t --token_address <string>', 'Address of the Token contract', process.env.TOKEN_CONTRACT_ADDRESS)
        .option('-p, --proposals <string...>', 'Proposals.')
        .parse(process.argv);

    const options = program.opts();
    switch (options.contract) {
        case BALLOT_ARG: await deployBallot(options.proposals); break;
        case TOKEN_ARG: await deployToken(); break;
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
