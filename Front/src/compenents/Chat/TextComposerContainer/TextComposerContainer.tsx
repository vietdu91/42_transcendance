import React from 'react';
import './TextComposerContainer.css'; // Import your CSS styles
import MessageInput from '../../Messages/messageInput';

import '../../utils/Wizz/Wizz.css';


const TextComposerContainer = ({ name, pfp, send, othername }) => {

    function goToProfile() {
        window.open(process.env.REACT_APP_LOCAL_F + `/profile`);
    }

    return (
        <div className="text-composer-container">
            <MessageInput send={send} othername={othername}/>
            <div className="profile-pic-reveiver-container" onClick={goToProfile}>
                <div className="profile-pic-receiver">
                    <img className="individual-conv-pfp" src={pfp} alt="individual-conv-pfp"></img>
                </div>
                <div className="channel-infos-user-name">
                    {name} ▸
                </div>
            </div>
        </div>
    );
};

export default TextComposerContainer;
