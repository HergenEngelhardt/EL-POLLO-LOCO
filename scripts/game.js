let canvas;
let ctx; 
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('gameCanvas');
    world = new World(canvas, keyboard);
    document.getElementById('instructions-btn').addEventListener('click', function() {
        let instructionsElement = document.getElementById('instructions');
        if (!instructionsElement.classList.contains('d-none')) {
            instructionsElement.classList.add('d-none');
        } else {
            document.getElementById('imprint').classList.add('d-none');
            document.getElementById('win-loose').classList.add('d-none');
            instructionsElement.classList.remove('d-none');
        }
    });
    document.getElementById('imprint-btn').addEventListener('click', function() {
        let imprintElement = document.getElementById('imprint');
        if (!imprintElement.classList.contains('d-none')) {
            imprintElement.classList.add('d-none');
        } else {
            document.getElementById('instructions').classList.add('d-none');
            document.getElementById('win-loose').classList.add('d-none');
            imprintElement.classList.remove('d-none');
        }
    });
}

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

function showMenu() {
    document.getElementById('instructions').classList.add('d-none');
    document.getElementById('imprint').classList.add('d-none');
    document.getElementById('win-loose').classList.add('d-none');
}

function playAgain() {
    document.getElementById('win-loose').classList.add('d-none');
    world.gameOver = false;
    world.startGame();
}

function backToMenu() {
    document.getElementById('win-loose').classList.add('d-none');
    world.gameStarted = false;
    world.gameOver = false;
    world.draw();
}