import React from 'react';
import './Channels.css';
import RedCross from '../../../img/chat/redcross.png'
import Maximize from '../../../img/chat/rsz_1maximize_1.png'
import Minimize from '../../../img/chat/minimized.jpg'
import scam from '../../../img/chat/scam-advertisement-small.jpg';
import regularConv from '../../../img/chat/regular-conv-icon.jpg';
import backgroundImage from '../../../img/chat/channel_wallpaper.png'; // Adjust the image path

function Channel() {
	return (
		<div className="channel-main-container">
			<div className="channel-bandeau">
				<ul className="reduce-maximize-quit">
					<li className="channel-name">Channel Name</li>
					<li><img src={Minimize} alt="redcross" id="chat_redcross" /></li>
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
			<div className="channel-modo-mode"><img src={scam} alt="scam" id="chat_scam" /></div>
			<div className="channel-conversation">
				<div className="channel-group-convo">
					<div className="channel-members-presentation"> {/*add le name du channel*/}
					</div>
					<div className="channel-conversation-messages">
						<ul>
							<div>name says: </div>
							<li>sale pute</li>
							<div>name says: </div>
							<li>nique ta mere mdr</li>
							<div>name says: </div>
							<li>t'as triche sale fdp</li>
							<div>name says: </div>
							<li>nword</li>
							<div>name says: </div>
							<li>envoie ton adresse fdp</li>
						</ul>
					</div>
				</div>
				<div className="channel-profile-pic-and-member-list">
					<div className="channel-group-pic-main-container">
						<div className="channel-group-pic-cadre">
							<div className="channel-pik">
								{/* Insert image du chat */}
							</div>
						</div>
					</div>
					<div className="channel-group-member-list">
						<ul>
							<li><img src={regularConv} alt="regularConv" id="chat_regularConv" />El racista</li>
							<li><img src={regularConv} alt="regularConv" id="chat_regularConv" />El inutil</li>
							<li><img src={regularConv} alt="regularConv" id="chat_regularConv" />El solo mira a los mensajes</li>
							<li><img src={regularConv} alt="regularConv" id="chat_regularConv" />El obsesionado</li>
							<li><img src={regularConv} alt="regularConv" id="chat_regularConv" />El que ya no va a la escuela </li>
							<li><img src={regularConv} alt="regularConv" id="chat_regularConv" />El creador del group</li>
						</ul>
					</div>
				</div>
			</div>
			<div className="channel-send-messages-part">
				<div className="channel-input-text">{/*Add buttons*/}
					<div className="channel-left">
						<span className="textarea" role="textbox" contentEditable ></span>
					</div>
					<div className="channel-right-buttons">
						<button className="button">Send</button>
					</div>
					{/* <button></button>
					<button></button> */}
				</div>
				<div className="channel-my-profile-pic-main-container">
					<div className="channel-my-profile-pic-group-pic-cadre">
						<div>
							{/* Insert image du chat */}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Channel;