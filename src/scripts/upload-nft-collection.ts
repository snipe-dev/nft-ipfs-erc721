import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();

const PINATA_JWT = process.env.PINATA_JWT as string;
const PINATA_GATEWAY = process.env.PINATA_GATEWAY as string;

if (!PINATA_JWT) {
  throw new Error("PINATA_JWT not found in .env");
}

const NFT_DIR = path.resolve(process.cwd(), "src/assets/nft");

async function uploadFileToIPFS(filePath: string, fileName: string): Promise<string> {
  const data = new FormData();

  data.append("file", fs.createReadStream(filePath), {
    filename: fileName,
  });

  const response = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    data,
    {
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
        ...data.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    }
  );

  return response.data.IpfsHash;
}

async function uploadJSONToIPFS(json: any, name: string): Promise<string> {
  const response = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    {
      pinataMetadata: {
        name,
      },
      pinataContent: json,
    },
    {
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.IpfsHash;
}

function extractTokenId(fileName: string): number {
  const match = fileName.match(/\((\d+)\)/);

  if (!match) {
    throw new Error(`Cannot extract tokenId from filename: ${fileName}`);
  }

  return parseInt(match[1], 10);
}

async function main() {
  const files = fs
    .readdirSync(NFT_DIR)
    .filter((file) => file.endsWith(".png"));

  for (const file of files) {
    const tokenId = extractTokenId(file);
    const filePath = path.join(NFT_DIR, file);

    console.log(`\nProcessing ${file} (tokenId: ${tokenId})`);

    const imageCID = await uploadFileToIPFS(filePath, file);

    console.log(`Image CID: ${imageCID}`);
    console.log(
      `Image Gateway URL: https://${PINATA_GATEWAY}/ipfs/${imageCID}`
    );

    const metadata = {
      name: `My NFT #${tokenId}`,
      description: "My NFT Collection",
      image: `ipfs://${imageCID}`,
      attributes: [
        {
          trait_type: "Edition",
          value: tokenId,
        },
      ],
    };

    const metadataCID = await uploadJSONToIPFS(
      metadata,
      `metadata-${tokenId}.json`
    );

    console.log(`Metadata CID: ${metadataCID}`);
    console.log(
      `Metadata Gateway URL: https://${PINATA_GATEWAY}/ipfs/${metadataCID}`
    );
  }

  console.log("\nUpload complete.");
}

main().catch((error) => {
  console.error("Error during upload:", error);
  process.exit(1);
});
