import React, { useEffect, useState } from 'react'
import { Button } from "react-bootstrap"
export default function App1() {

    const [result, setResult] = useState("");
    const [check, setCheck] = useState(false);
    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is installed!');
            setResult("Metamask is Installed");
            setCheck(true);
        }
        else {
            console.log("metamask is not installed");
            setResult("Metamask is not insgtalled");
        }
    }, [])


    return (
        <>
            <div>Metamask installed??</div>
            <p>{result}</p>
            {check && <Button className='primary'>connect to wallet</Button>}
        </>

    )
}
