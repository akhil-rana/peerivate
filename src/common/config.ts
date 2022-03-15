import { csv_to_array } from './utils';

export const config = {
  iceServers: [
    {
      urls: "stun:openrelay.metered.ca:80"
    },
    {
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject"
    },
    {
      urls: "turn:openrelay.metered.ca:443",
      username: "openrelayproject",
      credential: "openrelayproject"
    },
    {
      urls: "turn:openrelay.metered.ca:443?transport=tcp",
      username: "openrelayproject",
      credential: "openrelayproject"
    },
    {
      urls: csv_to_array(process.env.REACT_APP_STUN_SERVER_URL_LIST_CSV || ''),
    },
    {
      username: 'turn@akhilrana.com',
      credential: 'turnpassword',
      urls: ['turn:numb.viagenie.ca'],
    },
    {
      username: process.env.REACT_APP_TURN_SERVER_USERNAME || '',
      credential: process.env.REACT_APP_TURN_SERVER_PASSWORD || '',
      urls: ['turn:vps.akhilrana.com'],
    },
  ],
};
