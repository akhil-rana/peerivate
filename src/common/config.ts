import { csv_to_array } from './utils';

export const config = {
  iceServers: [
    {
      urls: csv_to_array(process.env.REACT_APP_STUN_SERVER_URL_LIST_CSV || ''),
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
