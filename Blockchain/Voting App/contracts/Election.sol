// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Election
{
    struct Candidate
    {
        uint256 id;
        string name;
        uint256 count; 
    }

    Candidate [] public candidates;
    address public admin;
    uint256 public candidateCount = 0;
    mapping(address => bool ) public voters;

    constructor() public {
        admin = msg.sender;
    }

    function vote(uint256 _id) public {
        require(voters[msg.sender] != true);
        candidates[_id-1].count +=1;
        voters[msg.sender] = true;
    }

    function addCandidate(string memory _name) public {
        require(msg.sender == admin);
        candidates.push(Candidate(candidateCount+1,_name,0));
    }
    
}