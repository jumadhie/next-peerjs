"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./../page.module.css";
import Peer from "peerjs";
const page = () => {
  const [peerId, setPeerid] = useState(null);
  const [remotePerIdValue, setRemotePerIdValue] = useState("");
  const peerInstance = useRef(null);
  const localVideoRef = useRef(null);

  const remoteVideoRef = useRef(null);
  useEffect(() => {
    // const peer = new Peer();
    import("peerjs").then(({ default: Peer }) => {
      // normal synchronous code
      const peer = new Peer();
      peer.on("open", (id) => {
        console.log(id);
      });

      peer.on("open", (id) => {
        setPeerid(id);
        setRemotePerIdValue(id);
      });

      peer.on("call", (call) => {
        const getUserMedia =
          navigator.mediaDevices.getUserMedia ||
          navigator.mediaDevices.webkitGetUserMedia ||
          navigator.mediaDevices.mozGetUserMedia;

        getUserMedia(
          { video: true, audio: false },
          (stream) => {
            call.answer(stream);
          },
          (err) => {
            console.log(err.name);
          }
        );
      });
      peerInstance.current = peer;
    });

    // peer.on("open", (id) => {
    //   setPeerid(id);
    //   setRemotePerIdValue(id);
    // });

    // peer.on("call", (call) => {
    //   let getUserMedia =
    //     navigator.getUserMedia ||
    //     navigator.webkitGetUserMedia ||
    //     navigator.mozGetUserMedia;

    //   getUserMedia({ video: true, audio: false }, (stream) => {
    //     call.answer(stream);
    //   });
    // });
    // peerInstance.current = peer;

    // setRemotePerIdValue(peer.id);
  }, []);

  const call = (remotePerId) => {
    // const getUserMedia =
    //   navigator.getUserMedia ||
    //   navigator.webkitGetUserMedia ||
    //   navigator.mozGetUserMedia;

    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      console.log("Let's get this party started");
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(
      (stream) => {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play();
        const call = peerInstance.current.call(remotePerId, stream);

        call.on(
          "stream",
          (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play();
          },
          (err) => {
            console.log(err.name);
          }
        );
      },
      (err) => {
        console.log(err.name);
      }
    );
  };

  console.log(peerId);
  console.log("local", localVideoRef);
  console.log("remote", remoteVideoRef);
  console.log(peerId);

  return (
    <div className={styles.main}>
      <h1>Current user id is {peerId}</h1>
      <input
        type="text"
        onChange={(e) => setRemotePerIdValue(e.target.value)}
        value={remotePerIdValue}
      />
      <button onClick={() => call(remotePerIdValue)}>submit</button>
      <div style={{ display: "flex" }}>
        <video
          ref={localVideoRef}
          height={200}
          width={200}
          //   autoPlay
          // controls={true}
          // src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
        ></video>
        <video
          ref={remoteVideoRef}
          height={200}
          width={200}
          //   autoPlay
          // controls={true}
          // src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
        ></video>
      </div>
    </div>
  );
};

export default page;
