"use client"
import Head from 'next/head'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Image from 'next/image';

import Link from 'next/link'
export default function Home() {
  return (
    <>
      <Head>
      <meta charSet="UTF-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css?family=Fira+Sans&display=swap" rel="stylesheet"/>   
     <title>ICE Alerts - Smart Medical Tags</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-black"
       
     >
         <Header/>

     <section
      id="home"
      className= " bg-[url('/images/splash.jpg')] relative z-10 overflow-hidden bg-cover bg-top bg-no-repeat pt-[150px] pb-24"
          >
      <div
        className="grade absolute left-0 top-0 -z-10 h-full w-full"
       
        
      ></div>      
      <div
        className="absolute left-0 top-0 -z-10 h-full w-full"
      
      ></div>
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 lg:w-1/2">
            <div className="mb-12 max-w-[570px] lg:mb-0">
              <h1
                className="mb-4 text-[40px] font-bold leading-tight text-white md:text-[50px] lg:text-[40px] xl:text-[46px] 2xl:text-[50px] sm:text-[46px]"
              >
               
               ICE Smart Medical Tags
                             </h1>
              <p
                className="mb-8 text-lg font-medium leading-relaxed text-body-color md:pr-14"
              >
           ICE Alerts is a remarkable DApp designed to empower users in creating smart medical tags on the blockchain. This innovative platform leverages the decentralized nature of blockchain technology, enabling individuals to securely store and manage their vital medical information, emergency contacts, and critical health details. By doing so, ICE Alerts not only ensures the privacy and integrity of this crucial data but also provides an accessible and reliable solution for generating life-saving smart medical tags. Whether for individuals with medical conditions, allergies, or simply a desire for preparedness, ICE Alerts exemplifies the transformative potential of DApps in delivering essential services with transparency, security, and trust.     </p>
         <div className="flex flex-wrap items-center">
                <Link
                  href="/viewtag"
                  className="mr-5 mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary py-3 px-7 text-base font-semibold text-white transition-all hover:bg-opacity-90"
                >
                  View Tag
                </Link>
                <Link
                  href="/about"
                  className="mb-5 inline-flex items-center justify-center rounded-md border-2 border-white py-3 px-7 text-base font-semibold text-white transition-all hover:border-primary hover:bg-primary"
                >
                  About
                </Link>
              </div>
            </div>
          </div>

          <div className="w-full px-4 lg:w-1/2">
          <Image
        src="/images/ICE1.png" // Path to the image from the `public` directory
        alt="Image 1"
        width={400} // Set the width
        height={300} // Set the height
        style={{ opacity: 0.6 }} // Set the opacity value (0.0 to 1.0)

      />
            <div className="text-center">
         <div id="logo" className='mt-4'>Smart Medical<div id="flight"> Tags</div></div>
   

            </div>
          </div>
        </div>
      </div>

      
    </section>
    <Footer />
     </main>
     </>
  )
}
