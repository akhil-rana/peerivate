import './index.scss';
import Peer from 'peerjs';
import QRCode from 'qrcode';
import React, { useEffect, useState } from 'react';
import Card from '../../components/card';
import { motion } from 'framer-motion';
// import { AppstoreAddOutlined } from '@ant-design/icons';
import { DuplicateIcon, LinkIcon } from '@heroicons/react/outline';
import CopyToClipboardBox from '../../components/copyToClipboardBox';

function ConnectPage(props: any) {
  const [qrCodeLoading, setQrCodeLoading] = useState(true);
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [peerId, setPeerId] = useState('');

  useEffect(() => {
    const peer = new Peer();
    peer.on('open', function (id) {
      setPeerId(id);
      QRCode.toDataURL(id)
        .then((url) => {
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
          loading={qrCodeLoading}
          content={''}
          heading='Join'
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
