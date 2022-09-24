// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

//https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
//ERC 20 STANDARD

contract NPCToken 
{
    //maximum number of npc token for sale
    //we shoud tell the public what is the total supply so it should be public
    uint256 public totalSupply;
    string public name = "NPC Token";
    string public symbol = "NPC";
    string public standard = "NPC Token v1.0";

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    //mapping address to no of npcTokens
    mapping(address => uint256) public balanceOf;

    //to map allowance alloted
    mapping(address => mapping(address => uint256)) public allowance;

    //total of 1 million tokens will be mapped to admin
    //admin will determine initial number of coins
    constructor (uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    //it is called by user to send tokens to another user
    //it is called by contract to send tokens to user
    //it is called by admin to send tokens to smart contract
    //hers msg.sender is user
    function transfer(address _to, uint256 _value) public returns (bool success) {
        //here msg.address is tokenSaleContract address
        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    //it is called by user to specify the allowance for spender from his account
    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    //it is called by spender 
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);

        return true;
    }
}