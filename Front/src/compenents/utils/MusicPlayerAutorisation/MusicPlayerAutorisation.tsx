import React, {useState} from 'react';
import PropTypes from 'prop-types';

const MusicPlayerAutorisation = ({ audioSrc, delay }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTogglePlay = () => {
    const audio = new Audio(audioSrc);
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="menu-item" onClick={handleTogglePlay}>
        {isPlaying ? 'Pause Music' : 'Play Music'}
    </div>
  );
};


MusicPlayerAutorisation.propTypes = {
  audioSrc: PropTypes.string.isRequired,
  delay: PropTypes.number,
};

MusicPlayerAutorisation.defaultProps = {
  delay: 0,
};

export default MusicPlayerAutorisation;
