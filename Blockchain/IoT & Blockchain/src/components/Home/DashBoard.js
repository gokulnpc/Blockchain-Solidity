import { useState } from "react"
import MintNFT from "../Mint/MintNFT"


function Dashboard(props) {
    
    const [mint,clickMint] = useState(false)


    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center'

        }}>
          
            <div>
                <h1>Welcome {props.address}</h1>
            </div>

            <div>
                <button style={{
                    width: '200px',
                    height: '50px',
                    backgroundColor: 'red',
                    border: 'none',
                    color: "white",
                    fontSize: '23px'
                }} onClick={()=>{
                    clickMint(true)
                }}>
                    Mint NFT
                </button>
            </div>

             {mint?<MintNFT contract={props.contract}/>:""}
            <div style={{
                borderBottom: '2px solid black',
                fontSize: '30px'
            }}>
                <h3>Your Minted NFT's</h3>
            </div>

        </div>
    )


}

export default Dashboard