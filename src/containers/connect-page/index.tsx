import './index.scss';
import Peer from 'peerjs';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import Card from '../../components/card';
import { motion } from 'framer-motion';
import { DuplicateIcon, LinkIcon } from '@heroicons/react/outline';
import CopyToClipboardBox from '../../components/copyToClipboardBox';
import { callPeer, answerPeer } from '../../services/call';
import { v4 as uuidv4 } from 'uuid';

function ConnectPage(props: any) {
  const [qrCodeLoading, setQrCodeLoading] = useState(true);
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [peerId, setPeerId] = useState(uuidv4());
  const [otherPeerID, serOtherPeerID] = useState('');
  const [peer, setPeer] = useState(
    new Peer(peerId, {
      config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] },
    })
  );

  // var pee1r = new Peer();

  useEffect(() => {
    // const peer = new Peer();
    // console.log('h')
    peer.on('open', function (id) {
      // setPeerId(id);
      QRCode.toDataURL(peerId)
        .then((url) => {
          setQrImageUrl(url);
          setQrCodeLoading(false);
        })
        .catch((err) => {
          console.error(err);
        });
    });
    // answerPeer(peer);

    peer.on('connection', (conn) => {
      conn.on('data', (data) => {
        // Will print 'hi!'
        console.log(data);
      });
      conn.on('open', () => {
        conn.send('hello!');
      });
    });
  }, [peer]);

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
                copy={process.env.REACT_APP_URL + '/join/' + peerId}
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
                id='name-with-label'
                className='mt-5 rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                name='meetingId'
                onChange={(e) => {
                  serOtherPeerID(e?.target?.value);
                }}
                placeholder='Peer ID'
              />

              <button
                type='button'
                onClick={() => {
                  // callPeer(otherPeerID);
                  // const peer1 = new Peer();
                  const conn = peer.connect(otherPeerID);
                  console.log(conn);
                  conn.on('open', () => {
                    console.log('connect to ' + otherPeerID);
                    conn.send('hi!');
                  });
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
    </div>
  );
}

export default ConnectPage;
