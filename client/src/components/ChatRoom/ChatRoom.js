import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'
const connection=io.connect('http://localhost:9000')
const ChatRoom = (props) => {
    var [state,setState]=useState({roomId:props.match.params.id,name:'',message:''})
    var[chat,setChat]=useState([])
    useEffect(() => {
         connection.on('chat',({roomId,name,message})=>{
                setChat([...chat,{
               roomId, name,message
            }])   
            console.log('server connected') 
       })
        connection.on('disconnect',(loseconnection)=>{
            console.log("server disconnected")
        })
    });
    const textChange=(e)=>{
      setState({
          ...state,[e.target.name]:e.target.value
      })
    }
    const sentButton=(e)=>{
           e.preventDefault();
           const{roomId,name,message}=state;
            connection.emit('chat',{roomId,name,message});
           
    }
    return (
        <div>
            <input name="name" type="text"
            onChange={e=>textChange(e)}
            placeholder="Enter your name"  required></input>
            <input name="message" type="text" 
            onChange={e=>textChange(e)}
            placeholder="Enter the Message" required></input>
            <button onClick={sentButton}>Send</button>
            {
                chat.map(({roomId,name,message},index)=>{
                  return  <div key={index} >
                        <p style={{backgroundColor:'red',color:'white'}}>{roomId}</p><br></br>
                <p style={{backgroundColor:'green',color:'white'}}>{name} is {message}</p>
                     </div>   
                })
            }
        </div>
    );
}

export default ChatRoom;