'use client'
import { Web3AuthModalPack,Web3AuthConfig } from '@safe-global/auth-kit'
import { MetaTransactionData, MetaTransactionOptions } from '@safe-global/safe-core-sdk-types'
import { ethers, utils } from 'ethers'
import { createContext, useCallback, useContext, useEffect, useState ,useMemo } from 'react'

import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from '@web3auth/base'
import { Web3AuthOptions } from '@web3auth/modal'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import Chain from '@/models/chains'
import chains from '@/chains/chains'
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
function stringify(obj) {
  let cache = [];
  let str = JSON.stringify(obj, function(key, value) {
    if (typeof value === "object" && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
  cache = null; // reset the cache
  return str;
}
type accountAbstractionContextValue = {
    ownerAddress?: string
    chainId: number
    safes: string[]
    chain?: Chain
    isAuthenticated: boolean
    isEditingEnabled:boolean
    privateKey:string
    web3Provider?: ethers.providers.Web3Provider
    
    
    setEditingEnabled:(isEditingEnabled:boolean) =>void
    loginWeb3Auth: () => void
    logoutWeb3Auth: () => void
    setChainId: (chainId: number) => void
    safeSelected?: string
    safeBalance?: string
    setSafeSelected: React.Dispatch<React.SetStateAction<string>>
    isRelayerLoading: boolean
    relayTransaction: () => Promise<void>
    gelatoTaskId?: string
    openStripeWidget: () => Promise<void>
    closeStripeWidget: () => Promise<void>
  }

  let initialState = {
    ownerAddress:'',
    isAuthenticated: false,
    isEditingEnabled:false,
    web3Provider:null,
    setEditingEnabled:()=>{},
    privateKey:"",
    web3ProviderUrl:"",  
    
        loginWeb3Auth: () => {},
    logoutWeb3Auth: () => {},
    relayTransaction: async () => {},
    setChainId: () => {},
    setSafeSelected: () => {},
    onRampWithStripe: async () => {},
    safes: [],
    chainId: 0,
    isRelayerLoading: true,
    openStripeWidget: async () => {},
    closeStripeWidget: async () => {}
  }

  if (typeof localStorage !== 'undefined') 
  {
  const storedState = localStorage.getItem('accountAbstractionState');
  
  if (storedState) {
     initialState = JSON.parse(storedState);
     console.log(storedState)
  }
}
  const accountAbstractionContext = createContext<accountAbstractionContextValue>(initialState )

  const useAccountAbstraction = () => {
    const context = useContext(accountAbstractionContext)
  
    if (!context) {
      throw new Error('useAccountAbstraction should be used within a AccountAbstraction Provider')
    }
  
    return context
  }

  

  const AccountAbstractionProvider = ({ children }: { children: JSX.Element }) => {
    // owner address from the email  (provided by web3Auth)
    const [ownerAddress, setOwnerAddress] = useState<string>(initialState.ownerAddress)
  
    // safes owned by the user
    const [safes, setSafes] = useState<string[]>([])
  
    // chain selected
    const [chainId, setChainId] = useState<number>(initialState.chainId)
    //
    const [isEditingEnabled,setEditingEnabled] = useState(initialState.isEditingEnabled)
    
    
    // web3 provider to perform signatures
    const [web3Provider, setWeb3Provider] = useState<ethers.providers.Web3Provider>()
    const [privateKey,setPrivateKey] = useState()
    const [web3ProviderConnected,setWeb3ProviderConnected] = useState(false)
    const [isAuthenticated , setIsAuthenticated] = useState(!! initialState.ownerAddress) ///&& !!chainId
    const chain = chains[chainId]
  
    /*// reset React state when you switch the chain
    useEffect(() => {
       
      setOwnerAddress('')
      setSafes([])
      console.log(chain)
      console.log(chainId)
     
      setWeb3Provider(undefined)
      setSafeSelected('')
    }, [chain])
  */
    // authClient
    const [web3AuthModalPack, setWeb3AuthModalPack] = useState<Web3AuthModalPack>()
  
  
    // auth-kit implementation
    const loginWeb3Auth = useCallback(async () => {
        console.log(chain)
        console.log("login")
        console.log(process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID )
     /* if(!chain) 
        return 
        console.log("We got a chain")*/
      try {

        const chainConfig = {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: chains[chainId].id,
            rpcTarget: chains[chainId].rpcUrl,
            displayName: chains[chainId].label,
            blockExplorer: chains[chainId].blockExplorerUrl,
            ticker: chains[chainId].token,
            tickerName: chains[chainId].shortName,
          };
          const privateKeyProvider = new EthereumPrivateKeyProvider({
            config: { chainConfig },
          });

        const options: Web3AuthOptions = {
            clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID , // https://dashboard.web3auth.io/
            web3AuthNetwork: "testnet",
            chainConfig,
            uiConfig: {
              theme: 'dark',
              loginMethodsOrder: ['google', 'facebook']
            }
          }
          
  
    // https://web3auth.io/docs/sdk/pnp/web/modal/initialize#configuring-adapters
const modalConfig = {
    [WALLET_ADAPTERS.TORUS_EVM]: {
      label: 'torus',
      showOnModal: false
    },
    [WALLET_ADAPTERS.METAMASK]: {
      label: 'metamask',
      showOnDesktop: true,
      showOnMobile: false
    }
  }

 

  // https://web3auth.io/docs/sdk/pnp/web/modal/whitelabel#whitelabeling-while-modal-initialization
  const openloginAdapter = new OpenloginAdapter({
    loginSettings: {
      mfaLevel: 'optional'
    },
    adapterSettings: {
      uxMode: 'popup',
      whiteLabel: {
        name: 'Safe'
      }
    },          

  })
  const web3AuthConfig: Web3AuthConfig = {
    txServiceUrl: chains[chainId].transactionServiceUrl
  }
  const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig)
        await web3AuthModalPack.init({
          options,
          adapters: [openloginAdapter],
          modalConfig
        })

        if (web3AuthModalPack && chain?.id)  {
         const { safes, eoa } = await web3AuthModalPack.signIn()
          const provider = web3AuthModalPack.getProvider() as ethers.providers.ExternalProvider
          console.log(web3AuthModalPack.web3Auth)

          console.log(provider)
          // we set react state with the provided values: owner (eoa address), chain, safes owned & web3 provider
          console.log(chain)
          console.log(web3AuthModalPack)
          setPrivateKey(web3AuthModalPack.web3Auth.walletAdapters.openlogin.openloginInstance.state.privKey)
          //setChainId(chains[1].id)
          setOwnerAddress(eoa)
          setIsAuthenticated(true)
         
          setSafes(safes || [])
         const _provider =new ethers.providers.Web3Provider(provider) 
          setWeb3Provider(_provider)
          setWeb3ProviderConnected(true)
          setWeb3AuthModalPack(web3AuthModalPack)
        }
      } catch (error) {
        console.log('error: ', error)
      }
    }, [chain])
  
    const logoutWeb3Auth = () => {
      web3AuthModalPack?.signOut()
      setEditingEnabled(false)
      
      setOwnerAddress('')
      setPrivateKey(null)
      setIsAuthenticated(false)
      setSafes([])
      setChainId(1)
      setWeb3Provider(undefined)
      setWeb3ProviderConnected(false)
      setSafeSelected('')
      setGelatoTaskId(undefined)
    }
  
    // TODO: add disconnect owner wallet logic ?
  
    // current safe selected by the user
    const [safeSelected, setSafeSelected] = useState<string>('')
  
   
    const [isRelayerLoading, setIsRelayerLoading] = useState<boolean>(false)
    const [gelatoTaskId, setGelatoTaskId] = useState<string>()
  
    // refresh the Gelato task id
    useEffect(() => {
      setIsRelayerLoading(false)
      setGelatoTaskId(undefined)
    }, [chainId])
  
    useEffect(()=>{
      console.log("Intitial State Changed")
    },[initialState])
  

    
   
    const state = {
      ownerAddress,
      chainId,
      chain,
      safes,
  
      isAuthenticated,
      privateKey,
      web3Provider,
      web3ProviderConnected,
      loginWeb3Auth,
      logoutWeb3Auth,
      setEditingEnabled,
      isEditingEnabled,
      setChainId,
  
      
    }

    if (typeof localStorage !== 'undefined') 
    {
      console.log(state)
      localStorage.setItem('accountAbstractionState', JSON.stringify(state));
    }
    return (
      <accountAbstractionContext.Provider value={state}>
        {children}
      </accountAbstractionContext.Provider>
    )
  }
  export { useAccountAbstraction, AccountAbstractionProvider }