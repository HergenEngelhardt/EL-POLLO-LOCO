/**
 * Represents a background element in the game.
 * @extends MovableObject
 */
class Background extends MovableObject {
    width = 720;
    height = 480;

    /**
     * Creates a new background element.
     * @param {string} imagePath - Path to the background image
     * @param {number} x - X-coordinate position
     * @param {number} [yPosition] - Optional Y-coordinate position (defaults to bottom of canvas)
     */
    constructor(imagePath, x, yPosition) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = yPosition !== undefined ? yPosition : 480 - this.height;
    }

    /**
     * Overrides the draw method to prevent rendering in portrait mode on mobile
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    draw(ctx) {
        if (this.shouldRender()) {
            super.draw(ctx);
        }
    }

    /**
     * Determines if the background should render based on device orientation
     * @returns {boolean} True if rendering should proceed, false otherwise
     */
    shouldRender() {
        if (this.isInPortraitMode()) {
            return false;
        }
        return true;
    }

    /**
     * Checks if device is in portrait mode on mobile
     * @returns {boolean} True if in portrait mode on mobile
     */
    isInPortraitMode() {
        try {
            let orientationMessage = document.getElementById('orientation-message');
            if (orientationMessage && !orientationMessage.classList.contains('d-none')) {
                return true;
            }

            if (typeof isMobileDevice === 'function' && isMobileDevice() && window.innerHeight > window.innerWidth) {
                return true;
            }
        } catch (error) {
            console.error('Error checking portrait mode:', error);
        }

        return false;
    }
}

/**
 * Thoroughly stops all game sounds and prevents sound leakage between game sessions
 * This function should be called before restarting the game
 */
function ensureAllSoundsStopped() {
    window.lastSoundStopTime = new Date().getTime();
    
    stopSoundManagerSounds();
    stopDOMSounds();
    resetGameScreenSoundStates();
    stopCharacterSounds();
    stopEnemySounds();
}

/**
 * Stops all sounds managed by the SoundManager
 */
function stopSoundManagerSounds() {
    if (typeof SoundManager === 'undefined') return;
    SoundManager.stopAll();
    stopCriticalSounds();
}

/**
 * Stops critical sounds that might persist between game sessions
 */
function stopCriticalSounds() {
    let criticalSounds = ['backgroundMusic', 'snoring', 'chickenboss', 'bossAlert', 'running'];
    criticalSounds.forEach(sound => {
        stopSpecificSound(sound);
    });
}

/**
 * Stops a specific sound and rebuilds it if necessary
 * @param {string} sound - Sound identifier
 */
function stopSpecificSound(sound) {
    if (!SoundManager.sounds || !SoundManager.sounds[sound]) return;
    
    SoundManager.sounds[sound].pause();
    SoundManager.sounds[sound].currentTime = 0;
    
    if (sound === 'chickenboss') {
        rebuildChickenBossSound();
    }
}

/**
 * Rebuilds chicken boss sound to prevent persistence issues
 */
function rebuildChickenBossSound() {
    SoundManager.sounds['chickenboss'] = null;
    delete SoundManager.sounds['chickenboss'];
    
    if (typeof SoundManager.preload === 'function') {
        SoundManager.preload('chickenboss', './audio/chickenboss.mp3');
    }
}

/**
 * Stops all audio elements directly in the DOM
 */
function stopDOMSounds() {
    let audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}

/**
 * Resets sound state flags in game screens
 */
function resetGameScreenSoundStates() {
    if (!window.world) return;
    
    if (window.world.gameOverScreen) {
        window.world.gameOverScreen.soundPlayed = false;
    }

    if (window.world.gameWinScreen) {
        window.world.gameWinScreen.soundPlayed = false;
    }
}

/**
 * Stops character-specific sounds
 */
function stopCharacterSounds() {
    if (!window.world || !window.world.character) return;
    
    let character = window.world.character;
    stopSoundIfExists(character.runningSound);
    stopSoundIfExists(character.snoringSound);
}

/**
 * Stops a sound if it exists
 * @param {HTMLAudioElement} sound - Sound element to stop
 */
function stopSoundIfExists(sound) {
    if (!sound) return;
    
    sound.pause();
    sound.currentTime = 0;
}

/**
 * Stops sounds from enemy characters
 */
function stopEnemySounds() {
    if (!window.world || !window.world.level || !window.world.level.enemies) return;
    
    window.world.level.enemies.forEach(enemy => {
        if (enemy instanceof ChickenBoss) {
            disableChickenBossSounds(enemy);
        }
    });
}

/**
 * Disables sounds for a chicken boss enemy
 * @param {ChickenBoss} boss - The boss to disable sounds for
 */
function disableChickenBossSounds(boss) {
    boss.soundDisabled = true;
    
    if (boss.alertSound) {
        stopSoundIfExists(boss.alertSound);
    }
}