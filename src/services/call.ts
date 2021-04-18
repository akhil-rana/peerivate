export async function callPeer(peerId: string, peer: any) {
  const mediaDevices = navigator.mediaDevices as any;
  // const stream = await mediaDevices.getDisplayMedia({ video: true });
  const stream = await mediaDevices.getUserMedia({ audio: true });

  const call = peer.call(peerId, stream);
  console.log('calling peer: ' + peerId);
  call.on('stream', (remoteStream: any) => {
    console.log(typeof stream);
    // Show stream in some <video> element.
  });
}

//testing with simple message
// const conn = peer.connect(peerId);
// conn.on('open', () => {
//   console.log('connect to ' + peerId);
//   conn.send('hi!');
// });

export async function answerPeer(peer: any) {
  peer.on('call', async (call: any) => {
    const mediaDevices = navigator.mediaDevices as any;
    const stream = await mediaDevices.getUserMedia({ audio: true });
    // const stream = await mediaDevices.getDisplayMedia({ video: true });

    call.answer(stream); // Answer the call with an A/V stream.
    call.on('stream', (remoteStream: any) => {
      // Show stream in some <video> element.
    });

    //testing with simple message
    // peer.on('connection', (conn: any) => {
    //   conn.on('data', (data:any) => {
    //     // Will print 'hi!'
    //     console.log(data);
    //   });
    //   conn.on('open', () => {
    //     conn.send('hello!');
    //   });
    // });
  });
}
