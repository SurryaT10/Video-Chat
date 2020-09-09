import React, { useState, useEffect } from 'react';
import "./ChatRoom.css";
import socketIOClient from 'socket.io-client';
import ShowDetails from '../ShowDetails/ShowDetails';
import uuid from 'react-uuid';
import Backdrop from '../../UI/Backdrop/Backdrop';
import InfoIcon from '@material-ui/icons/Info';
import axios from 'axios';
// import AttachmentIcon from '@material-ui/icons/Attachment';

const ENDPOINT = "localhost:5000/";
const socket = socketIOClient(ENDPOINT);



const ChatRoom = (props) => {
    const [userName, setUserName] = useState("");
    const [roomID, setRoomID] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [img, setImg] = useState("");
    const [messageAlign, setMessageAlign] = useState("");
    const [imageAlign, setImageAlign] = useState("");
    useEffect(() => {
        if (!props.location.state)
            return props.history.push("/");

        setUserName(props.location.state.userName);
        setRoomID(props.match.params.id);
        socket.emit("join", { userName: props.location.state.userName, roomID: props.match.params.id });
        socket.on("join", (time) => {
            console.log(time);
        });
        socket.on("message", ({ userName, message }) => {
            setMessageAlign("");
            addNewMessage(userName, message);
        });

        socket.on("send-image", ({ img }) => {
            setImageAlign("");
            addImagetoMessages(img);
        });
        
    }, []);

    const addNewMessage = (userName, message) => {
        const newMessage = (
            <p className={"message " + messageAlign} key={uuid()}><span>{userName} - </span>{message}</p>
        );
        setMessages(oldMessages => [ ...oldMessages, newMessage ]);
    }

    const addImagetoMessages = (img) => {
        const imgHtml = (
            <img className={"img-msg " + imageAlign} src={img} key={uuid()} alt="image N/A" />
        );
        setMessages(oldMessages => [ ...oldMessages, imgHtml ]);
    }

    const handleInputChange = (e) => {
        setMessage(e.target.value);
        setUserName(props.location.state.userName);
        setMessageAlign("message-align");
    }

    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        // var bytes = [].slice.call(new Uint8Array(buffer));
        buffer.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        const roomID = props.match.params.id
        if (message) {
            socket.emit("message", { userName, message, roomID });
            setMessageAlign("");
            addNewMessage("You", message);
            setMessage("");
        }

        if (img) {
            socket.emit("send-image", { userName, img, roomID });
            setImageAlign("");
            addImagetoMessages(img);
            setImg("");
        }
    }

    const toggleInfo = () => {
        setShowDetails(prev => !prev);
    }

    const addFile = async (e) => {
        // setFile(e.target.files[0]);
        // setFileName(e.target.files[0].name);
        setImageAlign("img-align")
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("http://localhost:5000/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const buffer = res.data;
            const base64Flag = "data:image.jpeg;base64,";
            const imageStr = arrayBufferToBase64(buffer.data.data);
            setImg(base64Flag + imageStr);
        } catch(err) {
            if (err.response.status === 500) {
                console.log("server error");
            } else {
                console.log(err.response.data.msg);
            }
        }
    }

    let show = showDetails ? <ShowDetails roomID={roomID} /> : null;

    return (
        <div className='chat'>
            <Backdrop show={showDetails} clicked={toggleInfo} />
            <div id='sidebar' className='chat-sidebar'>

            </div>
            <div className='chat-main'>

                <div className='chat-messages'>
                    { messages }
                </div>

                <div className='compose'>
                    <form id="message-form" onSubmit={sendMessage} >
                        <textarea rows="1" name="message" type="text" placeholder="Message" value={message} onChange={handleInputChange} />
                        <button>Send</button>
                    </form>
                    <InfoIcon fontSize="large" className="info-icon" onClick={toggleInfo} />
                    <label htmlFor="file-upload" className="custom-file-upload">
                        Custom Upload
                    </label>
                    <input id="file-upload" type="file" onChange={addFile} />
                    { show }
                </div>
            </div>
        </div>
    );
}

export default ChatRoom;