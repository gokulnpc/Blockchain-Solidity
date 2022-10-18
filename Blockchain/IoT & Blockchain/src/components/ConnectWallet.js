

import Heading from './Heading.js';
function ConnectWallet({connect}){


   return(
    <div>

        <Heading></Heading>
         <div style={{
        display:"flex",
        justifyContent:'center',
        marginTop:"50px",
        
    }}>
    
        <button style={{
            width:"300px",
            height:"50px",
            backgroundColor:'red',
            border:'none',
            borderRadius:'20px',
            color:'white',
            fontSize:'22px'
        }}
        onClick={connect}>Connect your Wallet</button>
    </div>

    </div>
   
   ) 

}

export default ConnectWallet