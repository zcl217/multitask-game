import { GAME_BGM, GAME_OVER_SOUND } from "../audio/sounds";

export const checkIfIntersecting = (boundary1: DOMRect, boundary2: DOMRect, boundary1WidthOffset: number = 0, boundary1HeightOffset: number = 0) => {
    return !(
        ((boundary1.top + boundary1.height - boundary1HeightOffset) < (boundary2.top)) ||
        (boundary1.top > (boundary2.top + boundary2.height - boundary1HeightOffset)) ||
        ((boundary1.left + boundary1.width - boundary1WidthOffset) < boundary2.left) ||
        (boundary1.left > (boundary2.left + boundary2.width - boundary1WidthOffset))
    );
}

export const handleGameOverAudio = () => {
    if (GAME_BGM.playing()) {
        GAME_BGM.stop();
        GAME_OVER_SOUND.play();
    }
}