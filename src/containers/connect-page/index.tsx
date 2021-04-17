import './index.scss';
import Peer from 'peerjs';
import QRCode from 'qrcode';
import React, { useEffect, useState } from 'react';
import Card from '../../components/card';
import { motion } from 'framer-motion';
// import { AppstoreAddOutlined } from '@ant-design/icons';
import { DuplicateIcon } from '@heroicons/react/outline';

function ConnectPage(props: any) {
  const [qrCodeLoading, setQrCodeLoading] = useState(true);
  const [qrImageUrl, setQrImageUrl] = useState('');

  useEffect(() => {
    const peer = new Peer();
    peer.on('open', function (id) {
      // console.log('My peer ID is: ' + id);
      QRCode.toDataURL(id)
        .then((url) => {
          // console.log(url);
          setQrImageUrl(url);
          setQrCodeLoading(false);
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }, []);

  return (
    <div className='connectPageMain'>
      <div className='cards flex flex-col m-auto sm:flex-row'>
        <Card
          loading={qrCodeLoading}
          upperPortion={
            <motion.div animate={{ scale: 1 }}
            initial={{ scale: 0.5 }}
            transition={{ duration: 0.2 }}>
              <img
                
                alt='qr code'
                src={qrImageUrl}
              ></img>
              <div className='text-center align-middle border rounded-2xl border-black border-opacity-20 p-1'>
                <span className='m-auto p-1'> Copy ID</span>{' '}
                <DuplicateIcon className='h-6 w-6 m-auto inline-block' />
              </div>
            </motion.div>
          }
          heading='Invite others'
          animateFrom='-100em'
          animateTo='0em'
          style={{
            height: '17em',
            margin: '1em auto',
          }}
        ></Card>

        <Card
          loading={qrCodeLoading}
          upperPortion={''}
          heading='Join'
          animateFrom='100em'
          animateTo='0em'
          style={{
            height: '17em',
            margin: '1em auto',
          }}
        ></Card>
      </div>
    </div>
  );
}

export default ConnectPage;
