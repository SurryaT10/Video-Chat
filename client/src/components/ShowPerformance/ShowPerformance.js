import React, { useEffect, useState } from 'react';
import uuid from 'react-uuid';
import "./ShowPerformance.css";

const ShowPerformance = (props) => {
    const [post, setPost] = useState(
        // {
        //     id: 1,
        //     question: "Messi v Ronaldo?",
        //     users: [
        //         {
        //             id: 1,
        //             name: "surrya",
        //             result: true
        //         }, {
        //             id: 2,
        //             name: "Naruto",
        //             result: false
        //         }, {
        //             id: 3,
        //             name: "Sasuke",
        //             result: true
        //         }, {
        //             id: 4,
        //             name: "Itachi",
        //             result: false
        //         }
        //     ]
        // }
    );

    // useEffect(() => {
    //     axios.get("http://localhost:5000/posts/"+props.location.state.data.id)
    //     .then(res => {
    //         setPost(res.data)
    //     })
    //     .catch(err => console.log(err))
    // }, [])


    useEffect(() => {
        setPost(props.performance);
    });

    
    let performance = null;
    
    if (post) {
        performance = 
            (
                <div className="performance-div">
                    <h2>{post.question}</h2>
                    {
                        post.users ? post.users.map(user => {
                            let color = user.result ? "green" : "red";
                            
                            return (
                                <div key={uuid()} style={{
                                    background: color
                                }} className="post-result">
                                    <h4>{user.userName}</h4>
                                    <p>{user.result ? "Correct" : "Wrong"}</p>
                                </div>
                            )
                        }) : null
                    }
                </div>
            )
    }

    return (
        <div className="performance">
            {performance}
        </div>
    );
}

export default ShowPerformance;