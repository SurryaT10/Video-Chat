var socket=io('/');
const videoGrid=document.getElementById('video-grid')
const myPeer=new Peer({
    host:'/',
    port:'9001'
});
const myVideo=document.createElement('video');
myVideo.muted=true;
const peers={}
const mediastream=navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
  
    AddVideoStream(myVideo,stream);
    myPeer.on('call',call=>{
        call.answer(stream);
        const video=document.createElement('video')
        call.on('stream',userVideoStream=>{
            AddVideoStream(video,userVideoStream);
        })
    })
    socket.on('user-connected',userId=>{
        connectToNewUser(userId,stream);
        
    })
})
myPeer.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id);
})
function connectToNewUser(userId,stream){
    const call=myPeer.call(userId,stream);
    const video=document.createElement('video');
    call.on('stream',userVideoStream=>{
        AddVideoStream(video,userVideoStream);
    })
    call.on('close',()=>{
        video.remove();
    })
    console.log("the call value for peer is",call)
     peers[userId]=call;
}
socket.on('user-connected',userId=>{
    console.log('user connected'+userId);
});
socket.on('user-disconnected',userId=>{

    console.log(userId);
    if(peers[userId]){peers[userId].close();}
})
function AddVideoStream(video,stream){
    video.srcObject=stream 
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    });
    videoGrid.append(video);

}