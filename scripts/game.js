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
        if (gameCanvas.requestFullscreen) {
            gameCanvas.requestFullscreen();
        } else if (gameCanvas.webkitRequestFullscreen) {
            gameCanvas.webkitRequestFullscreen();
        } else if (gameCanvas.msRequestFullscreen) {
            gameCanvas.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
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
 * Shows the main menu and hides other elements
 */
function showMenu() {
    document.getElementById('instructions').classList.add('d-none');
    document.getElementById('imprint').classList.add('d-none');
    document.getElementById('win-loose').classList.add('d-none');
    document.getElementById('mobileMenu').classList.add('d-none');
    document.querySelector('.button-container').classList.remove('d-none');
    
    if (world) {
        stopGame();
    }

    if (!world) {
        init();
    }
}

/**
 * Restarts the game after winning or losing
 * Hides the result screen and resets the game state
 */
function playAgain() {
    document.getElementById('win-loose').classList.add('d-none');
    world.gameOver = false;
    world.startGame();
}

/**
 * Restarts the game
 */
function restartGame() {
    if (world) {
        stopGame();
    }
    init();
}

/**
 * Starts the game
 */
function startGame() {
    document.getElementById('soundBtn').classList.remove('d-none');
    document.querySelector('.button-container').classList.add('d-none');
}

/**
 * Stops the current game and resets game state
 */
function stopGame() {
    if (world) {
        world.gameStarted = false;
        world.gameOver = false;
        world.gameWon = false;
        
        world.stopAllBackgroundSounds();
        
        world.clearAllGameIntervals();
    }
}

/**
 * Returns to the main menu from the game
 * Hides the result screen and resets game state to initial values
 */
function backToMenu() {
    document.getElementById('win-loose').classList.add('d-none');
    world.gameStarted = false;
    world.gameOver = false;
    world.draw();
}
/**
 * Toggles the visibility of the mobile menu
 * Shows the menu if it's hidden, hides it if it's visible
 */
function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('d-none');
}

/**
 * Explicitly closes the mobile menu by hiding it
 * Uses both CSS class and inline style to ensure the menu is hidden
 */
function closeMobileMenu() {
    let mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.add('d-none');
        mobileMenu.style.display = 'none';
    }
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

/**
 * Displays the instructions panel and hides other UI elements
 * Shows instructions while ensuring imprint and mobile menu remain hidden
 */
function showInstructions() {
    document.getElementById('instructions').classList.remove('d-none');
    document.getElementById('imprint').classList.add('d-none');
    document.getElementById('mobileMenu').classList.add('d-none');
}

/**
 * Sets up event listeners for mobile menu buttons when DOM is fully loaded
 * Attaches click handlers to the mobile menu toggle and close buttons
 */
document.addEventListener('DOMContentLoaded', function () {
    let menuBtn = document.getElementById('mobileMenuBtn');
    if (menuBtn) {
        menuBtn.addEventListener('click', toggleMobileMenu);
    }
    let closeBtn = document.querySelector('#mobileMenu .mobile-menu-btn:last-child');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMobileMenu);
    }
});

/**
 * Checks device orientation and displays a message 
 * when the device is held in portrait mode
 */
function checkMobileAlignment() {
    if (isMobileDevice()) {
        let orientationMessage = getOrientationMessageElement();
        if (orientationMessage) {
            setupOrientationHandling(orientationMessage);
        }
    }
}

/**
 * Checks if the current device is a mobile device
 * @returns {boolean} True if mobile device, false otherwise
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth <= 1024;
}

/**
 * Finds the orientation message element in the DOM
 * @returns {HTMLElement|null} The orientation message element or null
 */
function getOrientationMessageElement() {
    let orientationMessage = document.getElementById('orientation-message');
    if (!orientationMessage) {
        console.error('Orientation message element not found');
        return null;
    }
    return orientationMessage;
}

/**
 * Sets up orientation monitoring for a given element
 * @param {HTMLElement} orientationMessage - The orientation message element
 */
function setupOrientationHandling(orientationMessage) {
    function updateOrientation() {
        if (window.innerHeight > window.innerWidth) {
            orientationMessage.classList.remove('d-none');
            orientationMessage.style.display = 'flex';
        } else {
            orientationMessage.classList.add('d-none');
        }
    }

    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', () => {
        setTimeout(updateOrientation, 100);
    });
}