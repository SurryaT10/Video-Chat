import React, { useState, useEffect } from 'react';
import "./ChatRoom.css";
import socketIOClient from 'socket.io-client';
import ShowDetails from '../ShowDetails/ShowDetails';
import uuid from 'react-uuid';
import Backdrop from '../../UI/Backdrop/Backdrop';
import InfoIcon from '@material-ui/icons/Info';
import SendIcon from '@material-ui/icons/Send';
import Messages from '../Messages/Messages';
import ShowUsers from '../ShowUsers/ShowUsers';
import Avatar from '../../images/avatar.png';
import { getBase64 } from '../../utils';
import AttachmentIcon from '@material-ui/icons/Attachment';
import Post from '../Post/Post';
import InfoMessage from '../../UI/InfoMessage/InfoMessage';
import ShowPost from '../ShowPost/ShowPost';
import ShowPerformance from '../ShowPerformance/ShowPerformance';

const ENDPOINT = "localhost:5000/";
const socket = socketIOClient(ENDPOINT);

const ChatRoom = (props) => {
    const [user, setUser] = useState({
        id: "",
        name: "",
        img: Avatar
    });
    const [roomID, setRoomID] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [uploadedImg, setUploadedImg] = useState("");
    const [messageAlign, setMessageAlign] = useState("");
    const [imageAlign, setImageAlign] = useState("");
    const [availableUsers, setAvailableUsers] = useState([]);
    const [showPost, setShowPost] = useState(false);
    const [showInfoMessage, setShowInfoMessage] = useState(false);
    const [post, setPost] = useState(null);
    const [performance, setPerformance] = useState(null);
    const [togglePerformance, setTogglePerformance] = useState(false);
    useEffect(() => {
        if (!props.location.state)
            return props.history.push("/");

        const userName = props.location.state.userName;;
        const getFromStorage = JSON.parse(window.localStorage.getItem("chat-details"));
        if (getFromStorage) {
            setUser(getFromStorage.user);
            setRoomID(getFromStorage.roomID);
        }
        socket.emit("join", { userName, userImg: Avatar, roomID: props.match.params.id });
        setUser(user => {
            return {
                ...user,
                name: userName
            }
        });

        setRoomID(props.match.params.id);
        
        socket.on("message", ({ userName, message, users }) => {
            setMessageAlign("");
            addNewMessage(userName, message);
            setAvailableUsers(users);
        });

        socket.on("send-image", ({ img }) => {
            setImageAlign("");
            addImagetoMessages(img);
        });

        socket.on("room-data", ( {users }) => {
            setAvailableUsers(users);
        });

        socket.on("question", details => {
            setPost(details);
        });
    }, []);

    useEffect(() => {
        const saveToStorage = {
            user,
            roomID
        }

        socket.on("get answer", details => {
            setPerformance(details);
        });

        window.localStorage.setItem("chat-details", JSON.stringify(saveToStorage));
    });


    useEffect(() => {
        socket.on("join", ({ time, id, userName }) => {
            const updatedUser = {
                ...user,
                name: userName,
                id
            }
            setUser(updatedUser);
        });
    }, [user]);

    const addNewMessage = (userName, message) => {
        const newMessage = (
            <div key={uuid()} className="message">
                <div className={"chat-message " + messageAlign} >
                    <h3 className="user-name">{userName}</h3>  
                    {message}
                </div>
            </div>
        );
        setMessages(oldMessages => [ ...oldMessages, newMessage ]);
    }

    const addImagetoMessages = (img) => {
        const imgHtml = (
            <img className={"img-msg " + imageAlign} src={img} key={uuid()} alt="N/A" />
        );
        setMessages(oldMessages => [ ...oldMessages, imgHtml ]);
    }

    const showInfo = () => {
        setTimeout(() => {
            setShowInfoMessage(false);
        }, 2000);
    }

    const handleInputChange = (e) => {
        setMessage(e.target.value);
        setMessageAlign("message-align");
    }

    const sendMessage = async (e) => {
        const roomID = props.match.params.id
        
        if (uploadedImg) {
            socket.emit("send-image", { userName: user.name, img: uploadedImg, roomID });
            setImageAlign("");
            addImagetoMessages(uploadedImg);
            setUploadedImg("");
            setMessage("");
        }

        if (message) {
            socket.emit("message", { userName: user.name, message, roomID });
            setMessageAlign("");
            addNewMessage("You", message);
            setMessage("");
        }
    }

    const toggleInfo = () => {
        setShowDetails(prev => !prev);
    }

    const togglePost = () => {
        setShowPost(prev => !prev);
    }

    const changeTogglePerformance = () => {
        setTogglePerformance(prev => !prev);
    }

    const addFile = async (e) => {
        setMessageAlign("message-align");
        setImageAlign("img-align")
        const file = e.target.files[0];
        setMessage(file.name);
        try {
            const base64Image = await getBase64(file);
            setUploadedImg(base64Image);
        } catch(err) {
            if (err.response.status === 500) {
                console.log("server error");
            } else {
                console.log(err.response.data.msg);
            }
        }
    }

    const openFiles = (e) => {
        document.querySelector("#file-upload").click();
    }

    let show = showDetails ? <ShowDetails roomID={roomID} /> : null;
    return (
        <div className='chat'>
            <Backdrop show={showDetails} clicked={toggleInfo} />
            <ShowUsers socket={socket} user={user} users={availableUsers} />
            <div className='chat-main'>
                <Messages messages={messages} />

                <div className='compose'>
                    <form id="message-form" >
                        <textarea rows="1" name="message" type="text" placeholder="Message" value={message} onChange={handleInputChange} />
                        <SendIcon fontSize="large" className="control-icon" onClick={sendMessage} />
                        <InfoIcon fontSize="large" className="control-icon" onClick={toggleInfo} />

                        <input id="file-upload" type="file" onChange={addFile} style={{display: "none"}} />
                        <AttachmentIcon fontSize="large" className="control-icon" onClick={openFiles} />
                        
                    </form>
                    <Backdrop show={showPost} clicked={togglePost} />
                    <button onClick={togglePost}>Post</button>
                    <button onClick={changeTogglePerformance}>Performance</button>
                    { show }
                </div>
            </div>

            {
                showPost ? <Post socket={socket}
                            userId={user.id}
                            roomId={roomID}
                            showInfoMessage={showInfo}
                            setShowMessage={setShowInfoMessage}
                    /> : null
            }

            {
                showInfoMessage ? <InfoMessage>
                    <p>Question has been posted !</p>
                </InfoMessage> : null
            }

            {
                post ? <ShowPost userName={user.name} socket={socket} post={post} setPost={setPost} /> : null
            }

            {
                togglePerformance ? <ShowPerformance performance={performance} /> : null
            }
        </div>
    );
}

export default ChatRoom;