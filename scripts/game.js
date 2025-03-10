let canvas;
let ctx; 
let world;
let keyboard = new Keyboard();

/**
 * Initializes the game by setting up the canvas, creating the world,
 * and attaching event listeners to UI elements
 */
/**
 * Initializes the game by setting up the canvas, world, and UI event listeners
 */
function init() {
    setupGameObjects();
    setupEventListeners();
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
 * Toggles the visibility of instructions panel
 */
function toggleInstructions() {
    let instructionsElement = document.getElementById('instructions');
    if (!instructionsElement.classList.contains('d-none')) {
        instructionsElement.classList.add('d-none');
    } else {
        hideAllPanels();
        instructionsElement.classList.remove('d-none');
    }
}

/**
 * Toggles the visibility of imprint panel
 */
function toggleImprint() {
    let imprintElement = document.getElementById('imprint');
    if (!imprintElement.classList.contains('d-none')) {
        imprintElement.classList.add('d-none');
    } else {
        hideAllPanels();
        imprintElement.classList.remove('d-none');
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
 * Event listener for keydown events
 * Updates keyboard state when keys are pressed
 * @param {KeyboardEvent} e - The keyboard event
 */
window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowUp') {
        keyboard.UP = true;
    }
    if (e.code === 'ArrowLeft') {
        keyboard.LEFT = true;
    }
    if (e.code === 'ArrowRight') {
        keyboard.RIGHT = true;
    }
    if (e.code === 'ControlLeft') {
        keyboard.THROW = true;
    }
    if (e.code === 'Space') {
        keyboard.JUMP = true;
    }
});

/**
 * Event listener for keyup events
 * Updates keyboard state when keys are released
 * @param {KeyboardEvent} e - The keyboard event
 */
window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowUp') {
        keyboard.UP = false;
    }
    if (e.code === 'ArrowLeft') {
        keyboard.LEFT = false;
    }
    if (e.code === 'ArrowRight') {
        keyboard.RIGHT = false;
    }
    if (e.code === 'ControlLeft') {
        keyboard.THROW = false;
    }
    if (e.code === 'Space') {
        keyboard.JUMP = false;
    }
});

/**
 * Hides all UI overlay elements (instructions, imprint, win/lose screen)
 */
function showMenu() {
    document.getElementById('instructions').classList.add('d-none');
    document.getElementById('imprint').classList.add('d-none');
    document.getElementById('win-loose').classList.add('d-none');
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
 * Returns to the main menu from the game
 * Hides the result screen and resets game state to initial values
 */
function backToMenu() {
    document.getElementById('win-loose').classList.add('d-none');
    world.gameStarted = false;
    world.gameOver = false;
    world.draw();
}

function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('d-none');
}

function closeMobileMenu() {
    console.log('Closing mobile menu');
    let mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.add('d-none');
        mobileMenu.style.display = 'none';
    }
}

function showInstructions() {
    document.getElementById('instructions').classList.remove('d-none');
    document.getElementById('imprint').classList.add('d-none');
    document.getElementById('mobileMenu').classList.add('d-none');
}

function showImprint() {
    document.getElementById('imprint').classList.remove('d-none');
    document.getElementById('instructions').classList.add('d-none');
    document.getElementById('mobileMenu').classList.add('d-none');
}

document.addEventListener('DOMContentLoaded', function() {
    let menuBtn = document.getElementById('mobileMenuBtn');
    if (menuBtn) {
        menuBtn.addEventListener('click', toggleMobileMenu);
    }
    let closeBtn = document.querySelector('#mobileMenu .mobile-menu-btn:last-child');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMobileMenu);
    }
});