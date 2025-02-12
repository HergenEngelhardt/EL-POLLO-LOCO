let canvas;
let ctx; 
let world;
let keyboard = new Keyboard();


function init() {
    canvas = document.getElementById('gameCanvas');
    world = new World(canvas, keyboard);
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