// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;

//1.list tasks in the smart contract
//2.list task in the console
//3.list task in the client side application
//4.list task in the test 

contract TodoList {
  uint public taskCount = 0;

  struct Task {
    uint id;
    string content;
    bool completed;
  }

  mapping(uint => Task) public tasks;

  constructor() public {
    createTask("Check out dappuniversity.com");
  }

  function createTask(string memory _content) public {
    taskCount ++;
    tasks[taskCount] = Task(taskCount, _content, false);
  }


}