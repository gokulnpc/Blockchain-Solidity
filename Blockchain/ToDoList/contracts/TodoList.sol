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

  //event
  event TaskCreated(
    uint id,
    string content,
    bool completed
  );

  //event
  event TaskCompleted
  (
    uint id,
    bool completed
  );

  constructor() public {
    createTask("Check out dappuniversity.com");
  }

  function createTask(string memory _content) public {
    taskCount ++;
    tasks[taskCount] = Task(taskCount, _content, false);
    emit TaskCreated(taskCount,_content,false);
  }

  function toggleCompleted(uint _id) public {
    Task memory _task = tasks[_id];
    _task.completed = !_task.completed;
    tasks[_id] = _task;
    emit TaskCompleted(_id, _task.completed);
  }


}