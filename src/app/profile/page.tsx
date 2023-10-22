
'use client'
import { Fragment, useState,useEffect,useRef } from 'react'
import { Dialog, Tab, Transition } from '@headlessui/react'
import {XMarkIcon} from '@heroicons/react/24/outline'

import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Chat from '@/components/Chat/Chat'

import { useAccountAbstraction } from "../../context/accountContext";

import lit from "@/lit/lit"

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useFormik } from 'formik';
import * as Yup from 'yup' 
import { queryTagByOwner,queryEmergencyContacts } from '@/tableland/tableland'
import { Web3Storage, File } from "web3.storage";
import Notification from '@/components/Notification/Notification'
import VideoCall from '@/components/VideoCall/VideoCall'
import { ethers } from 'ethers'
import { iceContractABI,iceContractAddress } from '@/contracts/contracts' 
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  




  
export default function ViewTag() {
    const [open, setOpen] = useState(false)
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const [contacts,setContacts] = useState([])
    const [preview, setPreview] = useState('')
    const [selectedFile, setSelectedFile] = useState(undefined)
    const [dob, setDOB] = useState(new Date());
    const [tagFound,setTagFound] = useState(false)
    const [tagQueried,setTagQueried] = useState(false)
    const [tag,setTag] = useState()
    const filename = useRef()

      // NOTIFICATIONS functions
    const [notificationTitle, setNotificationTitle] = useState();
    const [notificationDescription, setNotificationDescription] = useState();
    const [dialogType, setDialogType] = useState(1);
    const [show, setShow] = useState(false);
    const close = async () => {
  setShow(false);
};

    const [storage] = useState(
      new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY })
    );
   const formik = useFormik({    enableReinitialize: true,
    initialValues:{firstname:tag?.firstname,lastname:tag?.lastname,bloodtype:tag?.bloodtype,address:tag?.address,allergies:tag?.allergies,emergencycontacts:tag?.emergencycontacts,otherinfo:tag?.otherinfo,dob:dob}
    ,validationSchema: Yup.object().shape({
      firstname:Yup.string().required("First name is required"),
      lastname:Yup.string().required("Last name is required"),
      address:Yup.string().required("Address is required"),
      dob:Yup.date()
      .transform(function (value, originalValue) {
        if (this.isType(value)) {
          return value;
        }
        const result = parse(originalValue, "dd.MM.yyyy", new Date());
        return result;
      })
      .typeError("please enter a valid date")
      .required(),
      bloodtype:Yup.string().required("Blood type is required"),

      allergies:Yup.string().required("Allergies is required"),
      emergencycontacts:Yup.string().required("Emergency contacts are required"),
      otherinfo:Yup.string().required("Other Info is required")
  
     
  }), onSubmit: async (values) => {
   
   if((!selectedFile && !tag?.cid)  || !tagQueried)
     return

     if(tagQueried && !tagFound)
     {
      setNotificationTitle("Save Profile")
      setNotificationDescription("You must first register a tag with your mobile device")
      setDialogType(2) //Error
      setShow(true)
      return
     }
    let cid = tag?.cid
    if(!cid || selectedFile)
    {
      cid = await storage.put([new File([selectedFile],filename.current)]);
    
      values.cid = cid
      values.image = filename.current
      
    }
    else
    { 
      values.cid = cid
      values.image =  tag.image
      
    }
    //console.log(values)
    
    const encryptedData = await lit.encryptString(JSON.stringify(values))
    console.log(encryptedData)

   
    const data = {data:encryptedData.ciphertext,hash:encryptedData.dataToEncryptHash}
    const dataCID = await storage.put([
      new File([JSON.stringify(data)], "metadata.json"),
    ]);

    //Do Smart Contract Calls here
    updateCID(dataCID)
    

  },

      

   })


  async function updateCID(cid:any){

    setNotificationTitle("Save Profile")
      setNotificationDescription("Updating ICE Profile")
      setDialogType(3) //Error
      setShow(true)
    const contract = new ethers.Contract(
      iceContractAddress,
      iceContractABI,
      web3Provider?.getSigner()
    );

    try {
      let tx1 = await contract.callStatic.updateTagCID(
       cid
      );

       let tx2 = await contract.updateTagCID(
        cid
       );
      await tx2.wait();

      setDialogType(1); //Success
      setNotificationTitle("Save Profile");
      setNotificationDescription("Profile updated successfully.");
      setShow(true);
      
    } catch (error) 
    {
      if (error.code === "TRANSACTION_REVERTED") {
        console.log("Transaction reverted");
        // let revertReason = ethers.utils.parseRevertReason(error.data);
        setNotificationDescription("Reverted");
      } else if (error.code === "ACTION_REJECTED") {
        setNotificationDescription("Transaction rejected by user");
      } else {
        console.log(error);
        //const errorMessage = ethers.utils.revert(error.reason);
        setNotificationDescription(
          `Transaction failed with error: ${error.reason}`
        );
      }
      setDialogType(2); //Error
      setNotificationTitle("Save Profile");

      setShow(true);
    }
  
  } 
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
    filename.current = e.target.files[0].name
  }

 useEffect(()=>{

  async function getEmergencyContacts()
  {
    const _contacts = await queryEmergencyContacts(ownerAddress?.toLowerCase())
    setContacts(_contacts)
    console.log(_contacts)
  }
  async function getTagInfo()
  {
       const _tag = await queryTagByOwner(ownerAddress?.toLowerCase())
       console.log(_tag)
       if(_tag.length > 0)
       {
          setTagFound(true)
          setTagQueried(true)
          
          if(_tag[0].cid !="nocid")
          {
            const res = await storage.get(_tag[0].cid)
            console.log(`Got a response! [${res.status}] ${res.statusText}`)
            if (!res.ok) {
              setNotificationTitle("Profile")
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
          
       }

       else
       {
        console.log("not found")
         setTagQueried(true)
       }
  }     
  if(web3ProviderConnected)
  {
    getTagInfo()
    getEmergencyContacts()
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
                      className="cursor-pointer relative flex flex-col h-[480px] min-h-[200px] items-center justify-center rounded-lg border border-dashed border-[#A1A0AE] bg-[#353444] p-12 text-center"
                    >
                                           <img src={preview ? preview: '/images/profile.jpg'}/>
                                           {formik.touched && !selectedFile ?    <span className="text-red mt-4 font-bold ">Please select an image</span>:null}


                    </label>

</div>
{(web3ProviderConnected )&&<VideoCall address={ownerAddress}  />}

<div className="mb-8">
{web3ProviderConnected  &&   <Chat classNames="z-10" address={ownerAddress}/>}
        <div
       
          className="mb-4 text-white rounded-md bg-[#4E4C64] flex items-center justify-center rounded-md py-4 px-8 border border-dashed border-[#A1A0AE] bg-[#353444]"
        >
                   <div className=" mt-16 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className=" text-3xl font-bold tracking-tight text-white">ICE Tag ID</h1>

            <div className="mt-4 sm:col-span-3">
             
              <div className="mt-2 mb-12">
              <h1 className="text-5xl font-bold tracking-tight text-green-500">{tag?.tagid ? tag.tagid :(tagQueried ? "Not Found": "----------")}</h1>

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
          <span>{item.contact}</span>
         
        </div>
      ))}
    </div>
 
               
          </Tab.Group>
       
          {/* Product info */}
           <form onSubmit={formik.handleSubmit}>
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
                  defaultValue={tag?.firstname}
                  onChange={formik.handleChange}
                />

                  {formik.errors.firstname  && formik.touched.firstname?    <span className="text-red mt-4 font-bold ">{formik.errors.firstname}</span>:null}

                  
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
                  defaultValue={tag?.lastname}
                  onChange={formik.handleChange}
                />
                  {formik.errors.lastname && formik.touched.lastname ?    <span className="text-red mt-4 font-bold ">{formik.errors.lastname}</span>:null}
                  
              </div>
            </div>
            <div className="mt-4 sm:col-span-3">
              <label htmlFor="country" className="block text-sm font-medium leading-6 text-white">
                Date of Birth
              </label>
              <div className="mt-2">
              <DatePicker selected={dob}  onChange={(value)=>setDOB(value)} />
  
              </div>
              {formik.errors.dob && formik.touched.dob ?    <span className="text-red mt-4 font-bold ">{formik.errors.dob}</span>:null}

            </div>

            <div className="mt-4 sm:col-span-3">
            <label htmlFor="bloodtype"  className="block text-sm font-medium leading-6 text-white">Blood Type:</label>

              <div className="mt-2">
      <select
        id="bloodtype"
        value={tag?.bloodtype} 
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
        onChange={formik.handleChange}
      >
        <option value="">Select a blood type</option>
        {bloodTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select> 
      {formik.errors.bloodtype && formik.touched.bloodtype ?    <span className="text-red mt-4 font-bold ">{formik.errors.bloodtype}</span>:null}
          
              </div>
            </div>

            <div className="mt-4 sm:col-span-3">
            <label htmlFor="organdonor"  className="block text-sm font-medium leading-6 text-white">Organ Donor:</label>

              <div className="mt-2">
      <select
        id="organdonor"
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
        value={tag?.organdonor} 
      >
        <option value="No">No</option>
        <option value="Yes">Yes</option>

       
      </select> 
              </div>
            </div>

            <div className="mt-4 sm:col-span-3">
              <label htmlFor="address" className="block text-sm font-medium leading-6 text-white">
                Address
              </label>
              <div className="mt-2">
              <textarea
                  id="address"
                  name="address"
                  rows={5}
                  defaultValue={tag?.address}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={formik.handleChange}
                />
                  
              </div>
              {formik.errors.address && formik.touched.address ?    <span className="text-red mt-4 font-bold ">{formik.errors.address}</span>:null}

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
                  defaultValue={tag?.allergies}

                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={formik.handleChange}
                />
                  
              </div>
              {formik.errors.allergies && formik.touched.allergies ?    <span className="text-red mt-4 font-bold ">{formik.errors.allergies}</span>:null}

            </div>

            <div className="mt-4 sm:col-span-3">
              <label htmlFor="about" className="block text-sm font-medium leading-6 text-white">
                Medications
              </label>
              <div className="mt-2">
              <textarea
                  id="medications"
                  name="medications"
                  defaultValue={tag?.medications}   
                  rows={10}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={formik.handleChange}
                />
                  
              </div>
              {formik.errors.medications && formik.touched.medications ?    <span className="text-red mt-4 font-bold ">{formik.errors.medications}</span>:null}

            </div>
           
            <div className="mt-4 sm:col-span-3">
              <label htmlFor="emergencycontacts" className="block text-sm font-medium leading-6 text-white">
                Emergency Contacts
              </label>
              <div className="mt-2">
              <textarea
                  id="emergencycontacts"
                  name="emergencycontacts"
                  rows={10}
                  defaultValue={tag?.emergencycontacts}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={formik.handleChange}
                />
                  
              </div>
              {formik.errors.emergencycontacts && formik.touched.emergencycontacts ?    <span className="text-red mt-4 font-bold ">{formik.errors.emergencycontacts}</span>:null}

            </div>
           
            <div className="mt-4 sm:col-span-3">
              <label htmlFor="other" className="block text-sm font-medium leading-6 text-white">
                Other Information
              </label>
              <div className="mt-2">
              <textarea
                  id="otherinfo"
                  name="otherinfo"
                 defaultValue={tag?.otherinfo} 
                  rows={10}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={formik.handleChange}
                />
                  
              </div>
              {formik.errors.otherinfo && formik.touched.otherinfo ?    <span className="text-red mt-4 font-bold ">{formik.errors.otherinfo}</span>:null}

            </div>
           
            
            <div className="sm:flex-col1 mt-10 flex">
               
               <button
                                   
                 type="submit"
                 className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
               >
                 Save Tag
               </button>

             </div>
       


      
          </div>
          </form>

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
