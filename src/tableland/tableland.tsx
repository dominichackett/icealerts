import { Database } from "@tableland/sdk";
import { ethers } from "ethers";
export const emergencycontactsTable ="econtacts_314159_591"
export const messageTable ="messaging_314159_578"
export const tagsTable="icetag_314159_577"

const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY)
const provider = new ethers.providers.JsonRpcProvider(
    "https://api.calibration.node.glif.io/rpc/v1"
  );

const signer = wallet.connect(provider);

const db = new Database({signer})  


export const queryEmergencyContacts = async(owner:string)=>{
    try {
    const { results } = await db.prepare(`SELECT * FROM ${emergencycontactsTable} where owner='${owner}'  order by contract;`).all();

   return results;
}
catch(error:any)
{
    return []
}

}


export const queryMessage = async(owner:string)=>{

    try{
    const { results } = await db.prepare(`SELECT * FROM ${messageTable} where owner='${owner}';`).all();

   return results;
   }
   catch(error:any)
   {
    return []  
   }
}


export const queryTagByOwner = async(owner:string)=>{

    try{
    const { results } = await db.prepare(`SELECT * FROM ${tagsTable} where owner='${owner}';`).all();

   return results;
    }
    catch(error:any)
    {
       console.log(error)
        return []
    }
}


export const queryTagById = async(id:string)=>{
    try{
    const { results } = await db.prepare(`SELECT * FROM ${tagsTable} where tagid='${id}';`).all();

   return results;
}
catch(error:any)
{
    return []
}
}

