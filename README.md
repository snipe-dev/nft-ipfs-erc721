# NFT IPFS ERC-721 Collection

```{=html}
<p align="center">
```
`<img src="https://gateway.pinata.cloud/ipfs/QmPZ3aoSaN5P9YfSzf9yJVC5yrvRUueosEoPZ2S3UahjV2" height="100"/>`{=html}
`<img src="https://gateway.pinata.cloud/ipfs/QmZmMgYrsmjz4uKytVS5a6p2gv16En5PGnNKwdbMUcVZCU" height="100"/>`{=html}
`<img src="https://gateway.pinata.cloud/ipfs/QmboBdUKL2W7akLhTNxqFBtyy9oBMqR8DNwGcRZQHSUFna" height="100"/>`{=html}
`<img src="https://gateway.pinata.cloud/ipfs/QmNp1oYkCeukM4vDicuSybjafdpvE85EmPs4Q9y4h3THbm" height="100"/>`{=html}
```{=html}
</p>
```

------------------------------------------------------------------------

## Overview

This project demonstrates a complete NFT pipeline:

-   Uploading images to IPFS (via Pinata)
-   Generating metadata JSON files
-   Uploading metadata folder to IPFS
-   Deploying an ERC-721 contract
-   Minting a collection on-chain
-   Fetching NFT metadata and images via viem

The contract uses a baseURI pointing to an IPFS folder containing
metadata files.

------------------------------------------------------------------------

## Architecture

    Solidity Contract
            ↓
    tokenURI(tokenId)
            ↓
    ipfs://CID/tokenId.json
            ↓
    IPFS Gateway
            ↓
    Metadata JSON
            ↓
    image: ipfs://imageCID
            ↓
    Gateway URL → Image

------------------------------------------------------------------------

## 1️⃣ Uploading Images & Metadata to IPFS

Images were uploaded using a TypeScript script that:

-   Reads local PNG files
-   Uploads each file to Pinata
-   Generates metadata JSON
-   Uploads metadata folder
-   Outputs baseURI for contract usage

`<img src="./src/assets/screenshots/console-upload.png" width="100%"/>`{=html}

The uploaded files are visible in Pinata:

`<img src="./src/assets/screenshots/pinata-files.png" width="100%"/>`{=html}

------------------------------------------------------------------------

## 2️⃣ Smart Contract Deployment

The contract is a minimal ERC-721 implementation with:

-   `mint(address)`
-   `mintBatch(address,uint256)`
-   `setBaseURI(string)`
-   Overridden `tokenURI(uint256)`

Deployment was done via Remix.

`<img src="./src/assets/screenshots/remix-deploy.png" width="100%"/>`{=html}

------------------------------------------------------------------------

## 3️⃣ Minting the Collection

NFTs were minted using a viem-based script that:

-   Verifies contract owner
-   Calls `mintBatch`
-   Confirms transaction receipt

`<img src="./src/assets/screenshots/console-mint.png" width="100%"/>`{=html}

------------------------------------------------------------------------

## 4️⃣ Fetching NFT Metadata & Images

A script connects to the deployed contract and:

-   Calls `tokenURI(tokenId)`
-   Converts `ipfs://` to gateway URL
-   Fetches metadata JSON
-   Extracts `image`
-   Outputs final image URLs

`<img src="./src/assets/screenshots/console-fetch.png" width="100%"/>`{=html}

------------------------------------------------------------------------

## Result

Each NFT resolves as:

    tokenURI(tokenId)
    → IPFS metadata
    → image CID
    → Gateway URL

Example:

-   Metadata:
    https://gateway.pinata.cloud/ipfs/QmbmdfDr4ki6USnjaow1jY9s4wwiffSWKVnkDrh4Z3QrEh/1.json

-   Image:
    https://gateway.pinata.cloud/ipfs/QmPZ3aoSaN5P9YfSzf9yJVC5yrvRUueosEoPZ2S3UahjV2

------------------------------------------------------------------------

## Tech Stack

-   Solidity (OpenZeppelin ERC-721)
-   TypeScript
-   viem
-   Pinata IPFS
-   tsx runtime

------------------------------------------------------------------------

## Status

✔ IPFS Upload Complete\
✔ Contract Deployed\
✔ NFTs Minted\
✔ Metadata Fetch Working\
✔ Image Resolution Working

This repository demonstrates a fully working NFT infrastructure from
local assets to on-chain tokens.
