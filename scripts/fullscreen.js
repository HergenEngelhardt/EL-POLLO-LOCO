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