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
const METADATA_DIR = path.resolve(process.cwd(), "src/assets/metadata");
const OUTPUT_FILE = path.resolve(
  process.cwd(),
  "src/assets/collection-cids.json"
);

function extractTokenId(fileName: string): number {
  const match = fileName.match(/\((\d+)\)/);

  if (!match) {
    throw new Error(`Cannot extract tokenId from filename: ${fileName}`);
  }

  return parseInt(match[1], 10);
}

async function uploadFileToIPFS(filePath: string, fileName: string): Promise<string> {
  const data = new FormData();

  data.append("file", fs.createReadStream(filePath), {
    filepath: fileName,
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

async function uploadFolderToIPFS(folderPath: string): Promise<string> {
  const data = new FormData();

  const folderName = "collection-metadata";

  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const fullPath = path.join(folderPath, file);

    data.append("file", fs.createReadStream(fullPath), {
      filepath: `${folderName}/${file}`,
    });
  }

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


async function main() {
  if (!fs.existsSync(METADATA_DIR)) {
    fs.mkdirSync(METADATA_DIR, { recursive: true });
  }

  const files = fs
    .readdirSync(NFT_DIR)
    .filter((file) => file.endsWith(".png"));

  const results: any = {
    images: {},
    metadataFiles: [],
    folderCID: null,
  };

  for (const file of files) {
    const tokenId = extractTokenId(file);
    const filePath = path.join(NFT_DIR, file);

    console.log(`\nProcessing ${file} (tokenId: ${tokenId})`);

    const imageCID = await uploadFileToIPFS(filePath, file);

    console.log(`Image CID: ${imageCID}`);
    console.log(
      `Image Gateway URL: https://${PINATA_GATEWAY}/ipfs/${imageCID}`
    );

    results.images[tokenId] = imageCID;

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

    const metadataPath = path.join(METADATA_DIR, `${tokenId}.json`);

    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    results.metadataFiles.push(`${tokenId}.json`);
  }

  console.log("\nUploading metadata folder...");

  const folderCID = await uploadFolderToIPFS(METADATA_DIR);

  console.log(`\nMetadata Folder CID: ${folderCID}`);
  console.log(
    `Base URI for contract: ipfs://${folderCID}/`
  );

  results.folderCID = folderCID;

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));

  console.log(`\nSaved collection data to ${OUTPUT_FILE}`);
  console.log("\nUpload complete.");
}

main().catch((error) => {
  console.error("Error during upload:", error);
  process.exit(1);
});
