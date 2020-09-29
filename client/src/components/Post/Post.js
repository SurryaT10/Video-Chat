import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Post.css';
import AddBoxIcon from '@material-ui/icons/AddBox';
import RemoveBoxIcon from '@material-ui/icons/RemoveCircle';
import uuid from 'react-uuid';

const Post = (props) => {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState([]);
    const [answer, setAnswer] = useState("");
    const history = useHistory();
    
    const removeOption = (id) => {
        const updatedOptions = options.filter(option => option.id !== id);
        setOptions(updatedOptions);
    }

    const handleChange = (e, id) => {
        const updatedOptions = options.map(option => {
            if (option.id === id)
                option.value = e.target.value;
            return option;
        })

        setOptions(updatedOptions);
    }

    const postQuestion = (e) => {
        e.preventDefault();

        if (answer === "" || options.length === 0)
            return;

        const postDetails = {
            id: uuid(),
            question,
            options,
            answer
        }
        props.socket.emit("post question", { postDetails, roomId: props.roomId, userId: props.userId });
        props.setShowMessage(true);
        setQuestion("");
        setOptions([]);
        setAnswer("");

        props.showInfoMessage();
    }

    const getAnswer = (e, answer) => {
        setAnswer(answer);
    }

    // const showPerformance = () => {
    //     history.push("/performance", {
    //         data: {
    //             id: props.userId,
    //             post: props.post
    //         }
    //     })
    // }
    
    return (
        <form className="post" onSubmit={postQuestion}>

            <h2>Ask a Question?</h2>
            {/* <button onClick={showPerformance}>view performance</button> */}
            <input placeholder="Question" className="question" type="text" value={question} onChange={(e) => setQuestion(e.target.value)} required />
            <h4>Set Options</h4>
            <div className="options">
                {
                    options.map(option => {
                        let isDisabled=true;
                        if (option.value !== "")
                            isDisabled=false;
                        return (
                            <div id={option.id} key={option.id} className="option">
                                <input type="text" value={option.value} onChange={(e) => handleChange(e, option.id)} required />
                                <RemoveBoxIcon onClick={() => removeOption(option.id)} className="question-icons" fontSize="large" />
                                <input className="option" id={option.id} type="radio" name="option" disabled={isDisabled} onChange={(e) => getAnswer(e, option.value)} />
                                <div className="check"></div>
                            </div>
                        )
                    })
                }
            </div>
            
            <AddBoxIcon className="question-icons" fontSize="large" onClick={() => setOptions(prev => [...prev, { id: uuid(), value: "" }])} />

            <button className="post-btn">POST</button>

            {/* for users */}
            {/* <h3>Who is Surrya's favourite footballer ?</h3>
            {
                options.map(option => (
                    <div>
                        <input type="radio" key={option} name="option" value={option} />{option}
                    </div>
                ))
            } */}
        </form>
    );
}

export default Post;