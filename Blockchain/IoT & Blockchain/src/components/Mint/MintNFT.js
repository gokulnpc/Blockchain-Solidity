import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";


function MintNFT({ contract }) {
    const mainContract = contract.contract;
    const signer = contract.singer
    const input = useRef(null);
    const name = useRef(null)
    const [metadataURI , setMetadata] = useState(null)
    const [mint,setMint] = useState(false);



    const mintToken = async (metadataURI) => {
        console.log("Minting")

        console.log(mainContract)

        const connection = mainContract.connect(signer);
        const addr = connection.address;
        console.log("MEta is",metadataURI)
        const result = await mainContract.payToMint(addr, metadataURI, {
      
          });

          console.log( await result.wait())

    }


  function upload() {

        const nftname = name.current.value;
        const formData = new FormData();
        formData.append('image', 'Newimage');
        formData.append('nft', input.current.files[0]);
        formData.append('name', nftname);

        fetch("http://localhost:3001/image", {
            method: 'PUT',
            body: formData
        }).then((res) => {
            return res.json()
        }).then(async data => {
          
          await  mintToken(data.data)
           
        })

    }


    return (
        <div>

            <div>
                <label>Image</label>
                <input ref={input} type="file" />
            </div>
            <div>
                <label>Name</label>
                <input ref={name} type="text" />
            </div>

            <div>
                <button onClick={upload}>Submit</button>
            </div>
        </div>
    )



}

export default MintNFT;