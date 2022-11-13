import { ethers } from "ethers"
import compiledContract from "./compilerContract.json";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import StateContext from "./StateContext";
function SendMessage() {
  const navigate = useNavigate();
  const { account, setAccount, isWalletConnected, setWalletConnected } =
    useContext(StateContext);
  const contractAddress = compiledContract.address;
  async function SendMessage() {
    const rAddr = document.getElementById("rAddr").value;
    const messag = document.getElementById("Message").value;
    console.log(`Address: ${rAddr}, Message: ${messag}`);
    if (!rAddr || !messag) {
      alert("Please enter all details");
    } else {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        compiledContract.abi,
        signer
      );
      await contract.sendMessage(rAddr, messag);
      alert("Message sent successfully");
    }
  }
  useEffect(() => {
    if (!account) {
      navigate("/")
    }
  }, [])
  return (
    <div id="firstPage">
      <h4>You Connected With Account: {account}</h4>
      <div id="inputMessageBox">
        <label htmlFor="rAddr">Enter Receiver Address: </label>
        <br />
        <input type="text" id="rAddr"></input>
        <br />
        <label htmlFor="Message">Enter Message: </label>
        <br />
        <input type="text" id="Message"></input>
        <br />
        <button type="submit" onClick={SendMessage}>
          Submit
        </button>
      </div>
      <div>
        <button
          id="sendMsg"
          onClick={() => {
            navigate("/sendedMessage");
          }}
        >
          See Sended Messages
        </button>
        <button
          id="ReceivedMessage"
          onClick={() => {
            navigate("/ReceivedMessage");
          }}
        >
          See Received Messages
        </button>
      </div>
    </div>
  );
}
export default SendMessage;
