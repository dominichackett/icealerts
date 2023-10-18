import * as LitJsSdk from "@lit-protocol/lit-node-client";
//import { encryptString,decryptToString } from "@lit-protocol/encryption";
import { checkAndSignAuthMessage } from '@lit-protocol/auth-browser';
import { ethers } from "ethers";
import { SiweMessage } from "siwe";
const litNodeClient = new LitJsSdk.LitNodeClient({
    litNetwork: 'cayenne',
  })
  const chain = "ethereum";


async function getAuthSig()
{
    
    const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY)
    const signer = wallet.connect(ethers.getDefaultProvider());

    // Craft the SIWE message
  const domain = 'localhost';
  const origin = 'https://localhost/login';
  const statement =
    'This message will be signed.';
  const siweMessage = new SiweMessage({
    domain,
    address: wallet.address,
    statement,
    uri: origin,
    version: '1',
    chainId: '1',
  });
  
  const messageToSign = siweMessage.prepareMessage();
  const signature = await signer.signMessage(messageToSign)
  return {
    sig: signature,
    derivedVia: 'web3.eth.personal.sign',
    signedMessage: messageToSign,
    address: wallet.address,
  }

}  
  const accessControlConditions = [
    {
      contractAddress: '',
      standardContractType: '',
      chain,
      method: '',
      parameters: [
        ':userAddress',
      ],
      returnValueTest: {
        comparator: '=',
        value: '0x5858769800844ab75397775Ca2Fa87B270F7FbBe'
      }
    }
  ]
  class Lit {
    client:any
  async connect() {
    await litNodeClient.connect();
    this.client = litNodeClient;
  }

    async  encryptString(info:string) {
        if (!this.client) {
          await this.connect()
        }
        const authSig = await getAuthSig();
        console.log(authSig)
    
        try {
          return await LitJsSdk.encryptString({
            dataToEncrypt: info,
            chain,
            authSig,
            accessControlConditions: accessControlConditions,
          }, litNodeClient);
        } catch (e) {
          console.log(e);
          throw new Error('Unable to encrypt content: ' + e);
        }
      }
      async decryptString(ciphertext:any, dataToEncryptHash:any) {
        if (!this.client) {
          await this.connect()
        }
        const authSig = await getAuthSig();
    
        console.log('ciphertext: ', ciphertext);
        console.log('data to decrypt: ', ciphertext);
        try {
          return await LitJsSdk.decryptToString(
            {
              accessControlConditions: accessControlConditions,
              ciphertext,
              dataToEncryptHash,
              authSig,
              chain,
            }, litNodeClient
          );
        } catch (e) {
          throw new Error('Unable to decrypt content: ' + e);
        }
      }
  }

 
  export default new Lit()