import React, { useState } from 'react';
import Cookies from "js-cookie";
import './Achievement.css'; // Import the CSS file for styling

const Achievement = () => {
	const token = Cookies.get('accessToken');
    if (!token)
        window.location.href = "http://localhost:3000/connect";
	const [title, setTitle] = useState('');
	const [score, setScore] = useState('');
	const [rare, setRare] = useState(false);
	const [achievementTriggered, setAchievementTriggered] = useState(false);

	const handleTitleChange = (event) => {
	  setTitle(event.target.value);
	};

	const handleScoreChange = (event) => {
	  setScore(event.target.value);
	};

	const handleRareChange = (event) => {
	  setRare(event.target.checked);
	};

	const handleAchievementTrigger = () => {
	//   setAchievementTriggered(true);
	  setTimeout(() => {
		setAchievementTriggered(false);
	  }, 12000);
	};

	const achievementSound = new Audio('https://dl.dropboxusercontent.com/s/8qvrpd69ua7wio8/XboxAchievement.mp3');
	const achievementSoundRare = new Audio('https://dl.dropboxusercontent.com/s/po1udpov43am81i/XboxOneRareAchievement.mp3');

	const handleTriggerButtonClick = () => {
	  achievementSound.play();
	  if (rare) {
		achievementSoundRare.play();
	  }
	  handleAchievementTrigger();
	};

  return (
    <div className={`achievement ${rare ? 'rare' : ''}`}>
      <div className="animation">
	  <div className="circle circle_animate">
		  <div className="img trophy_animate trophy_img">
		    <img className="trophy_1" src="https://dl.dropboxusercontent.com/s/k0n14tzcl4q61le/trophy_full.svg" alt="Trophy 1" />
		    <img className="trophy_2" src="https://dl.dropboxusercontent.com/s/cd4k1h6w1c8an9j/trophy_no_handles.svg" alt="Trophy 2" />
		  </div>
		  <div className="img xbox_img">
		    <img src="https://dl.dropboxusercontent.com/s/uopiulb5yeo1twm/xbox.svg?dl=0" alt="Xbox Logo" />
		  </div>
		  <div className="brilliant-wrap">
		    <div className="brilliant"></div>
		  </div>
		</div>
		<div className="banner banner-animate">
	  <div className="achieve_disp">
	    <span className="unlocked"></span>
	    <div className="score_disp">
	      <div className="gamerscore">
	        <img width="20px" src="https://dl.dropboxusercontent.com/s/gdqf5amvjkx9rfb/G.svg?dl=0" alt="Gamerscore Icon" />
	        <span className="achieve_score"></span>
	      </div>
	      <span className="hyphen_sep">-</span>
	      <span className="achiev_name"></span>
	    </div>
	  </div>
	</div>
      </div>
      <div className="content">
        <div className="content-settings">
          <h1>Xbox One Achievement</h1>
          <input
            value={title}
            onChange={handleTitleChange}
            className="content-settings__input"
            id="a_title"
            placeholder="Achievement"
            type="text"
          />
          <input
            value={score}
            onChange={handleScoreChange}
            className="content-settings__input"
            id="a_score"
            placeholder="Score"
            type="number"
          />
          <div className="content-settings__check">
            <input
              checked={rare}
              onChange={handleRareChange}
              type="checkbox"
              id="a_rare"
            />
            <label htmlFor="a_rare">
              Rare
            </label>
          </div>
          <button
            id="a_trigger"
            className="content-settings__button"
            onClick={handleTriggerButtonClick}
            disabled={achievementTriggered}
          >
            Trigger
          </button>
        </div>
      </div>
    </div>
);
}


export default Achievement;
