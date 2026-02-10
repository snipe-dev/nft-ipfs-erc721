# NFT IPFS ERC-721 Collection

<div align="center">
    <img src="https://raw.githubusercontent.com/snipe-dev/nft-ipfs-erc721/refs/heads/master/src/assets/nft/nft%20(1).avif" height="200" style="margin: 0 10px;" />
    <img src="https://raw.githubusercontent.com/snipe-dev/nft-ipfs-erc721/refs/heads/master/src/assets/nft/nft%20(2).avif" height="200" style="margin: 0 10px;" />
    <img src="https://raw.githubusercontent.com/snipe-dev/nft-ipfs-erc721/refs/heads/master/src/assets/nft/nft%20(3).avif" height="200" style="margin: 0 10px;" />
    <img src="https://raw.githubusercontent.com/snipe-dev/nft-ipfs-erc721/refs/heads/master/src/assets/nft/nft%20(4).avif" height="200" style="margin: 0 10px;" />
    <img src="https://raw.githubusercontent.com/snipe-dev/nft-ipfs-erc721/refs/heads/master/src/assets/nft/nft%20(5).avif" height="200" style="margin: 0 10px;" />
</div>

------------------------------------------------------------------------

## Overview

This repository demonstrates a complete NFT lifecycle:

-   Uploading images to IPFS (Pinata)
-   Generating metadata JSON files
-   Uploading a metadata folder
-   Deploying an ERC-721 contract
-   Minting NFTs on-chain
-   Fetching metadata and images using viem

The contract uses a baseURI pointing to an IPFS folder that stores token
metadata.

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

## 1. Uploading Images & Metadata to IPFS

A TypeScript script:

-   Reads PNG files from local folder
-   Uploads images to Pinata
-   Generates metadata JSON per token
-   Uploads metadata folder
-   Outputs baseURI for contract deployment

<div align="center">
    <img src="https://raw.githubusercontent.com/snipe-dev/nft-ipfs-erc721/refs/heads/master/src/assets/screenshot/console-upload.png" width="1100" style="margin: 0 10px;" />
</div>

Pinata dashboard showing uploaded files:

<div align="center">
    <img src="https://raw.githubusercontent.com/snipe-dev/nft-ipfs-erc721/refs/heads/master/src/assets/screenshot/pinata-files.png" width="1100" style="margin: 0 10px;" />
</div>

------------------------------------------------------------------------

## 2. Smart Contract Deployment

Minimal ERC-721 contract based on OpenZeppelin with:

-   mint(address)
-   mintBatch(address,uint256)
-   setBaseURI(string)
-   Overridden tokenURI(uint256)

Deployed via Remix.

<div align="center">
    <img src="https://raw.githubusercontent.com/snipe-dev/nft-ipfs-erc721/refs/heads/master/src/assets/screenshot/remix-deploy.png" width="1100" style="margin: 0 10px;" />
</div>
------------------------------------------------------------------------

## 3. Minting the Collection

Minting performed via viem script:

-   Verifies contract owner
-   Calls mintBatch
-   Waits for transaction confirmation

<div align="center">
    <img src="https://raw.githubusercontent.com/snipe-dev/nft-ipfs-erc721/refs/heads/master/src/assets/screenshot/console-mint.png" width="1100" style="margin: 0 10px;" />
</div>

<div align="center">
    <img src="https://raw.githubusercontent.com/snipe-dev/nft-ipfs-erc721/refs/heads/master/src/assets/screenshot/bscscan-mint.png" width="1100" style="margin: 0 10px;" />
</div>
------------------------------------------------------------------------

## 4. Fetching NFT Metadata & Images

The fetch script:

-   Calls tokenURI(tokenId)
-   Converts ipfs:// to gateway URL
-   Downloads metadata JSON
-   Extracts image field
-   Outputs final image URL

<div align="center">
    <img src="https://raw.githubusercontent.com/snipe-dev/nft-ipfs-erc721/refs/heads/master/src/assets/screenshot/console-fetch.png" width="1100" style="margin: 0 10px;" />
</div>
------------------------------------------------------------------------

## Example Resolution

Metadata:
https://gateway.pinata.cloud/ipfs/QmSUsQe2gmAqNo5dK4ps5ULyNREpbieS5xRJv37bbWPNfi/1.json

Image:
https://gateway.pinata.cloud/ipfs/QmVGNKCXwdE3KZ8RZXWdmmrmnT4VtwqWkPCiNzhy8xBTRi

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

This project demonstrates a fully working NFT infrastructure from local
assets to on-chain tokens.
.