import './index.scss';
import Peer from 'peerjs';
import QRCode from 'qrcode';
import React, { useEffect, useState } from 'react';
import Card from '../../components/card';
import { motion } from 'framer-motion';

function ConnectPage(props: any) {
  const [qrCodeLoading, setQrCodeLoading] = useState(true);
  const [qrImageUrl, setQrImageUrl] = useState('');

  useEffect(() => {
    const peer = new Peer();
    peer.on('open', function (id) {
      console.log('My peer ID is: ' + id);
      QRCode.toDataURL(id)
        .then((url) => {
          console.log(url);
          setQrImageUrl(url);
          setQrCodeLoading(false);
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }, []);

  return (
    <div className='connectPageMain flex'>
      <Card
        loading={qrCodeLoading}
        upperPortion={
          <motion.img
            animate={{ scale: 1 }}
            initial={{ scale: 0.5 }}
            transition={{ duration: 0.2 }}
            alt='qr code'
            src={qrImageUrl}
          ></motion.img>
        }
        heading='Invite others'
        animateFrom='-100em'
        animateTo='0em'
        style={{
          height: '17em',
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
        }}
      ></Card>
    </div>
  );
}

export default ConnectPage;
