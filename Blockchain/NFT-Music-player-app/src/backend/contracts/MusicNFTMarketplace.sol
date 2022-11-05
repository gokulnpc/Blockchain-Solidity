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

//ERC721("npcToken","NPC") -> it can also be intitalized inside constructor
contract MusicNFTMarketplace is ERC721("npcToken","NPC"), Ownable
{
    string public baseURI = "https://bafybeiboclp6bev4s4v6mtjp3os42ceivv6djcqeo3ymvxw3ln6kksaenq.ipfs.nftstorage.link/";
    string public baseExtension = ".json";
    
    address public artist;
    uint256 public royaltyFee;

    //to sell nft at some price
    struct MarketItem
    {
        //token id of that nft
        uint256 tokenId;

        //inorder for the owner address to receive ether as the payment
        //it should be payable
        address payable seller;

        //price it is available for sale
        uint256 price;
    } 

    //event to be emmitted when the nft is bought
    event MarketItemBought(
        uint256 indexed tokenId,
        address indexed seller,
        address buyer,
        uint256 price
    );

    event MarketItemRelisted(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );
    //array of structures
    MarketItem[] public marketItems;

    //this contract will be deployed by the artist
    //_prices[] contains price of each of the nft
    //_royalty fees is amount that should be paid to artist
    //address _ artist is wallet address of the artist
    constructor(uint256 _royaltyFee,address _artist,uint256[] memory _prices) payable
    {
        //deployer should pay royalty fee to the artist
        require(_prices.length * _royaltyFee <= msg.value,"deployer must pay royalty fee for each token listed on the market place");
        royaltyFee=_royaltyFee;
        artist = _artist;
        for(uint8 i = 0 ; i < _prices.length ; i++)
        {
            require(_prices[i] > 0,"Prices must be greater than zero");

            //The _mint() internal function is used to mint a new NFT at the given address.

            //_mint -> inherited from ERC721 to contract address
            _mint(address(this),i); 
            marketItems.push(MarketItem(i,payable(msg.sender),_prices[i]));
        }
    }

    //payable means it will be paid to contract
    function buyToken(uint256 _tokenId) external payable
    {
        uint256 price  = marketItems[_tokenId].price;
        address seller = marketItems[_tokenId].seller;
        require(
            msg.value == price,
            "Please send the asking price in order to complete the purchase"
        );

        //it ahas already been purchased so chainging seller address to zero
        marketItems[_tokenId].seller = payable(address(0));

        //transfer nft from this address (deployer) to one who called the function 
        _transfer(address(this), msg.sender, _tokenId);

        payable(artist).transfer(royaltyFee);
        payable(seller).transfer(msg.value);

        emit MarketItemBought(_tokenId, seller, msg.sender, price);

    }

    //to update royalty fee which can be done only by owner or artist
    //onlyOwner inherited from Ownable contract
    function updateRoyaltyFee(uint256 _royaltyFee) external onlyOwner
    { 
        royaltyFee = _royaltyFee;
    }

    function resellToken(uint256 _tokenId,uint256 _price) external payable
    {
        //royaltyFee should be paid
        require(msg.value==royaltyFee,"Must pay royalty fee");
        require(_price>0,"Price must be greater than zero");
        marketItems[_tokenId].price = _price;
        marketItems[_tokenId].seller = payable(msg.sender);

        //now transfer this nft from msg.sender to contract address
        _transfer(msg.sender, address(this), _tokenId);

        emit MarketItemRelisted(_tokenId,msg.sender,_price);

    }

    //to fetch market items listed for sale
    function getAllUnsoldTokens() external view returns (MarketItem[] memory)
    {
        uint256 unsoldCount = balanceOf(address(this));
        MarketItem[] memory tokens = new MarketItem[](unsoldCount);
        uint256 currentIndex;
        for(uint256 i = 0;i<marketItems.length; i++)
        {
            if(marketItems[i].seller != address(0))
            {
                tokens[currentIndex] = marketItems[i];
                currentIndex++;
            }
        }
        return (tokens);
    }

    //to fetch market items that user owns
    function getMyTokens() external view returns(MarketItem[] memory)
    {
        uint256 myTokenCount = balanceOf(msg.sender);
        MarketItem[] memory tokens = new MarketItem[](myTokenCount);
        uint256 currentIndex;
        for(uint256 i = 0;i<marketItems.length ;i++)
        {
            if(marketItems[i].seller != msg.sender)
            {
                tokens[currentIndex] = marketItems[i];
                currentIndex++;
            }
        }
        return (tokens);
    }

    //it is going to override _baseURI function that we inherited from ERC721 contract 
    function _baseURI() internal view virtual override returns (string memory)
    {
        return baseURI;
    }

}

    /* Updates the royalty fee of the contract */
    /* Creates the sale of a music nft listed on the marketplace */
    /* Transfers ownership of the nft, as well as funds between parties */
    /* Allows someone to resell their music nft */
    /* Fetches all the tokens currently listed for sale */
    /* Fetches all the tokens owned by the user */
    /* Internal function that gets the baseURI initialized in the constructor */
