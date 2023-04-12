import { useEffect } from 'react';

const MusicPlayer = ({ audioSrc }) => {
  useEffect(() => {
    const audio = new Audio(audioSrc);
    audio.play();

    return () => {
      audio.pause();
    };
  }, [audioSrc]);

  return null;
};

export default MusicPlayer;
