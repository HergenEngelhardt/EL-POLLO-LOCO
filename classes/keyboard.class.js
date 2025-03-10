/**
 * Class representing keyboard input state tracking
 * Maintains boolean flags for various game control keys
 */
class Keyboard{
    LEFT = false;
    RIGHT = false;
    UP = false;
    THROW = false;
    JUMP = false;
}

/**
 * Initializes mobile control buttons
 * Sets up touch and mouse events to update keyboard state
 */
function initMobileControls() {
    document.getElementById('btnLeft').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.LEFT = true;
    });

    document.getElementById('btnLeft').addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.LEFT = false;
    });

    document.getElementById('btnRight').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.RIGHT = true;
    });

    document.getElementById('btnRight').addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.RIGHT = false;
    });

    document.getElementById('btnJump').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.JUMP = true;
    });

    document.getElementById('btnJump').addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.JUMP = false;
    });

    document.getElementById('btnThrow').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.THROW = true;
        console.log('Throw button pressed', keyboard);
    });

    document.getElementById('btnThrow').addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.THROW = false;
    });
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