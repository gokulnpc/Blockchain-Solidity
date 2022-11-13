import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import StateContext from "./StateContext.js";
import { ethers } from "ethers";
import compiledContract from "./compilerContract.json";
function ReceivedMessage() {
  const [Messages, setMessages] = useState([]);
  const contractAddress = compiledContract.address;
  const navigate = useNavigate();
  async function getMessages() {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum, "any");
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      compiledContract.abi,
      signer
    );
    const r = await contract.getReceivedMessages();
    setMessages(r);
    console.log("Pushed to array");
  }
  const { account } = useContext(StateContext);
  useEffect(() => {
    if (!account) {
      navigate("/");
    } else {
      getMessages();
    }
  }, []);
  return (
    <>
      <h1>Received Messages with your account {account}</h1>
      {Messages && (
        <div>
          {Messages.map((m, i) => {
            return (
              <h1 key={i}>
                Sended From: {m.from}
                <br />
                Message: {m.message}
              </h1>
            );
          })}
        </div>
      )}
      {Messages.length == 0 && <h1>You dont have Messages</h1>}
      <button onClick={() => { navigate("/") }}>Send a New Message</button>
      <button onClick={() => { navigate("/sendedMessage") }}>Sended Messages</button>
    </>
  );
}
export default ReceivedMessage;
