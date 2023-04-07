import southparkSound from '../sounds/theme_song.mp3';

export default function Music() {
	const audio = new Audio(southparkSound);
	audio.autoplay = true

	return (null);
}
