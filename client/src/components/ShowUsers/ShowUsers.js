import React, { useState, useEffect } from 'react';
import { getBase64 } from '../../utils';
import GroupIcon from '@material-ui/icons/Group';
import './ShowUsers.css';

const ShowUsers = (props) => {
    const [currentUser, setCurrentUser] = useState({});
    

    useEffect(() => {
        setCurrentUser({
            id: props.user.id,
            name: props.user.name,
            img: props.user.img
        })
    },[props.user]);

    const openFiles = (e) => {
        document.querySelector("#profile-img-input").click();
    }

    const handleFileInput = async (e) => {
        const file = e.target.files[0];
        
        try {
            const base64Image = await getBase64(file);

            const user = {
                ...currentUser,
                img: base64Image
            }

            setCurrentUser(user)

            // send img to socket
            props.socket.emit("profile-image", user)

        } catch (err) {
            if (err.response.status === 500) {
                console.log("server error");
            } else {
                console.log(err.response.data.msg);
            }
        }
    }
    
    let users = [];

    if (props.users) {
        users = props.users.filter(user => user.userName !== currentUser.name);
    }

    return (
        <div id='sidebar' className='chat-sidebar'>
            <div className="users-title">
                <h3 className='list-title'>Users</h3>
                <GroupIcon fontSize="large" />
            </div>
            <ul className='users'>
                <li className="single-user">
                    <input id="profile-img-input" type="file" style={{display: "none"}} onChange={handleFileInput} />
                    <img onClick={openFiles} className="user-img" src={currentUser.img} alt="could'nt load" />
                    <p>{currentUser.name}</p>
                </li>
                {
                    users.map(user => (
                        <li key={user.id} className="single-user">
                            <img id={user.id} className="user-img" src={user.userImg} alt="could'nt load" />
                            <p>{user.userName}</p>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}

export default ShowUsers;