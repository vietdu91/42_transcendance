import React from 'react';
import { useState, useEffect, useContext } from 'react';
import './TextComposerContainer.css'; // Import your CSS styles
// import Wizz from '../../../img/chat/FAcejwHWEAMfcAO.jpeg'
import Wizz from '../../../img/chat/wizz.png'
import MessageInput from '../../Messages/messageInput';
import Cookies from 'js-cookie';
import { ChatContext } from '../../utils/ChatContext';


const TextComposerContainer = ({ name, pfp, send }) => {

    function goToProfile() {
        window.open(process.env.REACT_APP_LOCAL_F + `/profile`);
    }

    return (
        <div className="text-composer-container">
            <div className="container-write-text">
                <div className="upper-part-write-text">
                <img src={Wizz} alt="Wizz" />

                    {/* Content for the upper part */}
                </div>
                <div className="middle-part-write-text">
                    <MessageInput send={send}/>
                    {/* Content for the middle part */}
                </div>
                <div className="bottom-part-write-text">
                    {/* <input type="text" placeholder="search"></input> */}
                    {/* Content for the bottom part */}
                </div>
            </div>
            <div className="profile-pic-container-emitter" onClick={goToProfile}>
                <div className="profile-pic-last-block">
                    <img className="individual-conv-pfp" src={pfp} alt="individual-conv-pfp"></img>
                    {/* You can add content or image for the profile picture */}
                </div>
                <div className="My-name-in-conv">{name}</div> {/* Add a div for the name with a class */}
            </div>
        </div>
    );
};

export default TextComposerContainer;
