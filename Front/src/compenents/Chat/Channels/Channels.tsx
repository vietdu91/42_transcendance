import React from 'react';
import './Channels.css';
import RedCross from '../../../img/chat/redcross.png'
import Maximize from '../../../img/chat/rsz_1maximize_1.png'

function Channel (){
	return (
		<div className="channel-main-container">
			<div className="channel-bandeau">
				<ul className="reduce-maximize-quit">
				<li className="channel-name">Channel Name</li>
				<li><img src={RedCross} alt="redcross" id="chat_redcross" /></li>
                    <li><img src={Maximize} alt="maximize" id="chat_maximize" /></li>
                    <li><img src={RedCross} alt="redcross" id="chat_redcross" /></li>
				</ul>	
			</div>
			<div className="channel-actions">
				<ul>
					<li>File</li>
					<li>Edit</li>
					<li>Actions</li>
					<li>Tools</li>
				</ul>
			</div>
			<div className="channel-modo-mode">
				<ul>
					<li>Invite</li>
					<li>Ban</li>
					<li>A voir</li>
					<li>Image</li>
					<li>Image</li>
				</ul>
			</div>
			<div className="channel-conversation">
				<div className="channel-group-convo">
					<div className="channel-members-presentation"> {/*add le name du channel*/}
					</div>
					<div className="channel-conversation-messages">
						<ul>
							<li>sale pute</li>
							<li>nique ta mere mdr</li>
							<li>t'as triche sale fdp</li>
							<li>nword</li>
							<li>envoie ton adresse fdp</li>
						</ul>
					</div>
				</div>
				<div className="channel-profile-pic-and-member-list">
					<div className="channel-group-pic"></div>
					<div className="channel-group-member-list">
						<ul>
							<li>El racisto</li>
							<li>El inutil</li>
							<li>El solo mira a los mensajes</li>
							<li>El creador del group</li>
						</ul>
					</div>
				</div>
			</div>
			<div className="channel-send-messages-part">
				<div className="channel-input-text">{/*Add buttons*/}
					<div className="channel-left">

					</div>
					<div className="channel-right-buttons">
						<button className="button">Send</button>
					</div>
					{/* <button></button>
					<button></button> */}
				</div>
				<div className="channel-my-profile-pic"></div>
			</div>
		</div>
	)
}

export default Channel;