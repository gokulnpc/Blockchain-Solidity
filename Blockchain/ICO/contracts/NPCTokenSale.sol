// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./NPCToken.sol";

contract NPCTokenSale
{
    address admin;
    NPCToken public tokenContract;
    uint256 public tokenPrice;
    constructor(NPCToken _tokenContract,uint256 _tokenPrice) public
    {
        //assign a admin
        //Token contract
        //token price
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }
}