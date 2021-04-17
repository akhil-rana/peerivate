import Peer from 'peerjs';

export async function callPeer(peerId: string) {
  const peer = new Peer();
  //   await (navigator.mediaDevices as any).getDisplayMedia(
  //     { video: true },
  //     (stream: any) => {
  //       const call = peer.call(peerId, stream);
  //       console.log('calling peer: ' + peerId);
  //       call.on('stream', (remoteStream) => {
  //         console.log(typeof stream);
  //         // Show stream in some <video> element.
  //       });
  //     },
  //     (err: any) => {
  //       console.error('Failed to get local stream', err);
  //     }
  //   ).catch((err:any) =>{
  //       console.error(err)
  //   });
  const conn = peer.connect(peerId);
  conn.on('open', () => {
    conn.send('hi!');
  });
}

export async function answerPeer(peer: any) {
  peer.on('call', (call: any) => {
    console.log('hey');
    (navigator.mediaDevices as any).getDisplayMedia(
      { video: true },
      (stream: any) => {
        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', (remoteStream: any) => {
          // Show stream in some <video> element.
        });
      },
      (err: any) => {
        console.error('Failed to get local stream', err);
      }
    );
  });
}
