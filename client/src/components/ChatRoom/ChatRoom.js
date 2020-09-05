import React, { useState, useEffect } from 'react';

const ChatRoom = (props) => {
    useEffect(() => {
        console.log(props);
    });
    return (
        <div>
            Chat
        </div>
    );
}

export default ChatRoom;