import "dotenv/config";
import { createPublicClient, http } from "viem";
import { bscTestnet } from "viem/chains";
import axios from "axios";
import { nftAbi } from "./abi.js";

const RPC_URL = process.env.RPC_URL as string;

if (!RPC_URL) {
  throw new Error("RPC_URL not set");
}

const CONTRACT_ADDRESS = "0x772eD9EaCf5EA8c7b94f5089E4D94551778625D1";
const GATEWAY = "https://gateway.pinata.cloud/ipfs/";

function ipfsToHttp(ipfsUri: string): string {
  if (!ipfsUri.startsWith("ipfs://")) return ipfsUri;
  return GATEWAY + ipfsUri.replace("ipfs://", "");
}

async function main() {
  const publicClient = createPublicClient({
    chain: bscTestnet,
    transport: http(RPC_URL),
  });

  for (let tokenId = 1; tokenId < 11; tokenId++) {
    try {
      const uri = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: nftAbi,
        functionName: "tokenURI",
        args: [BigInt(tokenId)],
      });

      const metadataUrl = ipfsToHttp(uri);
      const response = await axios.get(metadataUrl);
      const metadata = response.data;

      const imageUrl = ipfsToHttp(metadata.image);

      console.log("-----");
      console.log("Token ID:", tokenId);
      console.log("Metadata URL:", metadataUrl);
      console.log("Image URL:", imageUrl);
    } catch (error) {
      console.log("-----");
      console.log("Token ID:", tokenId);
      console.log("Error:", "Token may not exist");
    }
  }
}

main().catch((err) => {
  console.error("Fetch failed:", err);
  process.exit(1);
});
