
import { ReactComponent as SpeakerIcon } from './../assets/speakerIcon.svg';
import { ReactComponent as MuteIcon } from './../assets/muteIcon.svg';
import { useEffect, useState } from 'react';
import { GAME_BGM, HOME_SCREEN_BGM } from '../audio/sounds';

interface AudioControlProps {
    isInGame: Boolean
}

// if we were already playing the BGM on another screen, we want to auto start it
// otherwise, we leave it muted
// TODO: have to have a different variable keep track of whether BGM is playing or not cuz
// game bgm ends on defeat
const audioStateHandler = () => {
    const isAudioOn = HOME_SCREEN_BGM.playing() || GAME_BGM.playing();
    if (isAudioOn) {
        HOME_SCREEN_BGM.stop();
        GAME_BGM.stop();
    }
    return isAudioOn;
}

const AudioControl: React.FC<AudioControlProps> = (props) => {
    const { isInGame } = props;
    const [isAudioOn, setIsAudioOn] = useState(false);

    useEffect(() => {
        // doesn't work if we pass in audioStateHandler() into useState directly
        setIsAudioOn(audioStateHandler());
    }, []);

    useEffect(() => {
        if (isAudioOn) {
            isInGame ? GAME_BGM.play() : HOME_SCREEN_BGM.play();
        } else {
            isInGame ? GAME_BGM.pause() : HOME_SCREEN_BGM.pause();
        }
    }, [isAudioOn]);
    
    return (
        <div className="absolute z-50 cursor-pointer top-[1%] right-[1%]" >
            {isAudioOn ?
                <SpeakerIcon
                    className="w-10 h-10"
                    onClick={() => setIsAudioOn(false)}
                /> :
                <MuteIcon
                    className="w-10 h-10"
                    onClick={() => setIsAudioOn(true)}
                />}

        </div>

    );
}

export default AudioControl;
