import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './Tab.css';

import WaveSound from '../../../img/icons/wave-sound.jpg'
import Sound from '../../../img/icons/sound.png'
import Sound_no from '../../../img/icons/sound_no.png'

function Tab({ sound, delay }) {
  const [isTabOpen, setIsTabOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleTab = () => {
    setIsTabOpen(!isTabOpen);
    console.log("Open : " + isTabOpen);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  //////////////////////////////////////////////
  const MusicPlayerAutorisation = ({ audioSrc, delay }) => {

    const [isPlaying, setIsPlaying] = useState(false);

    const audio = new Audio(audioSrc);
  
    const playAudioWithDelay = (delay) => {
      setTimeout(() => {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.error('Erreur lors de la lecture audio :', error);
        });
      }, delay);
    };
  
    const handleTogglePlay = () => {
      if (!isPlaying) {
        playAudioWithDelay(delay);
      }
      else
      {
        audio.pause();
        setIsPlaying(false);
      }
        

    };

    return (
      <span onClick={handleTogglePlay}>
          {isPlaying ? 
            <img alt="tab-sound" className="tab-sound" src={Sound_no}></img> : 
            <img alt="tab-sound" className="tab-sound" src={Sound}></img>}
      </span>
    );
  };
  
  MusicPlayerAutorisation.propTypes = {
    audioSrc: PropTypes.string.isRequired,
    delay: PropTypes.number,
  };
  
  MusicPlayerAutorisation.defaultProps = {
    delay: 0,
  };

  //////////////////////////////////////////

  return (
    <div className="tab-container">
      <div className={`tab ${isTabOpen ? 'open' : ''}`}>
        <span className="tab-touch" onClick={toggleTab}></span>
        <img alt="wave" className="tab-wave" src={WaveSound}></img>
        <div className="tab-content">
          {isTabOpen && <MusicPlayerAutorisation audioSrc={sound} delay={1500}/>}
        </div>
      </div>
    </div>
  );
}

Tab.propTypes = {
    sound: PropTypes.string.isRequired,
    delay: PropTypes.number,
  };
  
  Tab.defaultProps = {
    delay: 0,
  };

export default Tab;