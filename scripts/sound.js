/**
 * Toggles sound state, updates UI, and saves preference to localStorage
 */
function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('soundEnabled', soundEnabled);
    updateSoundButtonUI();
    SoundManager.toggleSound(soundEnabled);
    if (world && world.startScreen && world.startScreen.backgroundMusic) {
        if (!soundEnabled) {
            world.startScreen.backgroundMusic.pause();
        }
    }
}

/**
 * Updates the sound button UI based on current sound state
 */
function updateSoundButtonUI() {
    let soundBtn = document.getElementById('soundBtn');
    let soundImage = soundBtn.querySelector('img');
    if (soundEnabled) {
        soundImage.classList.remove('disabled-icon');
    } else {
        soundImage.classList.add('disabled-icon');
    }
}

/**
 * Disables all game sounds
 */
function disableAllSounds() {
    SoundManager.toggleSound(false);
}

/**
 * Enables all game sounds
 */
function enableAllSounds() {
    SoundManager.toggleSound(true);
}

/**
 * Ensures all intervals are cleared and sounds are stopped
 */
function ensureAllIntervalsAndSoundsStopped() {
    if (world && world.intervallManager) {
        world.intervallManager.clearAllGameIntervals();
    }
    ensureAllSoundsStopped();
}

/**
 * Ensures all sounds in the game are properly stopped
 */
function ensureAllSoundsStopped() {
    if (world && world.soundManager) {
        world.soundManager.stopAllBackgroundSounds();
    } else {
        SoundManager.stopAll();
        SoundManager.stopBackgroundMusic();
        
        document.querySelectorAll('audio').forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    }
}

/**
 * Stops and reloads boss-specific sounds
 */
function stopBossSounds() {
    if (!SoundManager || !SoundManager.sounds) return;
    SoundManager.stop('chickenboss');
    SoundManager.stop('bossAlert');
    setTimeout(() => {
        if (typeof SoundManager.preload === 'function') {
            SoundManager.preload('chickenboss', './audio/chickenboss.mp3');
            SoundManager.preload('bossAlert', './audio/boss-alert.mp3');
        }
    }, 100);
}

/**
 * Disables sounds for all ChickenBoss enemies
 */
function disableBossEnemySounds() {
    if (!window.world || !window.world.level || !window.world.level.enemies) return;
    
    window.world.level.enemies.forEach(enemy => {
        if (enemy instanceof ChickenBoss) {
            enemy.soundDisabled = true;
            
            if (enemy.movement) {
                enemy.movement.lastMovementSoundTime = Date.now() + 10000;
            }
        }
    });
}

/**
 * Stops all sounds managed by SoundManager
 */
function stopAllManagedSounds() {
    if (SoundManager) {
        SoundManager.stopAll();
    }
}

/**
 * Stops all HTML audio elements directly in the DOM
 */
function stopAllDOMSounds() {
    document.querySelectorAll('audio').forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}


/**
 * Stops all game sounds
 */
function stopGameSounds() {
    world.stopAllBackgroundSounds();
}