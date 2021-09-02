import './index.scss';
import Peer from 'simple-peer';
import QRCode from 'qrcode';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import Card from '../../components/card';
import SnackBar from '../../components/snackBar';
import { motion } from 'framer-motion';
import { DuplicateIcon, LinkIcon } from '@heroicons/react/outline';
import CopyToClipboardBox from '../../components/copyToClipboard';
import Button from '@material-ui/core/Button';
import { config } from '../../common/config';
import {
  getDefaultCameraDeviceId,
  stringToKebabCase,
} from '../../common/utils';
import { useHistory } from 'react-router-dom';
import CallPage from '../callPage';
import Header from '../../components/header';

function ConnectPage() {
  const [qrCodeLoading, setQrCodeLoading] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [peerId, setPeerId] = useState('');
  const [otherPeerID, setOtherPeerID] = useState('');
  const [nickName, setNickName] = useState('');
  const [socketId, setSocketId] = useState('');
  const [peerName, setPeerName] = useState('');
  const [snackBarState, setSnackBarState] = useState(false);
  const [inviteOn, setInviteOn] = useState(false);
  const [remoteStream, setRemoteStream] = useState(null);
  const [myStream, setMyStream]: any = useState(null);
  const [callerSocketId, setCallerSocketId] = useState('');
  const [callerPeerSignal, setCallerPeerSignal]: any = useState();
  const [myPeerSignal, setMyPeerSignal]: any = useState();
  const [myPeer, setMyPeer]: any = useState();

  const [receivingCallConnectedState, setReceivingCallConnectedState] =
    useState(false);

  const history = useHistory();
  const [socket, setSocket]: any = useState(null);

  useEffect(() => {
    socket?.on('yourID', (id: string) => {
      setSocketId(id);
      setPeerId(stringToKebabCase(nickName) + '_' + id);
    });

    socket?.on('hey', (data: any) => {
      console.log('hey called', data);
      setCallerSocketId(data.from);
      setCallerPeerSignal(data.signal);
      setPeerName(data.name);
      setSnackBarState(true);
    });
  }, [socket, nickName]);

  function startRTC() {
    return new Promise((resolve, reject) => {
      const socket = io(process.env.REACT_APP_PEERIVATE_SERVER_DOMAIN!);
      setSocket(socket);
      const peer = new Peer({
        initiator: false,
        config: config,
        trickle: false,
      });
      setMyPeer(peer);
      setQrCodeLoading(true);

      QRCode.toDataURL(process.env.REACT_APP_URL + '/connect/call/' + peerId, {
        width: 148,
      })
        .then((url) => {
          setQrImageUrl(url);
          setQrCodeLoading(false);
          setInviteOn(true);
        })
        .catch((err) => {
          console.error(err);
        });

      peer.on('stream', (stream: any) => {
        console.log('onstream');
        setRemoteStream(stream);
      });

      resolve(peer);
    });
  }

  async function answerCall() {
    myPeer.on('signal', (data: any) => {
      console.log('onsignal');
      socket.emit('acceptCall', { signal: data, to: callerSocketId });
    });
    myPeer.signal(callerPeerSignal);

    const defaultCameraId = await getDefaultCameraDeviceId();
    let isMobile = false;
    if (
      /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      isMobile = true;
    }
    const mediaDevices = navigator.mediaDevices as any;
    const myStream = await mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        ...(!isMobile && {
          deviceId: defaultCameraId,
        }),
      },
    });
    // setMyStream(myStream);
    setTimeout(() => {
      myPeer.addStream(myStream);
    }, 4000);
  }

  return (
    <>
      {!receivingCallConnectedState ? (
        <div>
          <Header />
          <div className='connectPageMain'>
            <div className='cards flex flex-col m-auto sm:flex-row'>
              <Card
                loading={qrCodeLoading}
                content={
                  inviteOn ? (
                    <motion.div
                      animate={{ scale: 1 }}
                      initial={{ scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className='qrCode-container'>
                        <img
                          alt='qr code'
                          width='148'
                          height='148'
                          src={qrImageUrl}
                        ></img>{' '}
                      </div>
                      <CopyToClipboardBox
                        icon={LinkIcon}
                        text={'Copy Link'}
                        copy={
                          process.env.REACT_APP_URL + '/connect/call/' + peerId
                        }
                      />
                      <CopyToClipboardBox
                        style={{ marginTop: '1em' }}
                        icon={DuplicateIcon}
                        iconStyle={{
                          right: '-0.38em',
                        }}
                        text={'Copy ID'}
                        copy={peerId}
                      />
                    </motion.div>
                  ) : (
                    <div>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          startRTC();
                        }}
                      >
                        <input
                          type='text'
                          className='mt-10 rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                          name='nickName'
                          onChange={(e) => {
                            setNickName(e?.target?.value);
                          }}
                          placeholder='Your name'
                          required
                          autoComplete='off'
                          autoCapitalize='on'
                          maxLength={30}
                        />
                        <div className='text-center'>
                          <button
                            type='submit'
                            className='py-3 px-6 w-40 mt-10 bg-blue-600 hover:bg-green-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-full'
                          >
                            Next
                          </button>
                        </div>
                      </form>
                    </div>
                  )
                }
                heading='Invite others'
                animateFrom='-100em'
                animateTo='0em'
                style={{
                  height: '20em',
                  margin: '1em auto',
                }}
              ></Card>

              <Card
                loading={false}
                content={
                  <div className=' relative mt-6 text-center'>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        // callPeer(otherPeerID);
                        history.push({
                          pathname: '/connect/call/' + otherPeerID,
                          state: {
                            name: nickName,
                            mode: 'caller',
                          },
                        });
                      }}
                    >
                      <input
                        type='text'
                        className='mt-5 rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                        name='meetingId'
                        onChange={(e) => {
                          setOtherPeerID(e?.target?.value);
                        }}
                        placeholder='Peer ID'
                        autoComplete='off'
                        required
                      />

                      <input
                        type='text'
                        className='mt-5 rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                        name='nickName'
                        onChange={(e) => {
                          setNickName(e?.target?.value);
                        }}
                        placeholder='Your name'
                        autoComplete='off'
                        autoCapitalize='on'
                        maxLength={30}
                        required
                      />

                      <button
                        type='submit'
                        className='py-3 px-6 w-40 mt-10 bg-green-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-full'
                      >
                        Call
                      </button>
                    </form>
                  </div>
                }
                heading='Call a Peer'
                animateFrom='100em'
                animateTo='0em'
                style={{
                  height: '20em',
                  margin: '1em auto',
                }}
              ></Card>
            </div>
            <SnackBar
              open={snackBarState}
              // duration={snackBarDuration}
              content={
                <div>
                  <div className='text-lg'>
                    {peerName || 'Someone'} is calling you..
                  </div>{' '}
                  <br />
                  <div className='flex'>
                    <div className='mr-10 ml-7'>
                      <Button
                        onClick={() => {
                          setSnackBarState(false);
                          answerCall();
                          setReceivingCallConnectedState(true);
                        }}
                        variant='contained'
                        color='primary'
                        style={{
                          borderRadius: '20px',
                          backgroundColor: '#2f8a30',
                          textTransform: 'none',
                        }}
                      >
                        Accept
                      </Button>
                    </div>
                    <div>
                      <Button
                        onClick={() => {
                          // (connection as any).close();
                          setSnackBarState(false);
                        }}
                        variant='contained'
                        color='secondary'
                        style={{
                          borderRadius: '20px',
                          backgroundColor: '#e03232',
                          textTransform: 'none',
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              }
            />
          </div>
        </div>
      ) : (
        <CallPage
          pickCall={true}
          pickedCallDetails={{
            peerName: peerName,
          }}
          remoteStream={remoteStream}
          myStream={myStream}
        />
      )}
    </>
  );
}

export default ConnectPage;
