
'use client'
import { Fragment, useState,useEffect } from 'react'
import { Dialog, Tab, Transition,Menu } from '@headlessui/react'
import { Disclosure, RadioGroup } from '@headlessui/react'
import { StarIcon } from '@heroicons/react/20/solid'
import {  VideoCameraIcon,ChatBubbleLeftIcon,HeartIcon, MinusIcon, PlusIcon ,XMarkIcon} from '@heroicons/react/24/outline'

import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import EmergencyChat from '@/components/Chat/EmergencyChat'
import { useAccountAbstraction } from "../../context/accountContext";
import Chat from '@/components/Chat/Chat'
import VideoCall from '@/components/VideoCall/VideoCall'
import { ethers } from 'ethers'
import Notification from '@/components/Notification/Notification'  
import { sendNotifications } from '../../../utils/utils'
import { queryTagById,queryEmergencyContacts } from '@/tableland/tableland'
import lit from "@/lit/lit"
import { Web3Storage, File } from "web3.storage";

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  





export default function ViewTag() {
    const [open, setOpen] = useState(false)
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const [contacts,setContacts] = useState([])
    const [preview, setPreview] = useState('')
    const [videoCall,setVideoCall] = useState()
    const [addressToCall,setAddressToCall] = useState()
    const [personTocall,setPersonTocall] = useState()
    const [personToMessage,setPersonToMessage] = useState()
    const [addressToMessage,setAddresToMessage] = useState()
    const [tagFound,setTagFound] = useState(false)
    const [tagQueried,setTagQueried] = useState(false)
    const [dob, setDOB] = useState(new Date());

    const [tag,setTag] = useState()
    const [storage] = useState(
      new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY })
    );
     // NOTIFICATIONS functions
    const [notificationTitle, setNotificationTitle] = useState();
    const [notificationDescription, setNotificationDescription] = useState();
    const [dialogType, setDialogType] = useState(1);
    const [show, setShow] = useState(false);
    const close = async () => {
      setShow(false);
     };
    const closeVideoCall = ()=>{
        setVideoCall(false)
    }
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
  
    const setCallData=(name:any,address:any)=>{
      if(!isAuthenticated)
      {
         setDialogType(2) //Error
         setNotificationTitle("View Tag")
         setNotificationDescription("Please login to place call.")
         setShow(true)
         return
      }
      setPersonTocall(name)
      setAddressToCall(address)
    }

   
    const setMessageData=(name:any,address:any)=>{
       
      if(!isAuthenticated)
      {
         setDialogType(2) //Error
         setNotificationTitle("View Tag")
         setNotificationDescription("Please login to send message.")
         setShow(true)
         return
      }
       setPersonToMessage(name)
       setAddresToMessage(address)   
    }
    const tagScanned = async()=> {
      const tagid = document.getElementById("tagid").value  
      if(!tagid || tagid =="" || tagid == undefined)
      {
        setNotificationTitle("View Tag")
        setNotificationDescription("Please enter a tag id")
        setDialogType(2) //Error
        setShow(true)
        return
      }
      setTag(null)
      setContacts([])
      setPreview(null)
        setNotificationTitle("View Tag")
        setNotificationDescription(`Searching for tag: ${tagid}`)
        setDialogType(3) //Info
        setShow(true)  
      
      const _tag = await queryTagById(tagid)
      console.log(_tag)
      if(_tag.length > 0)
      {
        setNotificationTitle("View Tag")
        setNotificationDescription(`Tag id: ${tagid} found`)
        setDialogType(1) //Success
        setShow(true)  
        const _contacts = await queryEmergencyContacts(_tag[0].owner)
        if(_contacts.length > 0)
        {
            let notificationList = []
            let contactList = []
            for(const _contact in _contacts)
            {
               notificationList.push(`eip155:5:${_contacts[_contact].contactAddress}`)
               contactList.push({contact:_contacts[_contact].contact,contactAddress:ethers.utils.getAddress(_contacts[_contact].contactAddress)})
            }
            setContacts(contactList)
            const _date = new Date()

            //Push Protocol Notification
            await sendNotifications(`Tag ID: ${tagid} Scanned`,`Date: ${_date.toDateString()}`,notificationList)
               
        
             
      }

      if(_tag[0].cid !="nocid")
      {
        const res = await storage.get(_tag[0].cid)
        console.log(`Got a response! [${res.status}] ${res.statusText}`)
        if (!res.ok) {
          setNotificationTitle("View Tag")
          setNotificationDescription("Error getting medical data")
          setDialogType(2) //Error
          setShow(true)
          return
        }
      
        // unpack File objects from the response
         const files = await res.files()
        const textContent = await files[0].text();
        const obj = JSON.parse(textContent)
        const decryptedData = await lit.decryptString(obj.data,obj.hash)
        const _t = JSON.parse(decryptedData)
        setTag({tagid:_tag[0].tagid , ..._t})
        console.log(decryptedData)
        setDOB(new Date(_t.dob))
        setPreview( `https://ipfs.io/ipfs/${_t.cid}/${_t.image}`)
        console.log(`https://ipfs.io/ipfs/${_t.cid}/${_t.image}`)
      }
      else{
         setTag({tagid:_tag[0].tagid})
      }
       
    
      
    
    }else{
      setNotificationTitle("View Tag")
      setNotificationDescription("Tag not found")
      setDialogType(2) //Error
      setShow(true)
    }

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
  
   <label
                      for="file"
                      className="cursor-pointer relative flex h-[480px] min-h-[200px] items-center justify-center rounded-lg border border-dashed border-[#A1A0AE] bg-[#353444] p-12 text-center"
                    >
                                           <img src={preview ? preview: '/images/profile.jpg'}/>

                    </label>
</div>
{(web3ProviderConnected && addressToCall)&&<VideoCall address={ownerAddress} addressToCall={addressToCall} personTocall={personTocall} caller={true} />}
<div className="mb-8">
   
        <div
       
          className="mb-4 text-white rounded-md bg-[#4E4C64] flex items-center justify-center rounded-md py-4 px-8 border border-dashed border-[#A1A0AE] bg-[#353444]"
        >
                   <div className=" mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-white">ICE Tag Information</h1>

            <div className="mt-4 sm:col-span-3">
              <label htmlFor="country" className="block text-sm font-medium leading-6 text-white">
                ICE Tag ID
              </label>
              <div className="mt-2">
                <input
                  id="tagid"
                  name="tagid"
                  autoComplete="tagid"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
                  
              </div>
            </div>

        

            
              <div className="sm:flex-col1 mt-10 flex">
               
                <button
                                    
                
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                onClick={()=> tagScanned()}>
                  Search Tag
                </button>

              </div>
        

      
          </div>
          
        </div>
     
    </div>
 
<div className="mb-8">
  {(web3ProviderConnected && personToMessage && addressToMessage )&& <EmergencyChat address={ownerAddress} personToMessage={personToMessage} addressToMessage={addressToMessage} />}
<h1 className="mb-4 text-3xl font-bold tracking-tight text-white">App Emergency Contacts</h1>

      {contacts.map((item, index) => (
        <div
          key={index}
          className="mb-4 text-white rounded-md bg-[#4E4C64] flex justify-between rounded-md py-4 px-8 border border-dashed border-[#A1A0AE] bg-[#353444]"
        >
          <span>{item.contact}</span>
          <div className="flex space-x-4">
            {/* Video Call Button */}
            <button className="flex items-center p-2 bg-red-500 text-white rounded-md" onClick={()=>setCallData(item.contact,item.contactAddress)}>
              <VideoCameraIcon className="w-5 h-5 mr-2" /> {/* Adjust icon size and spacing */}
              Video Call
            </button>

            {/* Message Button */}
            <button className="flex items-center p-2 bg-green-500 text-white rounded-md" onClick={()=>setMessageData(item.contact,item.contactAddress)}>
              <ChatBubbleLeftIcon className="w-5 h-5 mr-2" /> {/* Adjust icon size and spacing */}
              Message
            </button>
          </div>
        </div>
      ))}
    </div>
 
               
          </Tab.Group>
       
          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-white">Tag Information</h1>

            <div className="mt-4 sm:col-span-3">
              <label htmlFor="country" className="block text-sm font-medium leading-6 text-white">
                First Name
              </label>
              <div className="mt-2">
                <input
                  id="firstname"
                  name="firstname"
                  value={tag?.firstname} 

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
                  value={tag?.lastname} 

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
                  value={dob?.toDateString()}
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
        value={tag?.bloodtype} 
 
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
        value={tag?.organdonor} 

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
                  value={tag?.address}
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
                  value={tag?.allergies}
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
                  value={tag?.medications}
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
                  value={tag?.emergencycontacts}
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
                  value={tag?.otherinfo}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                  
              </div>
            </div>
           

            
            

      
          </div>
        </div>
      </div>
    </div>
        </main>
        <Notification
        type={dialogType}
        show={show}
        close={close}
        title={notificationTitle}
        description={notificationDescription}
      />
 <Footer />
    </div>
  )
}
