// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Election
{
    //candidate model
    struct Candidate
    {
        uint id;
        string name;
        uint count; 
    }

    //store candidate
    mapping(uint => Candidate) public candidates;

    //store candidate count 
    uint public candidateCount = 0;

    //admin
    address public admin;

    //voters
    mapping(address => bool ) public voters;

    constructor() public {
        admin = msg.sender;
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    event createCandidate
    (
        uint id,
        string name,
        uint count
    );

    function vote(uint _id) public {
        //valid voter
        require(voters[msg.sender] != true);

        //valid candidate
        require(_id>0 && _id<=candidateCount);
        candidates[_id].count +=1;
        voters[msg.sender] = true;
    }

    function addCandidate(string memory _name) private {
        require(msg.sender == admin);
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount,_name,0);
        emit createCandidate(candidateCount,_name,0);

    }
    
}