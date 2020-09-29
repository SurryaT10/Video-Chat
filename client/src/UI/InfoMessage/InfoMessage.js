import React from 'react';
import "./InfoMessage.css";

const InfoMessage = (props) => (
    <div className="info-card">
        { props.children }
    </div>
);

export default InfoMessage;