import React, { useState } from 'react';
import './ShowPost.css';

const ShowPost = (props) => {
    const [answer, setAnswer] = useState("");

    const submitAnswer = () => {
        if (!answer)
            return ;
        props.socket.emit("send answer", {
            userName: props.userName,
            roomId: props.roomId,
            postId: props.post.id,
            answer
        });
        props.setPost(null);
    }

    const post = (
        <div className="post-div">
            <h2>{props.post.question}</h2>
            {
                props.post.options.map(option => (
                    <div key={option.id}>
                        <input id={option.id} type="radio" value={option.value} name="option" onChange={(e) => setAnswer(e.target.value)} />
                        <label htmlFor={option.id}>{option.value}</label>
                    </div>
                ))
            }
            <button className="submit-btn" onClick={submitAnswer}>SUBMIT</button>
        </div>
    )
    return (
        <div className="show-post">
            { post }
        </div>
    );
}

export default ShowPost;