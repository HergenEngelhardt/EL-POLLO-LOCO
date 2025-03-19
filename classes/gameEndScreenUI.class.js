/**
 * Handles UI elements for game ending screens
 */
class GameEndScreenUI {
    /**
     * Creates a new GameEndScreenUI
     * @param {GameEndScreen} parentScreen - Reference to parent screen
     */
    constructor(parentScreen) {
        this.parentScreen = parentScreen;
        this.buttonsCreated = false;
    }

    /**
     * Shows the end screen with restart and menu buttons.
     * @param {HTMLCanvasElement} canvas - The game canvas element
     */
    showEndScreen(canvas) {
        if (this.buttonsCreated) {
            return;
        }
        canvas = this.getValidCanvas(canvas);
        if (!canvas) {
            console.error('No valid canvas element found');
            return;
        }
        this.removeExistingButtonContainer();
        this.createButtonsContainer(canvas);
        this.setupEventListeners();
        this.buttonsCreated = true;
        this.parentScreen.buttonsCreated = true;
    }

    /**
     * Gets a valid canvas element
     * @param {HTMLCanvasElement} canvas - The provided canvas element
     * @returns {HTMLCanvasElement|null} - A valid canvas element or null
     */
    getValidCanvas(canvas) {
        if (canvas && canvas instanceof HTMLCanvasElement && document.body.contains(canvas)) {
            return canvas;
        }

        return document.getElementById('canvas') ||
            document.getElementById('gameCanvas') ||
            document.querySelector('canvas');
    }

    /**
     * Removes any existing button container from the DOM.
     */
    removeExistingButtonContainer() {
        let existingContainer = document.getElementById('win-loose-buttons-container');
        if (existingContainer) {
            existingContainer.remove();
        }
    }

    /**
     * Creates and adds the buttons container to the DOM.
     * @param {HTMLCanvasElement} canvas - The game canvas element
     */
    createButtonsContainer(canvas) {
        try {
            if (!this.validateCanvas(canvas)) return;

            let position = this.calculateButtonPosition(canvas);
            let buttonsHTML = this.createButtonsHTML(position);
            this.insertButtonsIntoDOM(buttonsHTML);
        } catch (error) {
            console.error('Error creating buttons container:', error);
        }
    }

    /**
     * Creates the HTML for the buttons
     * @param {Object} position - The position for the buttons
     * @returns {string} - HTML for the buttons
     */
    createButtonsHTML(position) {
        return this.generateButtonsHTML(position.top, position.left);
    }

    /**
     * Validates that the canvas element is usable
     * @param {HTMLCanvasElement} canvas - The game canvas element
     * @returns {boolean} - Whether the canvas is valid
     */
    validateCanvas(canvas) {
        return canvas && document.body;
    }

    /**
     * Calculates the position for the buttons container
     * @param {HTMLCanvasElement} canvas - The game canvas element
     * @returns {Object} - The top and left position
     */
    calculateButtonPosition(canvas) {
        let canvasRect = canvas.getBoundingClientRect();
        let top = canvasRect.top + canvasRect.height * 0.65;
        let left = canvasRect.left + canvasRect.width / 2;
        return { top, left };
    }

    /**
     * Generates the HTML for the buttons container
     * @param {number} top - The top position
     * @param {number} left - The left position
     * @returns {string} - The HTML for the buttons container
     */
    generateButtonsHTML(top, left) {
        return `
        <div id="win-loose-buttons-container" style="position: absolute; top: ${top}px; left: ${left}px; transform: translateX(-50%); text-align: center; z-index: 1000;">
            <button class="btn" id="restart-game-btn">Restart Game</button>
            <span> </span>
            <button class="btn" id="back-to-menu-btn">Back to Menu</button>
        </div>
    `;
    }

    /**
     * Inserts the buttons HTML into the DOM
     * @param {string} buttonsHTML - The HTML for the buttons container
     */
    insertButtonsIntoDOM(buttonsHTML) {
        document.body.insertAdjacentHTML('beforeend', buttonsHTML);
        this.buttonsCreated = true;
    }

    /**
     * Sets up event listeners for the restart and menu buttons.
     */
    setupEventListeners() {
        let screen = this.parentScreen;
        document.getElementById('restart-game-btn').addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            screen.handleRestartGame();
        });

        document.getElementById('back-to-menu-btn').addEventListener('click', () => {
            screen.handleBackToMenu();
        });
    }

    /**
     * Removes the buttons container from the DOM.
     */
    removeButtonContainer() {
        let container = document.getElementById('win-loose-buttons-container');
        if (container) {
            container.remove();
        }
        this.buttonsCreated = false;
        this.parentScreen.buttonsCreated = false;
    }
}