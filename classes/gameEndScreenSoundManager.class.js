/**
 * Manages sound functionality for game ending screens
 */
class GameEndScreenSoundManager {
    /**
     * Creates a new GameEndScreenSoundManager
     * @param {GameEndScreen} parentScreen - Reference to parent screen
     */
    constructor(parentScreen) {
        this.parentScreen = parentScreen;
    }

    /**
     * Stops all game sounds
     */
    stopAllSounds() {
        if (this.canUseWorldSoundStopper()) {
            this.useWorldSoundStopper();
        } else {
            this.useFallbackSoundStopper();
        }
        this.ensureAllSoundsStopped();
    }

    /**
     * Checks if the world has its own sound stopping method
     * @returns {boolean} Whether the world can stop sounds
     */
    canUseWorldSoundStopper() {
        return this.parentScreen.world && 
               typeof this.parentScreen.world.stopAllSounds === 'function';
    }

    /**
     * Uses the world's own sound stopping method
     */
    useWorldSoundStopper() {
        this.parentScreen.world.stopAllSounds();
    }

    /**
     * Uses fallback methods to stop all sounds
     */
    useFallbackSoundStopper() {
        SoundManager.stopAll();
        this.stopCharacterSound();
        this.stopNamedSounds();
        this.stopAllHtmlAudioElements();
    }

    /**
     * Stops the character's running sound
     */
    stopCharacterSound() {
        let world = this.parentScreen.world;
        if (world && world.character && world.character.runningSound) {
            world.character.runningSound.pause();
            world.character.runningSound.currentTime = 0;
        }
    }

    /**
     * Stops specific named sounds using the SoundManager
     */
    stopNamedSounds() {
        SoundManager.stop('chickenboss');
        SoundManager.stop('winning');
        SoundManager.stop('losing');
        SoundManager.stop('bossAlert');
        SoundManager.stop('snoring');
        SoundManager.stop('backgroundMusic');
    }

    /**
     * Stops all HTML audio elements on the page
     */
    stopAllHtmlAudioElements() {
        document.querySelectorAll('audio').forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    }
    
    /**
     * Additional check to ensure all audio is stopped
     */
    ensureAllSoundsStopped() {
        document.querySelectorAll('audio').forEach(audio => {
            try {
                audio.pause();
                audio.currentTime = 0;
            } catch (e) {
                console.warn('Error stopping audio:', e);
            }
        });
    }
}