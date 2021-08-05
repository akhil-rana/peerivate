import './index.scss';
import { useParams } from 'react-router-dom';
import { useState, useRef, useEffect, RefObject } from 'react';
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
import { DragOutlined } from '@ant-design/icons';
import FullscreenRoundedIcon from '@material-ui/icons/FullscreenRounded';

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
  const [call, setCall]: any = useState(null);
  // const [peer, setPeer]: any = useState(null);
  const [conn, setConn]: any = useState(null);
  const [myStream, setMyStream]: any = useState(null);
  const [remoteStream, setRemoteStream]: any = useState(null);
  const [myVideoTrackState, setMyVideoTrackState] = useState(true);
  const [myAudioTrackState, setMyAudioTrackState] = useState(true);
  const [isRemoteStreamOnFullScreen, setIsRemoteStreamOnFullScreen] =
    useState(true);

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

  function switchStreams() {
    const temp = (
      (myVideoRef as RefObject<HTMLVideoElement>).current as HTMLVideoElement
    ).srcObject;

    (
      (myVideoRef as RefObject<HTMLVideoElement>).current as HTMLVideoElement
    ).srcObject = (
      (peerVideoRef as RefObject<HTMLVideoElement>).current as HTMLVideoElement
    ).srcObject;

    (
      (peerVideoRef as RefObject<HTMLVideoElement>).current as HTMLVideoElement
    ).srcObject = temp;

    // let tempMyStream = myStream;
    // let tempRemoteStream = remoteStream;
    // setMyStream(tempRemoteStream);
    // setRemoteStream(tempMyStream);
    // playStream(tempMyStream, peerVideoRef);
    // playStream(tempRemoteStream, myVideoRef);
    setIsRemoteStreamOnFullScreen(!isRemoteStreamOnFullScreen);
  }

  async function startNewVideoStream() {
    let isMobile = false;
    if (
      /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      isMobile = true;
    }
    const mediaDevices = navigator.mediaDevices as any;

    const defaultCameraId = await getDefaultCameraDeviceId();
    const stream = await mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        ...(!isMobile && {
          deviceId: defaultCameraId,
        }),
      },
    });
    call.peerConnection
      .getSenders()[1]
      .replaceTrack(stream.getVideoTracks()[0]);
    myStream.addTrack(stream.getVideoTracks()[0]);
    setMyStream(myStream);
    playStream(stream, myVideoRef);
    setMyVideoTrackState(true);
  }

  async function startNewAudioStream() {
    const mediaDevices = navigator.mediaDevices as any;

    const stream = await mediaDevices.getUserMedia({
      audio: true,
    });

    call.peerConnection
      .getSenders()[0]
      .replaceTrack(stream.getAudioTracks()[0]);
    myStream.addTrack(stream.getAudioTracks()[0]);
    setMyStream(myStream);
    setMyAudioTrackState(true);
  }

  async function stopMyTrack(type: string) {
    myStream.getTracks().forEach((track: any) => {
      if (track.kind === type) {
        track.enabled = false;
        setTimeout(() => {
          track.stop();
        }, 200);
      }
    });

    if (type === 'video') setMyVideoTrackState(false);
    if (type === 'audio') setMyAudioTrackState(false);
  }

  async function callPeer(peerId: string) {
    setCalling(true);
    const peer: any = await startRTC();

    const conn = peer.connect(peerId);
    conn.on('open', async () => {
      setConn(conn);

      let isMobile = false;
      if (
        /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        isMobile = true;
      }
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
          ...(!isMobile && {
            deviceId: defaultCameraId,
          }),
        },
      });

      // console.log(stream.getTracks());
      setMyStream(stream);
      // toggleTrack(stream, 'video');

      conn.send({ name: nickName || null });
      const call = peer.call(peerId, stream);
      setCall(call);
      console.log('calling peer: ' + peerId);
      call.on('stream', (remoteStream: any) => {
        setCallConnectedState(true);
        setCalling(false);
        setRemoteStream(remoteStream);
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
        setMyStream(props?.myStream);
        setCall(props?.call);
        setRemoteStream(props?.remoteStream);
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
                  <video
                    muted={!isRemoteStreamOnFullScreen}
                    ref={peerVideoRef}
                    className='peerVideo'
                    autoPlay
                  />
                  <div className='draggableVideoBox'>
                    <Draggable bounds={'.videoContainer'}>
                      <div className='myVideoContainer'>
                        <video
                          muted={isRemoteStreamOnFullScreen}
                          ref={myVideoRef}
                          className='myVideo'
                          autoPlay
                        />
                        <DragOutlined
                          style={{
                            position: 'absolute',
                            top: '5px',
                            left: '5px',
                            color: 'white',

                            cursor: 'all-scroll',
                          }}
                        />
                        <FullscreenRoundedIcon
                          onClick={() => {
                            switchStreams();
                          }}
                          className='fullScreenIcon'
                          style={{
                            fontSize: '0.8em',
                            transition: '0.5s ease',
                          }}
                        />
                      </div>
                    </Draggable>
                  </div>
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
        <CallControls
          callDisconnectAction={() => conn?.close()}
          micToggleAction={() => {
            if (myAudioTrackState) stopMyTrack('audio');
            else startNewAudioStream();
          }}
          cameraToggleAction={() => {
            if (myVideoTrackState) stopMyTrack('video');
            else startNewVideoStream();
          }}
        />
      ) : null}
    </div>
  );
}

export default CallPage;
