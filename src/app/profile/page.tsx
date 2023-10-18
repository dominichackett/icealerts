
'use client'
import { Fragment, useState,useEffect } from 'react'
import { Dialog, Tab, Transition,Menu } from '@headlessui/react'
import { Disclosure, RadioGroup } from '@headlessui/react'
import { StarIcon } from '@heroicons/react/20/solid'
import {  VideoCameraIcon,ChatBubbleLeftIcon,HeartIcon, MinusIcon, PlusIcon ,XMarkIcon} from '@heroicons/react/24/outline'

import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Chat from '@/components/Chat/Chat'

import { useAccountAbstraction } from "../../context/accountContext";


import { UserProfilerManagerAddress,UserProfilerManagerABI } from '@/components/Contracts/contracts'
  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  





export default function ViewTag() {
    const [open, setOpen] = useState(false)
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const [contacts,setContacts] = useState([{name:'Dominic Hackett',address:"0x01231"},{name:'Wife',address:"0x01232"},{name:'Mother',address:"0x01233"},{name:'Father',address:"0x012322"},{name:'Mother-in-law',address:"0x012335"}])
    const [preview, setPreview] = useState('')
    const [selectedFile, setSelectedFile] = useState(undefined)
 // create a preview as a side effect, whenever selected file is changed
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

 useEffect(() => {
    if (!selectedFile) {
        setPreview('')
        return
    }
  
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)
  
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
        setSelectedFile(undefined)
        return
    }
  
    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0])
  }

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
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <Tab.Group as="div" className="flex flex-col">
          
        
                         <div className="mb-8">

                         <input
    required={!selectedFile ? true: false}
    type="file"
    name="file"
    id="file"
    className="sr-only"
    onChange={onSelectFile}
  />
  
   <label
                      for="file"
                      className="cursor-pointer relative flex h-[480px] min-h-[200px] items-center justify-center rounded-lg border border-dashed border-[#A1A0AE] bg-[#353444] p-12 text-center"
                    >
                                           <img src={preview ? preview: '/images/profile.jpg'}/>

                    </label>
</div>
<div className="mb-8">
{web3ProviderConnected  &&   <Chat address={ownerAddress}/>}
        <div
       
          className="mb-4 text-white rounded-md bg-[#4E4C64] flex items-center justify-center rounded-md py-4 px-8 border border-dashed border-[#A1A0AE] bg-[#353444]"
        >
                   <div className=" mt-16 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className=" text-3xl font-bold tracking-tight text-white">ICE Tag ID</h1>

            <div className="mt-4 sm:col-span-3">
             
              <div className="mt-2 mb-12">
              <h1 className="text-5xl font-bold tracking-tight text-green-500">1234567890</h1>

              </div>
            </div>

        

            
            
      
          </div>
          
        </div>
     
    </div>
 
<div className="mb-8">
<h1 className="mb-4 text-3xl font-bold tracking-tight text-white">App Emergency Contacts</h1>

      {contacts.map((item, index) => (
        <div
          key={index}
          className="mb-4 text-white rounded-md bg-[#4E4C64] flex justify-between rounded-md py-4 px-8 border border-dashed border-[#A1A0AE] bg-[#353444]"
        >
          <span>{item.name}</span>
         
        </div>
      ))}
    </div>
 
               
          </Tab.Group>
       
          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-white">ICE Tag Information</h1>

            <div className="mt-4 sm:col-span-3">
              <label htmlFor="country" className="block text-sm font-medium leading-6 text-white">
                First Name
              </label>
              <div className="mt-2">
                <input
                  id="firstname"
                  name="firstname"
                  autoComplete="firstname"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                  
              </div>
            </div>

            <div className="mt-4 sm:col-span-3">
              <label htmlFor="country" className="block text-sm font-medium leading-6 text-white">
                Last Name
              </label>
              <div className="mt-2">
                <input
                  id="lastname"
                  name="lastname"
                  autoComplete="lastname"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                  
              </div>
            </div>
            <div className="mt-4 sm:col-span-3">
              <label htmlFor="country" className="block text-sm font-medium leading-6 text-white">
                Date of Birth
              </label>
              <div className="mt-2">
                <input
                  id="dob"
                  name="dob"
                  autoComplete="dob"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                  
              </div>
            </div>

            <div className="mt-4 sm:col-span-3">
            <label htmlFor="bloodTypeSelect"  className="block text-sm font-medium leading-6 text-white">Blood Type:</label>

              <div className="mt-2">
      <select
        id="bloodTypeSelect"
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"

      >
        <option value="">Select a blood type</option>
        {bloodTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select> 
              </div>
            </div>

            <div className="mt-4 sm:col-span-3">
            <label htmlFor="organdonor"  className="block text-sm font-medium leading-6 text-white">Organ Donor:</label>

              <div className="mt-2">
      <select
        id="organdonor"
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"

      >
        <option value="No">No</option>
        <option value="Yes">Yes</option>

       
      </select> 
              </div>
            </div>

            <div className="mt-4 sm:col-span-3">
              <label htmlFor="country" className="block text-sm font-medium leading-6 text-white">
                Address
              </label>
              <div className="mt-2">
              <textarea
                  id="address"
                  name="address"
                  rows={5}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                  
              </div>
            </div>

          
            
            <div className="mt-4 sm:col-span-3">
              <label htmlFor="about" className="block text-sm font-medium leading-6 text-white">
                Allergies
              </label>
              <div className="mt-2">
              <textarea
                  id="allergies"
                  name="allergies"
                  rows={10}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                  
              </div>
            </div>

            <div className="mt-4 sm:col-span-3">
              <label htmlFor="about" className="block text-sm font-medium leading-6 text-white">
                Medications
              </label>
              <div className="mt-2">
              <textarea
                  id="medication"
                  name="medication"
                  rows={10}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                  
              </div>
            </div>
           
            <div className="mt-4 sm:col-span-3">
              <label htmlFor="emergencycontact" className="block text-sm font-medium leading-6 text-white">
                Emergency Contacts
              </label>
              <div className="mt-2">
              <textarea
                  id="emergencycontact"
                  name="emergencycontact"
                  rows={10}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                  
              </div>
            </div>
           
            <div className="mt-4 sm:col-span-3">
              <label htmlFor="other" className="block text-sm font-medium leading-6 text-white">
                Other Information
              </label>
              <div className="mt-2">
              <textarea
                  id="other"
                  name="other"
                  rows={10}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                  
              </div>
            </div>
           

            
            <div className="sm:flex-col1 mt-10 flex">
               
               <button
                                   
               
                 className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
               >
                 Save Tag
               </button>

             </div>
       


      
          </div>
        </div>
      </div>
    </div>
        </main>

 <Footer />
    </div>
  )
}
