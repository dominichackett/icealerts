
'use client'
import { Fragment, useState,useEffect } from 'react'
import { Dialog, Tab, Transition } from '@headlessui/react'
import {  XMarkIcon} from '@heroicons/react/24/outline'
import QRCode from "react-qr-code";

import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import { useAccountAbstraction } from "../../context/accountContext";

import { ethers } from 'ethers'
  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  





export default function ViewTag() {
    const [open, setOpen] = useState(false)
   
    const {
      isEditingEnabled,
      isAuthenticated,
      ownerAddress,
      chainId,
      privateKey,
      web3Provider,
      loginWeb3Auth,
      web3ProviderConnected,
  
      // ...other context values and functions you need
    } = useAccountAbstraction();
  
    useEffect(() => {
      loginWeb3Auth();
     
    }, []);

    useEffect(()=>{

      if(web3ProviderConnected)
      {
        const wallet = new ethers.Wallet(privateKey)
        console.log(wallet.address)

      }
    },[web3ProviderConnected])
  
   
  return (
    <div className="bg-black">
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Links */}
                <Tab.Group as="div" className="mt-2">
                  <div className="border-b border-gray-200">
                    <Tab.List className="-mb-px flex space-x-8 px-4">
                 
                    </Tab.List>
                  </div>
                  <Tab.Panels as={Fragment}>
               
                  </Tab.Panels>
                </Tab.Group>

             
             
          
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <Header />
      <main>
      <div className="bg-black">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div >
          {/* Image gallery */}
          <Tab.Group as="div" className="flex flex-col">
          
        
                         <div className="mb-8">
  
   <label
                      for="file"
                      className="cursor-pointer relative flex flex-col h-[480px] min-h-[200px] items-center justify-center rounded-lg border border-dashed border-[#A1A0AE] bg-[#353444] p-12 text-center"
                    >
                                     {web3ProviderConnected &&    <QRCode
    size={256}
    style={{height: "auto", maxWidth: "100%", width: "100%",cursor:"pointer" }}
    value={privateKey}
    viewBox={`0 0 256 256`}
    title="ICE Mobile"
    
    />}
                                     {web3ProviderConnected &&     <h1 className="mt-10 text-3xl font-bold tracking-tight text-white">Scan with Mobile App</h1>}
  

                    </label>
</div>


 
               
          </Tab.Group>
       
          {/* Product info */}
        
        </div>
      </div>
    </div>
        </main>

 <Footer />
    </div>
  )
}
