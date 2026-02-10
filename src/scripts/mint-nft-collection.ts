import "dotenv/config";
import {createPublicClient, createWalletClient, http} from "viem";
import {privateKeyToAccount} from "viem/accounts";
import {bscTestnet} from "viem/chains";
import {nftAbi} from "./abi.js";

const RPC_URL = process.env.RPC_URL as string;
const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;

if (!RPC_URL) throw new Error("RPC_URL not set");
if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY not set");
const account = privateKeyToAccount(PRIVATE_KEY);
const CONTRACT_ADDRESS = "0xab01589e6fb7504635ABCD70a240EcD5F8f16Ec4";
const MINT_TO = account.address;
const AMOUNT = 10;

async function main() {


  const publicClient = createPublicClient({
    chain: bscTestnet,
    transport: http(RPC_URL),
  });

  const walletClient = createWalletClient({
    account,
    chain: bscTestnet,
    transport: http(RPC_URL),
  });

  const owner = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: nftAbi,
    functionName: "owner",
  });

  if (owner.toLowerCase() !== account.address.toLowerCase()) {
    throw new Error("Signer is not contract owner");
  }

  console.log("Owner verified:", owner);

  const hash = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: nftAbi,
    functionName: "mintBatch",
    args: [MINT_TO, BigInt(AMOUNT)],
  });

  console.log("Mint tx sent:", hash);

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  console.log("Mint confirmed in block:", receipt.blockNumber.toString());
}

main().catch((err) => {
  console.error("Mint failed:", err);
  process.exit(1);
});
