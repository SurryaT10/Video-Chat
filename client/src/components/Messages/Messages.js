import React, { useRef, useEffect } from 'react';
import './Messages.css'

const Messages = (props) => {
    const containerRef = useRef(null);
    useEffect(() => {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    })
    return (
        <div ref={containerRef} className='chat-messages'>
            { props.messages }
        </div>
    )
};

export default Messages;