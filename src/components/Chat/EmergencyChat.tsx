import { useState,useEffect } from "react";
import { Chat, ITheme } from '@pushprotocol/uiweb';
import { useAccountAbstraction } from "../../context/accountContext";

export default function EmergencyChat(){
    const [se,setPvtKey]  = useState()
    const [account,setAccount] = useState()
    const [signer,setSigner] = useState()
    const {
        isEditingEnabled,
        isAuthenticated,
        ownerAddress,
        chainId,
        web3Provider,
        loginWeb3Auth,
        web3ProviderConnected,
    
        // ...other context values and functions you need
      } = useAccountAbstraction();
      const theme: ITheme = {
        bgColorPrimary: '#FFFFFF',      // Dark background color
        bgColorSecondary: '#FFFFFF',    // Slightly lighter secondary background
        textColorPrimary: '#000000',    // White text
        textColorSecondary: '#A0A0A0',  // Light gray for secondary text
        btnColorPrimary: 'green',     //
        btnColorSecondary: '#800080',   // A complementary color for secondary buttons (e.g., purple)
        border: '1px solid #303030',     // Slightly lighter border color
        borderRadius: '8px',             // Rounded corners for elements
        moduleColor: '#a5b4fc',         // A vibrant color for chat modules (e.g., pink)
      };
    useEffect(()=>{
     async function setup()
     {
           setAccount(`eip155:${ownerAddress}`);
           setSigner( web3Provider?.getSigner()) 
           console.log( web3Provider?.getSigner())
    
     }  
     if(web3ProviderConnected)
       setup()
      else
      console.log("Web 3")
   },[web3ProviderConnected])

   useEffect(() => {
    loginWeb3Auth();
  }, []);
   
   return (
    web3Provider ? (
      <Chat
        account={ownerAddress}
        supportAddress="0x86820D4C1C9E12F5388136B19Da99A153ED767C1"
        apiKey=""
        signer={signer}
        env='staging'
        theme={theme}
      />
    ) : null
  );
}   
