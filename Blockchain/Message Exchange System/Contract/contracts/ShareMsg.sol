// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;
contract ShareMsg{
    struct message{
        address from;
        address to;
        string message;
    }
    mapping(address=>message[]) private sendedMessages;
    mapping(address=>message[]) private receiverMessages;
    function sendMessage(address receiver,string memory messageToSend) public  {
        message[] storage prevMsg=sendedMessages[msg.sender];
        message memory newMsg=message(msg.sender,receiver,messageToSend);
    prevMsg.push(newMsg);
    sendedMessages[msg.sender]=prevMsg;
    message[] storage receiverMsg=receiverMessages[receiver];
    receiverMsg.push(newMsg);
    receiverMessages[receiver]=receiverMsg;
    }

    function getReceivedMessages() public view returns(message[] memory){
        return receiverMessages[msg.sender];
    }
    
    function getSendedMessages() public view returns(message[] memory){
        return sendedMessages[msg.sender];
    }
}
