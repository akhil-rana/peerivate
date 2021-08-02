import './index.scss';
import { useState } from 'react';

import VideocamRoundedIcon from '@material-ui/icons/VideocamRounded';
import MicRoundedIcon from '@material-ui/icons/MicRounded';
import MicOffRoundedIcon from '@material-ui/icons/MicOffRounded';
import CallRoundedIcon from '@material-ui/icons/CallRounded';
import VideocamOffRoundedIcon from '@material-ui/icons/VideocamOffRounded';

function Button(props: any) {
  const [videoToggle, setVideoToggle] = useState(true);
  const [micToggle, setMicToggle] = useState(true);

  return (
    <div className='controlButtonsGroup inline-flex'>
      {props?.type === 'mic' ? (
        <button
          onClick={() => {
            props?.action();
            setMicToggle(!micToggle);
          }}
          className={`toggleMic flex items-center p-4 m-auto transition ease-in duration-200 uppercase rounded-full bg-${
            micToggle ? 'blue' : 'gray'
          }-600 hover:bg-blue-900 focus:outline-none`}
        >
          {micToggle ? (
            <MicRoundedIcon
              fontSize={'large'}
              className='inline-block text-white'
            />
          ) : (
            <MicOffRoundedIcon
              fontSize={'large'}
              className='inline-block text-white'
            />
          )}
        </button>
      ) : props?.type === 'camera' ? (
        <button
          onClick={() => {
            props?.action();
            setVideoToggle(!videoToggle);
          }}
          className={`toggleCamera flex items-center p-4 m-auto transition ease-in duration-200 uppercase rounded-full bg-${
            videoToggle ? 'blue' : 'gray'
          }-600 hover:bg-blue-900 focus:outline-none`}
        >
          {!videoToggle ? (
            <VideocamOffRoundedIcon
              fontSize={'large'}
              className='inline-block text-white'
            />
          ) : (
            <VideocamRoundedIcon
              fontSize={'large'}
              className='inline-block text-white'
            />
          )}
        </button>
      ) : props?.type === 'call' ? (
        <button
          onClick={() => {
            props?.action();
          }}
          className='callDisconnectButton flex items-center p-4 m-auto transition ease-in duration-200 uppercase rounded-full bg-red-700 hover:bg-red-900 focus:outline-none'
        >
          <CallRoundedIcon
            fontSize={'large'}
            className='inline-block text-white'
          />
        </button>
      ) : null}
    </div>
  );
}

export default Button;
