import { Database } from "@tableland/sdk";
import { ethers } from "ethers";
export const emergencycontactsTable ="emergencycontacts_314159_576"
export const messageTable ="messaging_314159_578"
export const tagsTable="icetag_314159_577"

const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY)
const signer = wallet.connect(ethers.getDefaultProvider());

const db = new Database({signer})  


export const queryEmergencyContacts = async(owner:string)=>{

    const { results } = await db.prepare(`SELECT * FROM ${emergencyTable} where owner='${owner}'  order by contract;`).all();

   return results;

}


export const queryMessage = async(owner:string)=>{

    const { results } = await db.prepare(`SELECT * FROM ${messageTable} where owner='${owner}';`).all();

   return results;

}


export const queryTagByOwner = async(owner:string)=>{

    const { results } = await db.prepare(`SELECT * FROM ${tagsTable} where owner='${owner}';`).all();

   return results;

}


export const queryTagById = async(id:string)=>{

    const { results } = await db.prepare(`SELECT * FROM ${tagsTable} where owner='${id}';`).all();

   return results;

}