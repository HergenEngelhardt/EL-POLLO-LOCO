let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let soundEnabled = true;

/**
 * Initializes the game by setting up the canvas, creating the world,
 * and attaching event listeners to UI elements
 */
/**
 * Initializes the game by setting up the canvas, world, and UI event listeners
 */
function init() {
    soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    setupGameObjects();
    setupEventListeners();
    initMobileControls();
    checkMobileAlignment();
    document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);
    document.getElementById('soundBtn').addEventListener('click', toggleSound);
    SoundManager.init();
    SoundManager.enabled = soundEnabled;
    updateSoundButtonUI();
}

/**
 * Sets up the main game objects (canvas and world)
 */
function setupGameObjects() {
    canvas = document.getElementById('gameCanvas');
    world = new World(canvas, keyboard);
}

/**
 * Sets up event listeners for UI elements
 */
function setupEventListeners() {
    document.getElementById('instructions-btn').addEventListener('click', toggleInstructions);
    document.getElementById('imprint-btn').addEventListener('click', toggleImprint);
}

/**
 * Appends content to the imprint element with a back button
 * @param {HTMLElement} imprintElement - The imprint panel element
 * @param {string} data - The content to append
 */
function appendContentWithBackButton(imprintElement, data) {
    let backButtonHTML = '<button class="btn" onclick="showMenu()">Back to Menu</button>';
    imprintElement.innerHTML = data + backButtonHTML;
    imprintElement.classList.add('loaded');
}

/**
 * Toggles fullscreen mode for the game
 */
function toggleFullscreen() {
    let gameCanvas = document.getElementById('gameCanvas');

    if (!document.fullscreenElement) {
        enterFullscreen(gameCanvas);
    } else {
        exitFullscreen();
    }
}

/**
 * Enters fullscreen mode for the specified element
 * @param {HTMLElement} element - The element to display in fullscreen
 */
function enterFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

/**
 * Exits fullscreen mode
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

/**
 * Hides all UI panels
 */
function hideAllPanels() {
    document.getElementById('instructions').classList.add('d-none');
    document.getElementById('imprint').classList.add('d-none');
    document.getElementById('win-loose').classList.add('d-none');
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
 * Thoroughly stops all game sounds and prevents sound leakage between game sessions
 */
function ensureAllSoundsStopped() {
    // Stoppt explizit den Boss-Sound und erstellt ihn neu
    if (SoundManager && SoundManager.sounds) {
        SoundManager.stop('chickenboss');
        SoundManager.stop('bossAlert');
        
        // Rekonstruiere den ChickenBoss-Sound
        setTimeout(() => {
            if (typeof SoundManager.preload === 'function') {
                SoundManager.preload('chickenboss', './audio/chickenboss.mp3');
                SoundManager.preload('bossAlert', './audio/boss-alert.mp3');
            }
        }, 100);
    }
    
    // Deaktiviere Sound für alle Boss-Instanzen
    if (window.world && window.world.level && window.world.level.enemies) {
        window.world.level.enemies.forEach(enemy => {
            if (enemy instanceof ChickenBoss) {
                enemy.soundDisabled = true;
                if (enemy.movement) {
                    enemy.movement.lastMovementSoundTime = Date.now() + 10000; // 10 Sekunden Cooldown
                }
            }
        });
    }
    
    // Rest der Sounds stoppen
    SoundManager.stopAll();
    
    // Audio DOM-Elemente stoppen
    document.querySelectorAll('audio').forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}

/**
 * Shows the main menu and hides other elements
 */
function showMenu() {
    ensureAllIntervalsAndSoundsStopped();
    hideGameElements();
    showMenuElements();
    resetGameState();
    ensureWorldInitialized();
}

/**
 * Hides all game-related UI elements
 */
function hideGameElements() {
    document.getElementById('instructions').classList.add('d-none');
    document.getElementById('imprint').classList.add('d-none');
    document.getElementById('win-loose').classList.add('d-none');
    document.getElementById('mobileMenu').classList.add('d-none');
    document.getElementById('soundBtn').classList.add('d-none');
    document.getElementById('menuBtn').classList.add('d-none');
}

/**
 * Shows menu-related UI elements
 */
function showMenuElements() {
    document.getElementById('mobileMenuBtn').classList.remove('d-none');
    document.querySelector('.button-container').classList.remove('d-none');
}

/**
 * Resets the game state when returning to menu
 */
function resetGameState() {
    if (world) {
        stopGameIntervals();
        stopGameSounds();
        resetGameFlags();
        world.draw();
    }
}

/**
 * Stops all game intervals
 */
function stopGameIntervals() {
    if (world && world.intervallManager) {
        stopMainGameIntervals();
        stopCharacterIntervals();
        stopEnemyIntervals();
    }
}

/**
 * Stops main game intervals using the interval manager
 */
function stopMainGameIntervals() {
    world.intervallManager.clearAllGameIntervals();
}

/**
 * Stops character-specific animation intervals
 */
function stopCharacterIntervals() {
    if (world.character && world.character.animationInterval) {
        clearInterval(world.character.animationInterval);
        world.character.animationInterval = null;
    }
}

/**
 * Stops all enemy-related animation and movement intervals
 */
function stopEnemyIntervals() {
    if (world.level && world.level.enemies) {
        world.level.enemies.forEach(enemy => {
            stopSingleEnemyIntervals(enemy);
        });
    }
}

/**
 * Stops all intervals for a single enemy
 * @param {Object} enemy - The enemy object
 */
function stopSingleEnemyIntervals(enemy) {
    if (enemy.animationInterval) {
        clearInterval(enemy.animationInterval);
        enemy.animationInterval = null;
    }
    if (enemy.movementInterval) {
        clearInterval(enemy.movementInterval);
        enemy.movementInterval = null;
    }
}

/**
 * Stops all game sounds
 */
function stopGameSounds() {
    world.stopAllBackgroundSounds();
}

/**
 * Resets game state flags
 */
function resetGameFlags() {
    world.gameStarted = false;
    world.gameOver = false;
    world.gameWon = false;
}

/**
 * Ensures the world is initialized
 */
function ensureWorldInitialized() {
    if (!world) {
        init();
    }
}

/**
 * Restarts the game after winning or losing
 * Hides the result screen and resets the game state
 */
function playAgain() {
    ensureAllIntervalsAndSoundsStopped();
    document.getElementById('win-loose').classList.add('d-none');
    resetGameState();
    world = new World(canvas, keyboard);
    world.startGame();
}

/**
 * Restarts the game by completely reinitializing the world
 */
function restartGame() {
    if (world) {
        SoundManager.stopAll();
        SoundManager.stop('chickenboss');
        SoundManager.stop('bossAlert');
        if (world.character && world.character.runningSound) {
            world.character.runningSound.pause();
            world.character.runningSound.currentTime = 0;
        }
        stopGameIntervals();
        stopGameSounds();
        world = null;
        setupGameObjects();
        document.getElementById('soundBtn').classList.remove('d-none');
        document.getElementById('menuBtn').classList.remove('d-none');
        document.querySelector('.button-container').classList.add('d-none');
        if (world && world.intervallManager) {
            world.intervallManager.updateReferences(world);
        }
        world.startGame();
    } else {
        init();
    }
}

/**
 * Starts the game
 */
function startGame() {
    document.getElementById('soundBtn').classList.remove('d-none');
    document.getElementById('menuBtn').classList.remove('d-none');
    document.querySelector('.button-container').classList.add('d-none');
}

/**
 * Stops the current game and resets game state
 */
function stopGame() {
    ensureAllIntervalsAndSoundsStopped();
    resetGameFlags();
}

/**
 * Returns to the main menu from the game
 * Hides the result screen and completely resets game state
 */
function backToMenu() {
    ensureAllIntervalsAndSoundsStopped();
    document.getElementById('win-loose').classList.add('d-none');
    resetGameFlags();
    showMenuElements();
    hideGameElements();
    world.draw();
}

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
 * Enables all game sounds
 */
function enableAllSounds() {
    SoundManager.toggleSound(true);
}

/**
 * Disables all game sounds
 */
function disableAllSounds() {
    SoundManager.toggleSound(false);
}

