// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

//https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
//ERC 20 STANDARD

contract NPCToken 
{
    //constructor
    //set total no of tokens
    //read total no of tokens
    uint256 public totalSupply;
    constructor() public
    {
        totalSupply = 1000000;
    }
}