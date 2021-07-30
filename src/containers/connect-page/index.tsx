import './index.scss';
import Peer from 'peerjs';
import QRCode from 'qrcode';
import { RefObject, useRef, useState } from 'react';
import Card from '../../components/card';
import SnackBar from '../../components/snackBar';
import { motion } from 'framer-motion';
import { DuplicateIcon, LinkIcon } from '@heroicons/react/outline';
import CopyToClipboardBox from '../../components/copyToClipboardBox';
// import { v4 as uuidv4 } from 'uuid';
import Button from '@material-ui/core/Button';
import { config } from '../../common/config';
import { generateRandomPeerId } from '../../common/utils';
import { useHistory } from 'react-router-dom';

function ConnectPage(props: any) {
  const [qrCodeLoading, setQrCodeLoading] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [peerId, setPeerId] = useState('');
  const [otherPeerID, serOtherPeerID] = useState('');
  const [nickName, setNickName] = useState('');
  const [peerName, setPeerName] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const [snackBarState, setSnackBarState] = useState(false);
  const [call, setCall] = useState(null);
  const [, setConnection] = useState(null);
  const [inviteOn, setInviteOn] = useState(false);
  const history = useHistory();

  function startRTC(mode: string) {
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
      if (mode === 'invite') {
        setQrCodeLoading(true);
      }
      peer.on('open', function (id: any) {
        resolve(peer);
        QRCode.toDataURL(process.env.REACT_APP_URL + '/connect/call/' + peerId)
          .then((url) => {
            setQrImageUrl(url);
            if (mode === 'invite') {
              setQrCodeLoading(false);
              setInviteOn(true);
            }
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
      conn.on('data', (data: any) => {
        setPeerName(data.name);
        peer.on('call', async (call: any) => {
          setSnackBarState(true);
          setCall(call);
        });
      });
    });
  }

  async function answerCall(call: any) {
    const mediaDevices = navigator.mediaDevices as any;
    const stream = await mediaDevices.getUserMedia({ audio: true });
    // const stream = await mediaDevices.getDisplayMedia({ video: true }); // for screen sharing

    call.answer(stream); // Answer the call with an A/V stream.
    call.on('stream', (remoteStream: any) => {
      // Show stream in some <video> element.
      playRemoteAudio(remoteStream);
    });
  }

  // async function callPeer(peerId: string) {
  //   const peer: any = await startRTC('call');
  //   const mediaDevices = navigator.mediaDevices as any;
  //   // const stream = await mediaDevices.getDisplayMedia({ video: true });  // for screen sharing
  //   const stream = await mediaDevices.getUserMedia({ audio: true });

  //   const conn = peer.connect(peerId);
  //   conn.on('open', () => {
  //     conn.send({ name: nickName || null });
  //     const call = peer.call(peerId, stream);
  //     console.log('calling peer: ' + peerId);
  //     call.on('stream', (remoteStream: any) => {
  //       console.log(typeof stream);
  //       // Show stream in some <video> element.
  //       playRemoteAudio(remoteStream);
  //     });
  //   });
  // }

  function playRemoteAudio(track: any) {
    (
      (audioRef as RefObject<HTMLAudioElement>).current as HTMLAudioElement
    ).srcObject = track;
  }

  return (
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
                <img alt='qr code' src={qrImageUrl}></img>

                <CopyToClipboardBox
                  icon={LinkIcon}
                  text={'Copy Link'}
                  copy={process.env.REACT_APP_URL + '/connect/call/' + peerId}
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
                    startRTC('invite');
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
      <audio ref={audioRef} className='peerAudio' autoPlay />
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
  );
}

export default ConnectPage;
