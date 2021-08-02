import './index.scss';
import { useParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import Peer from 'peerjs';

import RippleLoading from '../../components/rippleLoading';
import { config } from '../../common/config';
import Card from '../../components/card';
import {
  generateRandomPeerId,
  getDefaultCameraDeviceId,
  kebabToCapitalizedSpacedString,
  playStream,
} from '../../common/utils';
import { useLocation } from 'react-router-dom';
import Alert from '../../components/alert';
import Draggable from 'react-draggable';
import CallControls from '../../components/callControls';

function CallPage(props: any) {
  const { id } = useParams<{ id: string; type: string }>();
  const [, setRandomPeerId] = useState('');
  const [calling, setCalling] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('error');
  const [callConnectedState, setCallConnectedState] = useState(false);
  const locationState: any = useLocation().state;
  const [nickName, setNickName] = useState(locationState?.name || '');
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const peerVideoRef = useRef<HTMLVideoElement>(null);
  // const [peer, setPeer]: any = useState(null);
  const [conn, setConn]: any = useState(null);

  function startRTC() {
    const randomPeerId = generateRandomPeerId(nickName);
    setRandomPeerId(randomPeerId);
    return new Promise((resolve, reject) => {
      const peer = new Peer(randomPeerId, {
        config: config,
        secure: true,
        ...(process.env.REACT_APP_PEERJS_SERVER_DOMAIN && {
          host: process.env.REACT_APP_PEERJS_SERVER_DOMAIN,
        }),
        port: 443,
      });

      peer.on('open', function (id: any) {
        // setPeer(peer);
        resolve(peer);
      });
    });
  }

  async function callPeer(peerId: string) {
    setCalling(true);
    const peer: any = await startRTC();

    const conn = peer.connect(peerId);
    conn.on('open', async () => {
      setConn(conn);
      const mediaDevices = navigator.mediaDevices as any;

      // for screen share / system audio
      // const stream = await mediaDevices.getDisplayMedia({
      //   video: true,
      //   audio: true,
      // });

      // for camera/mic
      const defaultCameraId = await getDefaultCameraDeviceId();
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          deviceId: defaultCameraId,
        },
      });

      conn.send({ name: nickName || null });
      const call = peer.call(peerId, stream);
      console.log('calling peer: ' + peerId);
      call.on('stream', (remoteStream: any) => {
        setCallConnectedState(true);
        setCalling(false);
        playStream(remoteStream, peerVideoRef);
        playStream(stream, myVideoRef);
      });
    });
    conn.on('close', function () {
      // console.log('close');
      peer.disconnect();
      window.open('/', '_self');
    });

    peer.on('error', function (err: string) {
      console.log(err);
      setErrorMessage(err.toString());
      setShowError(true);
    });
  }

  useEffect(() => {
    if (locationState?.name) {
      callPeer(id);
    }

    if (props?.pickCall) {
      setCallConnectedState(true);
      setTimeout(() => {
        playStream(props?.remoteStream, peerVideoRef);
        playStream(props?.myStream, myVideoRef);
        setConn(props?.connection);
      }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <div className={callConnectedState ? 'callPageContainerDark' : ''}>
      <div className='flex align-middle justify-center h-screen'>
        <div className='m-auto text-center'>
          {calling && !callConnectedState ? (
            // when user directly calls so name input not required
            <div>
              <span className='font-sans font-medium text-4xl'>
                Calling{' '}
                {kebabToCapitalizedSpacedString(id?.split('_')[0]) ||
                  props?.pickedCallDetails?.peerName ||
                  'peer'}
                ...
              </span>
              <div className='flex align-middle justify-center'>
                <RippleLoading />
              </div>
            </div>
          ) : !calling &&
            !callConnectedState &&
            !locationState?.name &&
            !props?.pickCall ? (
            // when user comes from invite link so name is to be entered first
            <div>
              <Card
                loading={false}
                content={
                  <div className=' relative mt-6 text-center'>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        callPeer(id);
                      }}
                    >
                      <input
                        type='text'
                        className='mt-5 rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                        name='nickName'
                        onChange={(e) => {
                          setNickName(e?.target?.value);
                        }}
                        placeholder='Your name'
                        maxLength={30}
                        autoCapitalize='on'
                        autoComplete='off'
                        required
                      />
                      <br />
                      <br />

                      <button
                        type='submit'
                        className='py-3 px-6 w-40 mt-10 bg-green-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-full'
                      >
                        Call
                      </button>
                    </form>
                  </div>
                }
                heading={`Call ${
                  kebabToCapitalizedSpacedString(id?.split('_')[0]) || 'peer'
                } `}
                animateFrom='100em'
                animateTo='0em'
                style={{
                  height: '20em',
                  margin: '1em auto',
                }}
              ></Card>
            </div>
          ) : !calling && callConnectedState ? (
            // when user picks an incoming call
            <div>
              <div className='font-sans font-medium text-4xl'>
                {/* Connected to{' '}
                {kebabToCapitalizedSpacedString(id?.split('_')[0]) ||
                  props?.pickedCallDetails?.peerName ||
                  'peer'} */}
                <div className='videoContainer'>
                  <video ref={peerVideoRef} className='peerVideo' autoPlay />
                  <Draggable bounds={'parent'}>
                    <video ref={myVideoRef} className='myVideo' autoPlay />
                  </Draggable>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {showError ? (
        <Alert
          type={'error'}
          addStyles={{
            position: 'absolute',
            top: '1em',
            right: '0.5em',
          }}
          show={showError}
          setShow={setShowError}
          timeout={6000}
          message={errorMessage}
          callBack={() => {
            window.open('/', '_self');
          }}
        />
      ) : null}
      {!calling && callConnectedState ? (
        <CallControls connection={conn} />
      ) : null}
    </div>
  );
}

export default CallPage;
