import { Howl } from 'howler';

const totalFiles = 3;
export let filesLoaded = 0;

export const HOME_SCREEN_BGM = new Howl({
    src: ['./audio/life.mp3'],
    loop: true,
    onload: () => { filesLoaded++ }
});

export const GAME_BGM = new Howl({
    src: ['./audio/destination.mp3'],
    loop: true,
    onload: () => { filesLoaded++ }
});

export const GAME_OVER_SOUND = new Howl({
    src: ['./audio/recordScratch.mp3'],
    onload: () => { filesLoaded++ }
});