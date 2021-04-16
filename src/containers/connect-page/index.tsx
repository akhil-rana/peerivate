import './index.scss';
import Peer from 'peerjs';
import QRCode from 'qrcode';
import React, { useEffect, useState } from 'react';
// import { useSpring, animated } from 'react-spring';
import Card from '../../components/card';

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
    <div>
      <div className='connectPageMain'>
        <Card
          loading={qrCodeLoading}
          upperPortion={<img alt='qrcode' src={qrImageUrl}></img>}
          heading='Invite others'
        ></Card>
      </div>
    </div>
  );
}

export default ConnectPage;
