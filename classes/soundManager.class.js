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
        this.enabled = true;
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
        let audio;
        
        if (this.sounds[nameOrPath]) {
            audio = this.sounds[nameOrPath];
        } else {
            audio = new Audio(nameOrPath);
            audio.loop = loop;
        }
        
        audio.volume = volume;
        
        audio.play().catch(error => {
            console.error(`Error playing sound: ${nameOrPath}`, error);
        });
        
        return audio;
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
    this.enabled = enabled;
    document.querySelectorAll('audio').forEach(audio => {
        audio.muted = !enabled;
        if (!enabled) {
            audio.pause();
            audio.currentTime = 0; 
        }
    });
    for (let name in this.sounds) {
        let sound = this.sounds[name];
        if (!enabled) {
            sound.pause();
            sound.currentTime = 0; 
            sound.dataset.wasPlaying = 'false';
        } else if (sound.dataset.wasPlaying === 'true') {
            sound.play().catch(e => console.error("Couldn't resume sound:", e));
            sound.dataset.wasPlaying = 'false';
        }
    }
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