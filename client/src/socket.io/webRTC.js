const CreateConfiguredPeer = (socket, callers) => {
  const otherUsers = callers?.map((callerObj) => callerObj?.callerId);
  const peer = new RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:stun.stunprotocol.org",
      },
      {
        urls: "turn:numb.viagenie.ca",
        credential: "muazkh",
        username: "webrtc@live.com",
      },
    ],
  });

  //--------CONFIGURING PEER
  peer.onicecandidate = (e) => {
    if (e.candidate) {
      const payload = {
        targets: otherUsers,
        candidate: e.candidate,
      };
      socket.emit("ice-candidate", payload);
    }
  };
  peer.ontrack = (e) => {
    console.log(callers)
    callers.forEach((caller) => {
      if(caller?.mp3Element){
        caller.mp3Element.current.srcObject = e.streams[0];
      }
    });
  };
  peer.onnegotiationneeded = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    socket.emit("offer", {
      targets: otherUsers,
      initiator: socket.id,
      sdp: peer.localDescription,
    });
  };
  return peer;
};

let configuredPeer = null;
export const createOffer = (socket, callersState, myStream) => {
  configuredPeer = CreateConfiguredPeer(socket, callersState);
  configuredPeer.addTrack(myStream.getTracks()[0], myStream);
};

export const receiveAnswerEvent = (payload) => {
  console.log(payload.sdp)
  const desc = new RTCSessionDescription(payload.sdp);
  configuredPeer.setRemoteDescription(desc);
};

let configuredPeer2 = null;
export const receiveOfferEvent =(socket, myStream, callers) =>async({ initiator, sdp }) => {
    console.log(initiator)
    console.log(callers)
    const callerObj = callers.find((callerObj)=>callerObj.userId===initiator)
    configuredPeer2 = CreateConfiguredPeer(socket, [callerObj]);
    const desc = new RTCSessionDescription(sdp);
    await configuredPeer2.setRemoteDescription(desc);
    configuredPeer2.addTrack(myStream.getTracks()[0], myStream);
    const answer = await configuredPeer2.createAnswer();
    await configuredPeer2.setLocalDescription(answer);
    socket.emit("answer", {
      target: initiator,
      caller: socket.id,
      sdp: configuredPeer2.localDescription,
    });
  };

export const receiveCandidateEvent = (CANDIDATE) => {
  const candidate = new RTCIceCandidate(CANDIDATE);
  configuredPeer2.addIceCandidate(candidate);
};
