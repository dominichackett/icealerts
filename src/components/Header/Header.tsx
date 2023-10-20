'use client'
//Changed header to header
import { useState ,useEffect,useRef,useContext} from 'react'
import chains from "@/chains/chains";
import { useAccountAbstraction } from "../../context/accountContext";


  import { useRouter } from 'next/navigation'

import Link from 'next/link';

  export default function Header(){
    const [navbarOpen,setNavbarOpen] = useState(false)
    const [submenuOpen,setSubmenuOpen] = useState(false)
    const [scrolledFromTop,setScrolledFromTop] = useState(true)
    const [isClient, setIsClient] = useState(false)

   const session = true
   const status = false    
    const router  = useRouter()
    const aCode = useRef()
    const {
        ownerAddress,
        safes,
        chainId,
        isAuthenticated,
        web3Provider,
        loginWeb3Auth,
        logoutWeb3Auth,
        setChainId,
        // ...other context values and functions you need
      } = useAccountAbstraction();
    
      const [selectedChain, setSelectedChain] = useState(-1);
   
   
    useEffect(()=>{
    //  if(!isAuthenticated && (router.pathname !="/" && router.pathname !="/support"  && router.pathname !="/viewtag" ))
      //  router.push("/")
    },[isAuthenticated])

    const handleChange = (event) => {
        const selectedChainIndex = parseInt(event.target.value); // Convert value to integer
        setSelectedChain(selectedChainIndex); // Update the selected value
      };
    
      const signIn = async () => {
        if (selectedChain == -1) return;
        setChainId(selectedChain);
        loginWeb3Auth();
      };
    
      const signOut = async () => {
        logoutWeb3Auth();
      };
    
      const handleClick = () => {
        if (ownerAddress) {
          // Copy the ownerAddress to the clipboard
          navigator.clipboard.writeText(ownerAddress);
        }
      };
    
      useEffect(() => {
        setSelectedChain(chainId);
      }, [chainId]);
 
      useEffect(() => {
        setIsClient(true)
      }, [])
    return( (isClient ?<header
        className={`${scrolledFromTop ? 'z-50 bg-dark bg-opacity-70 shadow-sticky backdrop-blur-sm' : ' z-50'} header top-0 left-0 flex w-full items-center bg-transparent transition fixed`}
      
      
          >
             <div className="container">
              <div
                className="relative mx-[-16px] flex items-center justify-between"
              >
               <div className=" max-w-full px-4">
               <div className="flex items-center">

            {/*<Logo/>*/}
              </div>
                </div>
                <div>
                    <button
                    
                      onClick={()=> setNavbarOpen(!navbarOpen)}
                      id="navbarToggler"
                      name="navbarToggler"
                      aria-label="navbarToggler"
                      className={` ${navbarOpen ? "navbarTogglerActive" : ""} absolute right-4 top-1/2 block translate-y-[-50%] rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden`}
                    >
                      <span
                        className={`${navbarOpen ?   "transform rotate-45 top-[7px]": ""} relative my-[6px] block h-[2px] w-[30px] bg-white`}
                        
                      ></span>
                      <span
                        className={` ${navbarOpen ? 'opacity-0' : ""} relative my-[6px] block h-[2px] w-[30px] bg-white`}
                        
                      ></span>
                      <span
                        className={` ${navbarOpen ? 'top-[-8px] rotate-[135deg]' : ""} relative my-[6px] block h-[2px] w-[30px] bg-white`}
                        
                      ></span>
                    </button>
                    <nav
                      className={` ${!navbarOpen ? 'hidden' :""} absolute right-4 top-full w-full max-w-[250px] rounded-lg bg-bg-color shadow-lg lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent py-3 lg:py-0 lg:px-4 lg:shadow-none xl:px-6`}
                      id="navbarCollapse"
                      
                    >
                      <ul className="blcok lg:flex">
                        <li className="group relative">
                          <Link
                            href="/"
                            className="mx-8 flex py-2 text-base font-semibold text-white group-hover:text-white lg:mr-0 lg:inline-flex lg:py-6 lg:px-0"
                          >
                            Home
                          </Link>
                        </li>
                           <li className="group relative">
                          <Link
                            href="/viewtag"
                            className="mx-8 flex py-2 text-base font-semibold text-[#bababa] group-hover:text-white lg:mr-0 lg:ml-8 lg:inline-flex lg:py-6 lg:px-0 xl:ml-12"
                          >
                           View Tag
                          </Link>
                        </li>

                       
      
                       { isAuthenticated  &&<li className="group submenu-item relative">
                          <Link
                            href="javascript:void(0)"
                            onClick={()=> setSubmenuOpen(!submenuOpen)}
                            className="relative mx-8 flex py-2 text-base font-semibold text-[#bababa] after:absolute after:right-1 after:top-1/2 after:mt-[-2px] after:h-2 after:w-2 after:translate-y-[-50%] after:rotate-45 after:border-b-2 after:border-r-2 after:border-current group-hover:text-white lg:mr-0 lg:ml-8 lg:inline-flex lg:py-6 lg:pl-0 lg:pr-4 lg:after:right-0 xl:ml-12"
                          >
                            Accountt
                          </Link>
                          <div
                            className={`${submenuOpen ? 'block' : 'hidden'} submenu relative top-full left-0 w-[250px] rounded-md bg-dark p-4 transition-[top] duration-300 group-hover:opacity-100 lg:invisible lg:absolute lg:top-[110%] lg:block lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full `}
                            
                          >
                             <Link
                              href="/profile"
                              className="block rounded py-[10px] px-4 text-sm font-medium text-[#bababa] hover:text-white"
                            >
                              Profile
                            </Link>
                          
                            <Link
                              href="/applogin"
                              className="block rounded py-[10px] px-4 text-sm font-medium text-[#bababa] hover:text-white"
                            >
                              App Login
                            </Link>
                          </div>
                        </li>}

                        <li className="group relative">
                          <Link
                            href="/support"
                            className="mx-8 flex py-2 text-base font-semibold text-[#bababa] group-hover:text-white lg:mr-0 lg:ml-8 lg:inline-flex lg:py-6 lg:px-0 xl:ml-12"
                          >
                            Support
                          </Link>
                        </li>
                      
                       
                           
                    
                      
                      </ul>
                    </nav>

                  </div>
                  

                  <div
                    className="hidden justify-end pr-16 sm:flex lg:pr-0"
                  >
                    <div className="group relative hidden md:flex">
                    
                      <div
                        className="invisible absolute top-[110%] right-0 w-[250px] rounded-md bg-dark p-3 opacity-0 transition-all group-hover:visible group-hover:top-full group-hover:opacity-100"
                      >
                        <form className="flex">
                          <input
                            type="text"
                            placeholder="Search here..."
                            className="w-full bg-transparent py-2 px-4 text-white outline-none"
                          />
                          <button
                            className="text-white"
                            name="search-button"
                            aria-label="search-button"
                          >
                            <svg
                              width="26"
                              height="26"
                              viewBox="0 0 26 26"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.2917 3.25C12.1592 3.25 13.9503 3.99189 15.2709 5.31246C16.5914 6.63303 17.3333 8.4241 17.3333 10.2917C17.3333 12.0358 16.6942 13.6392 15.6433 14.8742L15.9358 15.1667H16.7917L22.2083 20.5833L20.5833 22.2083L15.1667 16.7917V15.9358L14.8742 15.6433C13.6392 16.6942 12.0358 17.3333 10.2917 17.3333C8.4241 17.3333 6.63303 16.5914 5.31246 15.2709C3.99189 13.9503 3.25 12.1592 3.25 10.2917C3.25 8.4241 3.99189 6.63303 5.31246 5.31246C6.63303 3.99189 8.4241 3.25 10.2917 3.25ZM10.2917 5.41667C7.58333 5.41667 5.41667 7.58333 5.41667 10.2917C5.41667 13 7.58333 15.1667 10.2917 15.1667C13 15.1667 15.1667 13 15.1667 10.2917C15.1667 7.58333 13 5.41667 10.2917 5.41667Z"
                                fill="currentColor"
                              />
                            </svg>
                          </button>
                        </form>
                      </div>
                    </div>
                   {/* Sign In Button*/}
                   
                  </div>       
                  <div       className="mr-16 flex py-2 
                       text-base font-semibold text-[#bababa] group-hover:text-white 
                    lg:mr-0 lg:ml-6 lg:inline-flex lg:py-6 lg:px-0 xl:ml-6"
                      > 
                     {/*   <ConnectButton  />*/} 
                     
                     <div className="flex justify-between items-center">
                <div className="space-x-4 flex-shrink-0">
                  <div className=" space-x-4">
                    <select
                      value={selectedChain}
                      className="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onChange={handleChange}
                    >
                      <option key={-1} value={-1}>
                        {" "}
                        Select Chain
                      </option>

                      {chains.map((chain, index) => (
                        <option key={index} value={index}>
                          {chain.label}
                        </option>
                      ))}
                    </select>
                    {!isAuthenticated && (
                      <button
                        onClick={signIn}
                        className="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Sign In
                      </button>
                    )}
                    {isAuthenticated && (
                      <button
                        onClick={signOut}
                        className="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Sign Out
                      </button>
                    )}{" "}
                  </div>

                 </div>
                 {ownerAddress && (
                    <div
                      onClick={handleClick}
                      className="ml-4 flex items-center bg-white rounded-xl p-2 cursor-pointer"
                    >
                      {" "}
                      {ownerAddress && (
                        <p className="font-bold text-black hover:text-red-500 ">
                          {ownerAddress.substring(0, 6)}...
                          {ownerAddress.substring(ownerAddress.length - 4)}
                        </p>
                      )}
                    </div>
                  )}
                
              </div>
                     </div>

           </div></div>  </header>:""))
}
