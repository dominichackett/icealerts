import { useAccountAbstraction } from "../../context/accountContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faVideo, faPhone, faPhoneAlt, faVideoSlash, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import Head from 'next/head';

import * as PushAPI from '@pushprotocol/restapi';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';
import { produce } from 'immer';
import styled from 'styled-components';

import { usePushSocket } from '../../hooks/usePushSockets';
import { useEffect, useRef, useState } from 'react';
import VideoPlayer from './VideoPlayer';
import { ADDITIONAL_META_TYPE } from '@pushprotocol/restapi/src/lib/payloads/constants';

interface VideoCallMetaDataType {
  recipientAddress: string;
  senderAddress: string;
  chatId: string;
  signalData?: any;
  status: number;
}

// env which will be used for the video call
const env = ENV.DEV;
export default function VideoCall(props){
    const [se,setPvtKey]  = useState()
    const [account,setAccount] = useState()
    const [signer,setSigner] = useState()
    const [isMicMuted, setMicMuted] = useState(false);
    const [isCameraOff, setCameraOff] = useState(false);
    const [currentCall,setCurrentCall] = useState()
    const [incomingCall,setIncomingCall] = useState() 
     const { pushSocket, isPushSocketConnected, latestFeedItem } = usePushSocket({
        env,chain:5,address:props.address
      });
    
      const videoObjectRef = useRef<PushAPI.video.Video>();
      const recipientAddressRef = useRef<HTMLInputElement>(null);
    
      const [data, setData] = useState<PushAPI.VideoCallData>(
        PushAPI.video.initVideoCallData
      );
    



    const {
        isEditingEnabled,
        isAuthenticated,
        ownerAddress,
        chainId,
        web3Provider,
        loginWeb3Auth,
        web3ProviderConnected,
    
        // ...other context values and functions you need
      } = useAccountAbstraction();
     
    useEffect(()=>{
     async function setup()
     {
           setAccount(`eip155:${ownerAddress}`);
           setSigner( web3Provider?.getSigner()) 
           console.log( web3Provider?.getSigner())
    
     }  
     if(web3ProviderConnected)
       setup()
      else
      console.log("Web 3")
   },[web3ProviderConnected])

   useEffect(() => {
    loginWeb3Auth();
  }, []);

  const toggleMic = () => {
    setMicMuted(!isMicMuted);
    videoObjectRef.current?.enableAudio({
        state: !data.local.audio,
      })
  };

  const toggleCamera = () => {
    setCameraOff(!isCameraOff);
    videoObjectRef.current?.enableVideo({
        state: !data.local.video,
      })
  };
  const setRequestVideoCall = async () => {
    // fetching chatId between the local address and the remote address
    const user = await PushAPI.user.get({
      account: props.address!,
      env,
    });
    let pgpPrivateKey = null;
    if (user?.encryptedPrivateKey) {
      pgpPrivateKey = await PushAPI.chat.decryptPGPKey({
        encryptedPGPPrivateKey: user.encryptedPrivateKey,
        account: props.address,
        signer,
        env,
      });
    }
    const response = await PushAPI.chat.chats({
      account: props.address!,
      toDecrypt: true,
      pgpPrivateKey: pgpPrivateKey,
      env,
    });

    let chatId = '';
    response.forEach((chat) => {
      if (chat.did === 'eip155:' +props.addressTocall) {
        chatId = chat.chatId!;
      }
    });

    if (!chatId) return;

    // update the video call 'data' state with the outgoing call data
    videoObjectRef.current?.setData((oldData) => {
      return produce(oldData, (draft: any) => {
        if (!props.addressTocall) return;

        draft.local.address = props.address;
        draft.incoming[0].address = props.addressTocall;
        draft.incoming[0].status = PushAPI.VideoCallStatus.INITIALIZED;
        draft.meta.chatId = chatId;
      });
    });

    // start the local media stream
    await videoObjectRef.current?.create({ video: true, audio: true });
  };


  const setIncomingVideoCall = async (
    videoCallMetaData: VideoCallMetaDataType
  ) => {
    // update the video call 'data' state with the incoming call data
    videoObjectRef.current?.setData((oldData) => {
      return produce(oldData, (draft) => {
        draft.local.address = videoCallMetaData.recipientAddress;
        draft.incoming[0].address = videoCallMetaData.senderAddress;
        draft.incoming[0].status = PushAPI.VideoCallStatus.RECEIVED;
        draft.meta.chatId = videoCallMetaData.chatId;
        draft.meta.initiator.address = videoCallMetaData.senderAddress;
        draft.meta.initiator.signal = videoCallMetaData.signalData;
      });
    });

    // start the local media stream
    await videoObjectRef.current?.create({ video: true, audio: true });
  };
  const acceptVideoCallRequest = async () => {
    if (!data.local.stream) return;

    await videoObjectRef.current?.acceptRequest({
      signalData: data.meta.initiator.signal,
      senderAddress: data.local.address,
      recipientAddress: data.incoming[0].address,
      chatId: data.meta.chatId,
    });
  };

  const connectHandler = ({
    signalData,
    senderAddress,
  }: VideoCallMetaDataType) => {
    videoObjectRef.current?.connect({
      signalData,
      peerAddress: senderAddress,
    });
  };

    // initialize video call object
    useEffect(() => {
        if (!signer || !props.address) return;
    
        (async () => {
          const user = await PushAPI.user.get({
            account: props.address,
            env,
          });
          let pgpPrivateKey = null;
          if (user?.encryptedPrivateKey) {
            pgpPrivateKey = await PushAPI.chat.decryptPGPKey({
              encryptedPGPPrivateKey: user.encryptedPrivateKey,
              account: props.address,
              signer,
              env,
            });
          }
    
          videoObjectRef.current = new PushAPI.video.Video({
            signer,
            chainId: 5,
            pgpPrivateKey,
            env,
            setData,
          });
        })();
      }, [signer, props.address]);

        // after setRequestVideoCall, if local stream is ready, we can fire the request()
  useEffect(() => {
    (async () => {
      const currentStatus = data.incoming[0].status;

      if (
        data.local.stream &&
        currentStatus === PushAPI.VideoCallStatus.INITIALIZED
      ) {
        await videoObjectRef.current?.request({
          senderAddress: data.local.address,
          recipientAddress: data.incoming[0].address,
          chatId: data.meta.chatId,
        });
      }
    })();
  }, [data.incoming, data.local.address, data.local.stream, data.meta.chatId]);

  // establish socket connection
  useEffect(() => {
    if (!pushSocket?.connected) {
      pushSocket?.connect();
    }
  }, [pushSocket]);
  // receive video call notifications
  useEffect(() => {
    if (!isPushSocketConnected || !latestFeedItem) return;

    const { payload } = latestFeedItem || {};

    // check for additionalMeta
    if (
      !Object.prototype.hasOwnProperty.call(payload, 'data') ||
      !Object.prototype.hasOwnProperty.call(payload['data'], 'additionalMeta')
    )
      return;

    const additionalMeta = payload['data']['additionalMeta'];
    console.log('RECEIVED ADDITIONAL META', additionalMeta);
    if (!additionalMeta) return;

    // check for PUSH_VIDEO
    if (additionalMeta.type !== `${ADDITIONAL_META_TYPE.PUSH_VIDEO}+1`) return;
    const videoCallMetaData = JSON.parse(additionalMeta.data);
    console.log('RECIEVED VIDEO DATA', videoCallMetaData);

    if (videoCallMetaData.status === PushAPI.VideoCallStatus.INITIALIZED) {
      setIncomingVideoCall(videoCallMetaData);
    } else if (
      videoCallMetaData.status === PushAPI.VideoCallStatus.RECEIVED ||
      videoCallMetaData.status === PushAPI.VideoCallStatus.RETRY_RECEIVED
    ) {
      connectHandler(videoCallMetaData);
    } else if (
      videoCallMetaData.status === PushAPI.VideoCallStatus.DISCONNECTED
    ) {
      window.location.reload();
    } else if (
      videoCallMetaData.status === PushAPI.VideoCallStatus.RETRY_INITIALIZED &&
      videoObjectRef.current?.isInitiator()
    ) {
      videoObjectRef.current?.request({
        senderAddress: data.local.address,
        recipientAddress: data.incoming[0].address,
        chatId: data.meta.chatId,
        retry: true,
      });
    } else if (
      videoCallMetaData.status === PushAPI.VideoCallStatus.RETRY_INITIALIZED &&
      !videoObjectRef.current?.isInitiator()
    ) {
      videoObjectRef.current?.acceptRequest({
        signalData: videoCallMetaData.signalingData,
        senderAddress: data.local.address,
        recipientAddress: data.incoming[0].address,
        chatId: data.meta.chatId,
        retry: true,
      });
    }
  }, [latestFeedItem]);

   return (
    web3Provider ? (
        <div className="mb-8 relative">
        <label
          htmlFor="file"
          className="cursor-pointer relative flex flex-col h-[500px] min-h-[200px] items-center justify-center rounded-lg border border-dashed border-[#A1A0AE] bg-[#353444] p-12 text-center"
        >
                        <h1 className="mb-10 text-3xl font-bold tracking-tight text-white">Incoming Call</h1>

          <div className="mb-4">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <div >
                  <VideoPlayer  stream={data.local.stream} isMuted={true}/>
                  <div className="mt-2 text-center text-white">You</div>
                </div>
              </div>
              <div className="w-1/2">
                <div >
                  <VideoPlayer stream={data.incoming[0].stream} isMuted={false} />
                  <div className="mt-2 text-center text-white">{props?.personTocall ? props.personTocall: "Other Caller"}</div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="flex justify-center mt-12">
            <button className={`mr-2 text-white ${isMicMuted ? 'text-red-500' : ''}`} onClick={toggleMic}   disabled={
                data.incoming[0].status ===
                PushAPI.VideoCallStatus.UNINITIALIZED
              }>
              <FontAwesomeIcon icon={isMicMuted ? faMicrophoneSlash : faMicrophone} size="1x" color={isMicMuted ? "red":"white"} /> {isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
            </button>
            <button className={`mr-2 text-white ${isCameraOff ? 'text-red-500' : ''}`} onClick={toggleCamera}  disabled={
                data.incoming[0].status ===
                PushAPI.VideoCallStatus.UNINITIALIZED
              }>
              <FontAwesomeIcon icon={isCameraOff ? faVideoSlash : faVideo} size="1x" color={isCameraOff ? "red":"white"} /> {isCameraOff ? 'Turn On Camera' : 'Turn Off Camera'}
            </button>
           {data.incoming[0].status ===
                PushAPI.VideoCallStatus.CONNECTED && <button className="mr-2 text-red"
                onClick={() =>
                    videoObjectRef.current?.disconnect({
                      peerAddress: data.incoming[0].address,
                    })
                  }>
              <FontAwesomeIcon icon={faPhone} size="1x" color="red" /> Hangup
            </button>}
            {(!props.caller && data.incoming[0].status !==
                PushAPI.VideoCallStatus.RECEIVED) && <button className="mr-2 text-green" onClick={acceptVideoCallRequest}>
              <FontAwesomeIcon icon={faPhoneAlt} size="1x" color="green" /> Answer
            </button> }

            {(props.caller && data.incoming[0].status !==
                PushAPI.VideoCallStatus.INITIALIZED) && <button className="mr-2 text-green" onClick={setRequestVideoCall}>
              <FontAwesomeIcon icon={faPhoneAlt} size="1x" color="green" /> Call
            </button> }

          </div>
        </label>
      </div>
      
      
    ) : null
  );
}   
