// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./NPCToken.sol";

//https://github.com/dapphub/ds-math/blob/master/src/math.sol
//for safe math
contract NPCTokenSale
{
    address admin;
    NPCToken public tokenContract;
    uint256 public tokenPrice;

    //to tell user how many got sold
    uint256 public tokensSold;

    event Sell
    (
        address _buyer,
        uint256 _amount
    );

    function multiply(uint x, uint y) internal pure returns(uint z)
    {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }

    //it is called by admin
    //admin sets token price
    //admin gives npcToken instance
    //admin is admin
    constructor(NPCToken _tokenContract,uint256 _tokenPrice) public
    {
        //assign a admin
        //Token contract
        //token price
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function buyTokens(uint256 _numberOfTokens) public payable {

        //require that buyer is not underpaying
        require(msg.value == multiply(_numberOfTokens, tokenPrice));

        //require that contract has enough tokens
        //address(this) => address of this contract sale
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);

        //provision tokens
        //require that transfer is successful
        //transfer function is invoked by 
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        tokensSold += _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);
    }

    //end sale -> it can only b
    function endSale() public {
        //only admin can call this function
        require(msg.sender == admin);
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));

        // UPDATE: Let's not destroy the contract here
        // Just transfer the balance to the admin
        //admin.transfer(address(this).balance);
    }
}
