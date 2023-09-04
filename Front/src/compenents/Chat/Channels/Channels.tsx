import React from 'react';

function Channel (){
	return (
		<div className="channel-main-container">
			<div className="channel-bandeau"> </div>
			<div className="channel-actions"></div>
			<div className="channel-conversation">
				<div className="channel-group-convo"></div>
				<div className="channel-profile-pic"></div>
			</div>
			<div className="channel-send-messsages-part">
				<div className="channel-input-text">{/*Add buttons*/}
					<button></button>
					<button></button>
				</div>
				<div className="channel-my-profile-pic"></div>
			</div>
		</div>
	)
}

export default Channel;