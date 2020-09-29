  
import React,{useState,useEffect,useRef} from 'react'
import Peer from 'simple-peer'
import io from "socket.io-client";
const socket=io.connect("http://localhost:5000");
const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <video playsInline autoPlay ref={ref} />
    );
}
function VideoChat(props) {
    var[peers,setPeers]=useState([]);
    const ref=[];
    const roomID=props.match.params.roomID;
    useEffect(()=>{
      navigator.mediaDevices.getUserMedia({audio:true,video:{
          height:400,
          width:500
      }}).then(stream=>{
          var video=document.getElementById("uservideo");
          if("srcObject" in video){
              video.srcObject=stream;
              socket.emit("join room",roomID);
              socket.on("all users",users=>{
                  const peers=[];
                  users.forEach(userID=>{
                      const peer=createVideo(userID,socket.id,stream);
                      ref.push({
                          peerID:userID,
                          peer
                      })
                      peers.push(peer);
                  })
                  setPeers(peers);
              });
               socket.on("user joined",payload=>{
                   const peer=addVideo(payload.signal,payload.callerID,stream);
                   ref.push({
                       peerID:payload.callerID,
                       peer
                   })
                   setPeers(users=>[...users,peer]);
               })
               socket.on("receiving returned signal",payload=>{
                   const item=ref.find(p=>p.peerID===payload.id);// doubt
                   console.log("the item is",item);
                   item.peer.signal(payload.signal);
                   console.log(payload.signal)
               })
          }
      })
    },[]);
    const addVideo=(incomingSignal,callerID,stream)=>{
        const peer=new Peer({
            initiator:false,
            trickle:false,
           stream
        })
        peer.on("signal",signal=>{
            socket.emit("returning signal",{signal,callerID})
        })
        peer.signal(incomingSignal);
        return peer;
    }
    const createVideo=(userToSignal,callerID,stream)=>{
        const peer=new Peer({
            initiator:true,
            trickle:true,
           stream
        });
        peer.on("signal",signal=>{  //--->try signal to data
          socket.emit("sending signal",{userToSignal,callerID,signal}); //--remove signal here and try;
        })
      return peer;
    }
    
    return (
        <div>
          <video height="300" width="300" id="uservideo" muted autoPlay playsInline></video>  
         {
             peers.map((peer,index)=>{
                    return(
                        <Video height="300" width="300" key={index} peer={peer} id="addvideo" muted playsInline autoPlay></Video>
                    )
             })
         }
        </div>
    )
}

export default VideoChat