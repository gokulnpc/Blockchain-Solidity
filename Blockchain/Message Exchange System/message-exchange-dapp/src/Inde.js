import App from "./App";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import MessageDisplay from "./MessageDisplay.js";
import StateContext from "./StateContext.js";
import ReceivedMessage from "./ReceivedMessage.js";
import SendMessage from "./SendMessage.js";
import { useState } from "react";
function Inde() {
    const [account, setAccount] = useState("");
    const [isWalletConnected, setWalletConnected] = useState(false);
    return (
        <StateContext.Provider value={{ account, setAccount, isWalletConnected, setWalletConnected }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/sendMessage" exact element={<SendMessage />} />
                    <Route path="/sendedMessage" exact element={<MessageDisplay />} />
                    <Route path="/ReceivedMessage" exact element={<ReceivedMessage />} />
                    <Route path="/" element={<App />} />
                </Routes>
            </BrowserRouter>
        </StateContext.Provider>
    );
}
export default Inde;
