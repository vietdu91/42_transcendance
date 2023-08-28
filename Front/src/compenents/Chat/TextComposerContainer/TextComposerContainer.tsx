import React from 'react';
import './TextComposerContainer.css'; // Import your CSS styles
// import Wizz from '../../../img/chat/FAcejwHWEAMfcAO.jpeg'
import Wizz from '../../../img/chat/wizz.png'

const TextComposerContainer = ({ name }) => {
    return (
        <div className="text-composer-container">
            <div className="container-write-text">
                <div className="upper-part-write-text">
                <img src={Wizz} alt="Wizz" />

                    {/* Content for the upper part */}
                </div>
                <div className="middle-part-write-text">
                    {/* Content for the middle part */}
                </div>
                <div className="bottom-part-write-text">
                    <input type="text" placeholder="search"></input>
                    {/* Content for the bottom part */}
                </div>
            </div>
            <div className="profile-pic-container-emitter">
                <div className="profile-pic-last-block">
                    {/* You can add content or image for the profile picture */}
                </div>
                {name}
            </div>
        </div>
    );
};

export default TextComposerContainer;
