/**
 * Centralized sound management system for the game
 * Handles playing, stopping, and toggling all game sounds
 */
class SoundManager {
    static sounds = {};
    static enabled = true;

    /**
     * Initializes the sound manager with default settings and preloads common sounds
     */
    static init() {
        this.enabled = localStorage.getItem('soundEnabled') !== 'false';
        this.sounds = {};

        this.preload('hit', './audio/hit.wav');
        this.preload('jump', './audio/jump.wav');
        this.preload('collect', './audio/collect.mp3');
        this.preload('collectBottle', './audio/collectBottle.mp3');
        this.preload('running', './audio/running-1-6846.mp3');
        this.preload('winning', './audio/winning.wav');
        this.preload('losing', './audio/losing.wav');
        this.preload('backgroundMusic', './audio/backgroundMusic.mp3', true);
        this.preload('punch', './audio/punch-140236.mp3');
        this.preload('snoring', './audio/snoring.mp3', true);
        this.preload('chickenboss', './audio/chickenboss.mp3');
        this.preload('bossAlert', './audio/boss-alert.mp3');
        this.preload('chickenDeath', './audio/chicken death.mp3');
    }

    /**
     * Preloads a sound file for later use
     * @param {string} name - Identifier for the sound
     * @param {string} path - File path to the sound
     * @param {boolean} loop - Whether sound should loop
     */
    static preload(name, path, loop = false) {
        let audio = new Audio(path);
        audio.loop = loop;
        this.sounds[name] = audio;
    }

    /**
     * Plays a sound if sounds are enabled
     * @param {string} nameOrPath - Either a preloaded sound name or a file path
     * @param {number} volume - Volume level (0-1)
     * @param {boolean} loop - Whether sound should loop
     * @returns {HTMLAudioElement|null} Audio element or null if disabled
     */
    static play(nameOrPath, volume = 0.2, loop = false) {
        if (!this.enabled) return null;

        let audio = this.getAudioElement(nameOrPath, loop);
        this.configureAudio(audio, nameOrPath, volume, loop);
        this.playAudioWithErrorHandling(audio, nameOrPath);

        return audio;
    }

    /**
     * Gets the appropriate audio element based on the name or path
     * @param {string} nameOrPath - Name of preloaded sound or file path
     * @param {boolean} loop - Whether sound should loop
     * @returns {HTMLAudioElement} Audio element to use
     * @private
     */
    static getAudioElement(nameOrPath, loop) {
        if (this.sounds[nameOrPath]) {
            if (!this.sounds[nameOrPath].paused &&
                (nameOrPath === 'collect' || nameOrPath === 'collectBottle')) {
                return new Audio(this.sounds[nameOrPath].src);
            } else {
                return this.sounds[nameOrPath];
            }
        } else {
            let audio = new Audio(nameOrPath);
            audio.loop = loop;
            return audio;
        }
    }

    /**
     * Configures audio properties
     * @param {HTMLAudioElement} audio - The audio element to configure
     * @param {string} nameOrPath - Name or path of the sound
     * @param {number} volume - Volume level (0-1)
     * @param {boolean} loop - Whether sound should loop
     * @private
     */
    static configureAudio(audio, nameOrPath, volume, loop) {
        audio.volume = volume;
        audio.loop = loop;

        audio.addEventListener('error', (error) => {
            console.error(`Error loading or playing sound: ${nameOrPath}`, error);
        });
    }

    /**
     * Plays the audio with error handling
     * @param {HTMLAudioElement} audio - The audio element to play
     * @param {string} nameOrPath - Name or path of the sound for error reporting
     * @private
     */
    static playAudioWithErrorHandling(audio, nameOrPath) {
        audio.play()
            .catch(error => {
                console.error(`Error playing sound: ${nameOrPath}`, error);
            });
    }

    /**
     * Stops a specific sound
     * @param {string} name - Name of the preloaded sound to stop
     */
    static stop(name) {
        if (this.sounds[name]) {
            this.sounds[name].pause();
            this.sounds[name].currentTime = 0;
        }
    }

    /**
     * Toggles all game sounds on or off
     * @param {boolean} enabled - Whether sound should be enabled
     */
    static toggleSound(enabled) {
        this.updateSoundState(enabled);
        this.handleDomAudioElements(enabled);
        this.handlePreloadedSounds(enabled);
    }

    /**
     * Updates the global sound state
     * @param {boolean} enabled - Whether sound should be enabled
     * @private
     */
    static updateSoundState(enabled) {
        this.enabled = enabled;
    }

    /**
     * Handles DOM audio elements when toggling sound
     * @param {boolean} enabled - Whether sound should be enabled
     * @private
     */
    static handleDomAudioElements(enabled) {
        document.querySelectorAll('audio').forEach(audio => {
            audio.muted = !enabled;
            if (!enabled) {
                this.stopAudio(audio);
            }
        });
    }

    /**
     * Handles preloaded sounds when toggling sound
     * @param {boolean} enabled - Whether sound should be enabled
     * @private
     */
    static handlePreloadedSounds(enabled) {
        for (let name in this.sounds) {
            let sound = this.sounds[name];
            if (!enabled) {
                this.disableSound(sound);
            } else {
                this.enableSound(sound);
            }
        }
    }

    /**
     * Disables a specific sound
     * @param {HTMLAudioElement} sound - The sound to disable
     * @private
     */
    static disableSound(sound) {
        sound.pause();
        sound.currentTime = 0;
        sound.dataset.wasPlaying = 'false';
    }

    /**
     * Enables a specific sound
     * @param {HTMLAudioElement} sound - The sound to enable
     * @private
     */
    static enableSound(sound) {
        if (sound.dataset.wasPlaying === 'true') {
            sound.play().catch(e => console.error("Couldn't resume sound:", e));
            sound.dataset.wasPlaying = 'false';
        }
    }

    /**
     * Stops an audio element
     * @param {HTMLAudioElement} audio - The audio element to stop
     * @private
     */
    static stopAudio(audio) {
        audio.pause();
        audio.currentTime = 0;
    }

    /**
     * Stops all sounds
     */
    static stopAll() {
        // Stop preloaded sounds
        for (let name in this.sounds) {
            this.stop(name);
        }

        document.querySelectorAll('audio').forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    }

    /**
     * Plays the background music
     */
    static playBackgroundMusic() {
        this.play('backgroundMusic', 0.2, true);
    }

    /**
     * Stops the background music
     */
    static stopBackgroundMusic() {
        this.stop('backgroundMusic');
    }
}