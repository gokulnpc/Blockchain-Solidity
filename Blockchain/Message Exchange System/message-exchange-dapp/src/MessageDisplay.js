import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import StateContext from './StateContext.js';
import { ethers } from "ethers";
import compiledContract from "./compilerContract.json"
import "./App.css"
function MessageDisplay() {
  const [Messages, setMessages] = useState([])
  const contractAddress = compiledContract.address;
  const navigate = useNavigate()
  async function getMessages() {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum, "any");
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      compiledContract.abi,
      signer
    );
    const r = await contract.getSendedMessages();
    setMessages(r)
    console.log("Pushed to array")
  }
  const { account } = useContext(StateContext)
  useEffect(() => {
    if (!account) {
      navigate("/")
    } else {
      getMessages();
    }
  }, []);
  return (
    <>
      <h1>Sended Messages with your account {account} ok</h1>
      {Messages && (
        <div>
          {Messages.map((m, i) => {
            return (
              <h1 key={i}>
                Sended To: {m.to}
                <br />
                Message: {m.message}
              </h1>
            );
          })}
        </div>
      )}
      {Messages.length == 0 && <h1>No Messages</h1>}
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        Send a New Message
      </button>
      <br />
      <button
        onClick={() => {
          navigate("/ReceivedMessage");
        }}
      >
        Received Messages
      </button>
    </>
  );
}
export default MessageDisplay;
