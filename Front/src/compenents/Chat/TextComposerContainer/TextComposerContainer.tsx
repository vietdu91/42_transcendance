import React from 'react';
import './TextComposerContainer.css'; // Import your CSS styles

const TextComposerContainer = () => {
    return (
        <div className="text-composer-container">
            <div className="container-write-text">
                <div className="upper-part-write-text">
                    {/* Content for the upper part */}
                </div>
                <div className="middle-part-write-text">
                    {/* Content for the middle part */}
                </div>
                <div className="bottom-part-write-text">
                    {/* Content for the bottom part */}
                </div>
            </div>
            <div className="profile-pic-container-emitter">
                <div className="profile-pic-last-block">
                    {/* You can add content or image for the profile picture */}
                </div>
            </div>
        </div>
    );
};

export default TextComposerContainer;
