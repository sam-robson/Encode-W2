import "dotenv/config";
import { ethers, Wallet } from "ethers";

/**
 * Connect to an ethers wallet using the AlchemyProvider
 * @returns the wallet 
 */
export async function connect(privateKey: string | undefined, provider: ethers.providers.Provider): Promise<Wallet> {
    if (!privateKey) {
        throw new Error("No private key supplied");
    }
    const wallet = new Wallet(privateKey!);
    console.log(`Using address ${wallet.address}`);
    const signer = wallet.connect(provider);
    const balanceBN = await signer.getBalance();
    const balance = Number(ethers.utils.formatEther(balanceBN));
    console.log(`Wallet balance ${balance}`);
    if (balance < 0.01) {
        throw new Error("Not enough ether");
    }
    return signer;
}
