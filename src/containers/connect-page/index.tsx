import './index.scss';
import Peer from 'peerjs';
import QRCode from 'qrcode';
import { useState } from 'react';
import Card from '../../components/card';
import SnackBar from '../../components/snackBar';
import { motion } from 'framer-motion';
import { DuplicateIcon, LinkIcon } from '@heroicons/react/outline';
import CopyToClipboardBox from '../../components/copyToClipboard';
import Button from '@material-ui/core/Button';
import { config } from '../../common/config';
import {
  generateRandomPeerId,
  getDefaultCameraDeviceId,
  // toggleTrack,
} from '../../common/utils';
import { useHistory } from 'react-router-dom';
import CallPage from '../callPage';
import Header from '../../components/header';

function ConnectPage() {
  const [qrCodeLoading, setQrCodeLoading] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [peerId, setPeerId] = useState('');
  const [otherPeerID, serOtherPeerID] = useState('');
  const [nickName, setNickName] = useState('');
  const [peerName, setPeerName] = useState('');
  const [snackBarState, setSnackBarState] = useState(false);
  const [connection, setConnection] = useState(null);
  const [inviteOn, setInviteOn] = useState(false);
  const [remoteStream, setRemoteStream] = useState(null);
  const [myStream, setMyStream]: any = useState(null);
  const [call, setCall]: any = useState(null);

  const [receivingCallConnectedState, setReceivingCallConnectedState] =
    useState(false);

  const history = useHistory();

  function startRTC() {
    return new Promise((resolve, reject) => {
      const peerId = generateRandomPeerId(nickName);
      setPeerId(peerId);
      const peer = new Peer(peerId, {
        config: config,
        secure: true,
        ...(process.env.REACT_APP_PEERJS_SERVER_DOMAIN && {
          host: process.env.REACT_APP_PEERJS_SERVER_DOMAIN,
        }),
        port: 443,
      });

      setQrCodeLoading(true);

      peer.on('open', function (id: any) {
        resolve(peer);
        QRCode.toDataURL(
          process.env.REACT_APP_URL + '/connect/call/' + peerId,
          { width: 148 }
        )
          .then((url) => {
            setQrImageUrl(url);

            setQrCodeLoading(false);
            setInviteOn(true);
          })
          .catch((err) => {
            console.error(err);
          });
      });

      answerPeer(peer);
    });
  }

  async function answerPeer(peer: any) {
    peer.on('connection', (conn: any) => {
      setConnection(conn);
      serOtherPeerID(conn?.peer);
      conn.on('data', (data: any) => {
        setPeerName(data.name);
        peer.on('call', async (call: any) => {
          setSnackBarState(true);
          setCall(call);
        });
      });
      conn.on('close', function () {
        // console.log('close');
        peer.disconnect();
        window.open('/', '_self');
      });
    });
  }

  async function answerCall(call: any) {
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
    const stream = await mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        ...(!isMobile && {
          deviceId: defaultCameraId,
        }),
      },
    });
    // const stream = await mediaDevices.getDisplayMedia({ video: true }); // for screen sharing
    // toggleTrack(stream, 'video');

    call.answer(stream); // Answer the call with an A/V stream.
    call.on('stream', (remoteStream: any) => {
      // Show stream in some <video> element.
      setRemoteStream(remoteStream);
      setMyStream(stream);
    });
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
                        onSubmit={() => {
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
                          serOtherPeerID(e?.target?.value);
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
                          answerCall(call);
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
          connection={connection}
          call={call}
        />
      )}
    </>
  );
}

export default ConnectPage;
