
import { ReactComponent as SpeakerIcon } from './../assets/speakerIcon.svg';
import { ReactComponent as MuteIcon } from './../assets/muteIcon.svg';
import { useEffect, useState } from 'react';
import { GAME_BGM, HOME_SCREEN_BGM } from '../audio/sounds';

interface AudioControlProps {
    isInGame: boolean,
    isAudioOn: boolean,
    setIsAudioOn: (state: boolean) => void,
}

const AudioControl: React.FC<AudioControlProps> = (props) => {
    const { isInGame, isAudioOn, setIsAudioOn } = props;

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
