// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;

contract SimpleStorage
{
    uint256 favouriteNumber;
    bool favouriteBool;

    //struct
    struct People
    {
        uint256 favouriteNumber;
        string name;        
    }
    
    mapping(string => uint256) public nameToFavouriteNumber;

    //dynamic array
    People[] public people;

    //public function
    //it changes the state so it requires ether
    function store(uint256 _favouriteNumber) public
    {
        favouriteNumber = _favouriteNumber;
    }

    //view function => no change in state
    //no transaction
    //no ether required
    //view, pure functions does not require transaction
    //view function used to view the state 
    //pure functions purely will do some kind of mathematical cal but it wont change the state
    //public variables have view function by default
    function retrieve() public view returns(uint256)
    {
        return favouriteNumber;
    } 


    function addPerson(string memory _name,uint256 _favouriteNumber) public 
    {
        //people.push(People({favouriteNumber:_favouriteNumber,name: _name}));
        people.push(People(_favouriteNumber,_name));
        nameToFavouriteNumber[_name] = _favouriteNumber;
    }
}
