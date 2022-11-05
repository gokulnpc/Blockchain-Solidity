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
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    event votedEvent (
        uint indexed _candidateId
    );

    function vote (uint _candidateId) public {
        // require that they haven't voted before
        require(voters[msg.sender] != true);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidateCount);

        // record that voter has voted
        voters[msg.sender] = true;

        // update candidate vote Count
        candidates[_candidateId].count ++;

        // trigger voted event
        emit votedEvent(_candidateId);
    }

    function addCandidate (string memory _name) private {
        candidateCount ++;
        candidates[candidateCount] = Candidate(candidateCount, _name, 0);
    }   
}