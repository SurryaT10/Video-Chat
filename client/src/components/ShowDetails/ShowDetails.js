import React from 'react';
import "./ShowDetails.css";

const ShowDetails = (props) => {
    const share = () => {
        window.open("https://web.whatsapp.com/", "_blank");
    }
    return (
        <div className="details">
            <h2>Joining Info</h2>
            <button onClick={share}>Share</button>
            <p>http://localhost:3000/{props.roomID}</p>
            <p>Room ID : {props.roomID}</p>
        </div>
    );
}

export default ShowDetails;