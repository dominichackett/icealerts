import { useState,useEffect } from "react";
import { ChatAndNotificationWidget,PUSH_TABS } from "@pushprotocol/uiweb";
import * as PushAPI from '@pushprotocol/restapi';
import { IUser } from '@pushprotocol/restapi';
import { useAccountAbstraction } from "../../context/accountContext";

export default function Chat(){
    const [pvtKey,setPvtKey]  = useState()
    const [account,setAccount] = useState()
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

    useEffect(()=>{
     async function setup()
     {
           setAccount(`eip155:${ownerAddress}`);
        
        const user = await PushAPI.user.get({ account: `eip155:${ownerAddress}`, env:"staging" });
              if (user?.encryptedPrivateKey) {
                  const response = await PushAPI.chat.decryptPGPKey({
                      encryptedPGPPrivateKey: (user as IUser).encryptedPrivateKey,
                      account: account,
                      signer: web3Provider,
                      env:"staging",
                      toUpgrade: true,
                    });
               setPvtKey(response);
              }
      
    
     }  
     if(web3ProviderConnected)
       setup()
   },[web3ProviderConnected])
   
    return(<ChatAndNotificationWidget
        account={account}
        signer={web3Provider}
        env={'staging'}
        activeTab={PUSH_TABS.APP_NOTIFICATIONS}
        decryptedPgpPvtKey={pvtKey}
     />)
}   
