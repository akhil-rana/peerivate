import './index.scss';
import Peer from 'peerjs';
import QRCode from 'qrcode';
import { RefObject, useEffect, useRef, useState } from 'react';
import Card from '../../components/card';
import { motion } from 'framer-motion';
import { DuplicateIcon, LinkIcon } from '@heroicons/react/outline';
import CopyToClipboardBox from '../../components/copyToClipboardBox';
import { v4 as uuidv4 } from 'uuid';

function ConnectPage(props: any) {
  const [qrCodeLoading, setQrCodeLoading] = useState(true);
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [peerId] = useState(uuidv4());
  const [otherPeerID, serOtherPeerID] = useState('');
  const [nickName, setNickName] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  const config = {
    iceServers: [
      {
        urls: csv_to_array(
          process.env.REACT_APP_STUN_SERVER_URL_LIST_CSV || ''
        ),
      },
      {
        username: process.env.REACT_APP_TURN_SERVER_USERNAME || '',
        credential: process.env.REACT_APP_TURN_SERVER_PASSWORD || '',
        urls: [
          'turn:bn-turn1.xirsys.com:80?transport=udp',
          'turn:bn-turn1.xirsys.com:3478?transport=udp',
          'turn:bn-turn1.xirsys.com:80?transport=tcp',
          'turn:bn-turn1.xirsys.com:3478?transport=tcp',
          'turns:bn-turn1.xirsys.com:443?transport=tcp',
          'turns:bn-turn1.xirsys.com:5349?transport=tcp',
        ],
      },
    ],
  };

  const [peer] = useState(
    new Peer(peerId, {
      config: config,
    })
  );

  function csv_to_array(data: any, delimiter = ',', omitFirstRow = false) {
    return data
      .slice(omitFirstRow ? data.indexOf('\n') + 1 : 0)
      .split('\n')
      .map((v: any) => v.split(delimiter));
  }

  useEffect(() => {
    peer.on('open', function (id) {
      QRCode.toDataURL(peerId)
        .then((url) => {
          setQrImageUrl(url);
          setQrCodeLoading(false);
        })
        .catch((err) => {
          console.error(err);
        });
    });

    answerPeer(peer);

    async function answerPeer(peer: any) {
      peer.on('connection', (conn: any) => {
        conn.on('data', (data: any) => {
          console.log(data.name);
          peer.on('call', async (call: any) => {
            const mediaDevices = navigator.mediaDevices as any;
            const stream = await mediaDevices.getUserMedia({ audio: true });
            // const stream = await mediaDevices.getDisplayMedia({ video: true }); // for screen sharing

            call.answer(stream); // Answer the call with an A/V stream.
            call.on('stream', (remoteStream: any) => {
              // Show stream in some <video> element.
              playRemoteAudio(remoteStream);
            });
          });
        });
      });
    }
  }, [peer, peerId]);

  async function callPeer(peerId: string, peer: any) {
    const mediaDevices = navigator.mediaDevices as any;
    // const stream = await mediaDevices.getDisplayMedia({ video: true });  // for screen sharing
    const stream = await mediaDevices.getUserMedia({ audio: true });

    const conn = peer.connect(peerId);
    conn.on('open', () => {
      conn.send({ name: nickName || null });
      const call = peer.call(peerId, stream);
      console.log('calling peer: ' + peerId);
      call.on('stream', (remoteStream: any) => {
        console.log(typeof stream);
        // Show stream in some <video> element.
        playRemoteAudio(remoteStream);
      });
    });
  }

  function playRemoteAudio(track: any) {
    ((audioRef as RefObject<HTMLAudioElement>)
      .current as HTMLAudioElement).srcObject = track;
  }

  return (
    <div className='connectPageMain'>
      <div className='cards flex flex-col m-auto sm:flex-row'>
        <Card
          loading={qrCodeLoading}
          content={
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
              <input
                type='text'
                className='mt-5 rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                name='meetingId'
                onChange={(e) => {
                  serOtherPeerID(e?.target?.value);
                }}
                placeholder='Peer ID'
              />

              <input
                type='text'
                className='mt-5 rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                name='nickName'
                onChange={(e) => {
                  setNickName(e?.target?.value);
                }}
                placeholder='Your name (optional)'
              />

              <button
                type='button'
                onClick={() => {
                  callPeer(otherPeerID, peer);
                }}
                className='py-3 px-6 w-40 mt-10 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-full'
              >
                Call
              </button>
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
    </div>
  );
}

export default ConnectPage;
