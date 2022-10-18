// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

//importing contract from openzeppelin library
//install: npm install @openzeppelin/contracts

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

//use nftstorage to upload music file to get link
//paste those links in json file
//then upload all those json files to car.ipfs to get car file
//then upload that car file to nftstorage to get link

contract MusicNFTMarketplace is ERC721("npcToken","NPC"), Ownable
{
    string public baseURI = "https://bafybeiboclp6bev4s4v6mtjp3os42ceivv6djcqeo3ymvxw3ln6kksaenq.ipfs.nftstorage.link/";
    string public baseExtension = ".json";
    
    address public artist;
    uint256 public royaltyFee;

    //to sell nft at some price
    struct MarketItems
    {
        uint256 tokenId;

        //inorder for the owner address to receive ether as the payment
        //it should be payable
        address payable seller;
        uint256 price;
    } 

    //array of structures
    MarketItems[] public marketItems;

    //this contract will be deployed by the artist
    //_prices[] contains price of each of the nft
    //_royalty fees is amount that should be paid to artist
    //address _ artist is wallet address of the artist
    constructor(uint256 _royaltyFee,address _artist,uint256[] memory _prices) payable
    {
        require(_prices.length * _royaltyFee <= msg.value);
        royaltyFee=_royaltyFee;
        artist = _artist;
        for(uint8 i = 0 ; i < _prices.length ; i++)
        {
            require(_prices[i] > 0,"Prices must be greater than zero");
            _mint(address(this),i); 
            marketItems.push(MarketItems(i,payable(msg.sender),_prices[i]));
        }
    }

    //payable means it will be paid to contract
    function buyToken(uint256 _tokenId) external payable
    {
        uint256 price  = marketItems[_tokenId].price;
        address seller = marketItems[_tokenId].seller;
        require(msg.value == price,"values should match");
    }

    //to update royalty fee which can be done only by owner or artist
    //onlyOwner from Ownable contract
    function updateRoyaltyFee(uint256 _royaltyFee) external onlyOwner
    {
        royaltyFee = _royaltyFee;
    }


}