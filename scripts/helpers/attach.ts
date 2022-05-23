import "dotenv/config";
import { Contract, Signer } from "ethers";
import * as customBallotJson from "../../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import * as myTokenJson from "../../artifacts/contracts/Token.sol/MyToken.json";

export enum CONTRACT {
    BALLOT, TOKEN
}

/**
 * Attach returns an abstraction of the contract that has been deployed to the blockchain at the supplied address.
 * @returns the contract
 */
export function attach(contractAddress: string | undefined, contract: CONTRACT, wallet: Signer): Contract {
    if (!contractAddress) {
        throw new Error("No contract address supplied");
    }
    const abi = contract === CONTRACT.BALLOT ? customBallotJson.abi : myTokenJson.abi;
    return new Contract(
        contractAddress,
        abi,
        wallet
    )
}
