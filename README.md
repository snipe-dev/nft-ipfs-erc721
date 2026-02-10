# nft-ipfs-erc721

End-to-end ERC-721 + IPFS workflow for NFT automation.

## Overview

This project demonstrates a full NFT pipeline:

1. Upload images to IPFS using Pinata and obtain CIDs
2. Generate NFT metadata based on uploaded assets
3. Create and deploy an ERC-721 smart contract
4. Automatically mint NFTs using IPFS metadata links
5. Query `tokenURI(uint256 tokenId)` from the deployed contract
6. Resolve metadata, extract image URLs, and download images from IPFS

The repository is intended for experimentation, learning, and automation of NFT-related workflows.

## Features

- Pinata IPFS integration
- ERC-721 smart contract deployment
- Automated NFT minting
- tokenURI resolution
- Metadata parsing and image downloading
