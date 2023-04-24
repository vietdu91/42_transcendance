import React from 'react';
import PropTypes from 'prop-types';

const MusicPlayer = ({ audioSrc, delay }) => {
  React.useEffect(() => {
    const audio = new Audio(audioSrc);
    const timeoutId = setTimeout(() => {
      audio.play();
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      audio.pause();
    };
  }, [audioSrc, delay]);

  return null;
};

MusicPlayer.propTypes = {
  audioSrc: PropTypes.string.isRequired,
  delay: PropTypes.number,
};

MusicPlayer.defaultProps = {
  delay: 0,
};

export default MusicPlayer;
