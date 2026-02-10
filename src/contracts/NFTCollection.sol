// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NFTCollection is ERC721, Ownable {

    using Strings for uint256;

    uint256 private _nextTokenId;
    string private _baseTokenURI;

    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseTokenURI_
    ) ERC721(name_, symbol_) Ownable(msg.sender) {
        _baseTokenURI = baseTokenURI_;
    }

    function mint(address to) external onlyOwner {
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        _safeMint(to, tokenId);
    }

    function mintBatch(address to, uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be > 0");

        for (uint256 i = 0; i < amount; i++) {
            uint256 tokenId = _nextTokenId;
            _nextTokenId++;

            _safeMint(to, tokenId);
        }
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    function tokenURI(uint256 tokenId)
    public
    view
    override
    returns (string memory)
    {
        ownerOf(tokenId); // This will revert if token does not exist
        return string(
            abi.encodePacked(
                _baseURI(),
                tokenId.toString(),
                ".json"
            )
        );
    }
}
