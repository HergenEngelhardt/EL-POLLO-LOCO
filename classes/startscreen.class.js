/**
 * Represents the start screen of the game.
 * @class
 * @extends DrawableObject
 */
class StartScreen extends DrawableObject {
    /**
     * Creates a new StartScreen instance.
     * Initializes the start screen with background image, buttons, and music.
     * Sets up click event listeners for interactive elements.
     */
    constructor() {
        super();
        this.loadImage('./assets/img/9_intro_outro_screens/start/startscreen_1.png');

        this.playButton = new DrawableObject();
        this.playButton.loadImage('./assets/icons/playbutton.png');
        this.playButton.x = 650;
        this.playButton.y = 10;
        this.playButton.width = 50;
        this.playButton.height = 50;

        this.guitarButton = new DrawableObject();
        this.guitarButton.loadImage('./assets/icons/guitar-159661_640.png');
        this.guitarButton.x = 10;
        this.guitarButton.y = 10;
        this.guitarButton.width = 50;
        this.guitarButton.height = 75;

        this.instructionsButton = new DrawableObject();
        this.instructionsButton.x = 650;
        this.instructionsButton.y = 70;
        this.instructionsButton.width = 50;
        this.instructionsButton.height = 50;

        this.imprintButton = new DrawableObject();
        this.imprintButton.x = 650;
        this.imprintButton.y = 130;
        this.imprintButton.width = 50;
        this.imprintButton.height = 50;

        this.width = 720;
        this.height = 480;
        this.backgroundMusic = new Audio('./audio/backgroundMusic.mp3');
        this.backgroundMusic.loop = true;
        canvas.addEventListener("click", (event) => {
            this.handleInteraction(event);
        });

        canvas.addEventListener("touchstart", (event) => {
            this.handleInteraction(event);
        });
    }

    /**
     * Handles both mouse clicks and touch interactions
     * @param {Event} event - The interaction event (click or touch)
     */
    handleInteraction(event) {
        let coordinates = this.getCoordinatesFromEvent(event);
        this.handleButtonClick(coordinates.x, coordinates.y);
    }

    /**
     * Extracts coordinates from mouse or touch event
     * @param {Event} event - The interaction event (click or touch)
     * @returns {Object} - Object containing x and y coordinates
     */
    getCoordinatesFromEvent(event) {
        let rect = canvas.getBoundingClientRect();
        let x, y;

        if (event.type === 'touchstart') {
            x = event.touches[0].clientX - rect.left;
            y = event.touches[0].clientY - rect.top;
            event.preventDefault();
        } else {
            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
        }

        return { x, y };
    }

    /**
     * Handles button clicks based on coordinates
     * @param {number} x - The x-coordinate of the click
     * @param {number} y - The y-coordinate of the click
     */
    handleButtonClick(x, y) {
        if (this.isPlayButtonClicked(x, y)) {
            this.handlePlayButton();
        } else if (this.isGuitarButtonClicked(x, y)) {
            this.toggleMusic();
        } else if (this.isInstructionsButtonClicked(x, y)) {
            this.showInstructions();
        } else if (this.isImprintButtonClicked(x, y)) {
            this.showImprint();
        }
    }

    /**
     * Handles play button click actions
     */
    handlePlayButton() {
        this.stopMusic();
        setTimeout(() => {
            if (!this.backgroundMusic.paused) {
                this.backgroundMusic.pause();
                this.backgroundMusic.currentTime = 0;
            }
        }, 100);
    }

    /**
     * Renders the start screen and its buttons on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, 0, 0, this.width, this.height);
        this.playButton.draw(ctx);
        this.guitarButton.draw(ctx);
        this.instructionsButton.draw(ctx);
        this.imprintButton.draw(ctx);
    }

    /**
     * Checks if the play button was clicked.
     * @param {number} x - The x-coordinate of the click event.
     * @param {number} y - The y-coordinate of the click event.
     * @returns {boolean} True if the play button was clicked, false otherwise.
     */
    isPlayButtonClicked(x, y) {
        return x >= this.playButton.x && x <= this.playButton.x + this.playButton.width &&
            y >= this.playButton.y && y <= this.playButton.y + this.playButton.height;
    }

    /**
     * Checks if the guitar (music) button was clicked.
     * @param {number} x - The x-coordinate of the click event.
     * @param {number} y - The y-coordinate of the click event.
     * @returns {boolean} True if the guitar button was clicked, false otherwise.
     */
    isGuitarButtonClicked(x, y) {
        return x >= this.guitarButton.x && x <= this.guitarButton.x + this.guitarButton.width &&
            y >= this.guitarButton.y && y <= this.guitarButton.y + this.guitarButton.height;
    }

    /**
     * Checks if the instructions button was clicked.
     * @param {number} x - The x-coordinate of the click event.
     * @param {number} y - The y-coordinate of the click event.
     * @returns {boolean} True if the instructions button was clicked, false otherwise.
     */
    isInstructionsButtonClicked(x, y) {
        return x >= this.instructionsButton.x && x <= this.instructionsButton.x + this.instructionsButton.width &&
            y >= this.instructionsButton.y && y <= this.instructionsButton.y + this.instructionsButton.height;
    }

    /**
     * Checks if the imprint button was clicked.
     * @param {number} x - The x-coordinate of the click event.
     * @param {number} y - The y-coordinate of the click event.
     * @returns {boolean} True if the imprint button was clicked, false otherwise.
     */
    isImprintButtonClicked(x, y) {
        return x >= this.imprintButton.x && x <= this.imprintButton.x + this.imprintButton.width &&
            y >= this.imprintButton.y && y <= this.imprintButton.y + this.imprintButton.height;
    }

    /**
     * Toggles the background music play state.
     * If music is paused, it will play. If music is playing, it will pause.
     */
    toggleMusic() {
        if (this.backgroundMusic.paused) {
            this.backgroundMusic.play().catch(error => console.error('Error playing music:', error));
        } else {
            this.backgroundMusic.pause();
        }
    }

    /**
     * Completely stops the background music and resets it to the beginning.
     */
    stopMusic() {
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
    }

    /**
     * Displays the game instructions by showing the instructions element.
     */
    showInstructions() {
        document.getElementById('instructions').style.display = 'block';
    }

    /**
     * Displays the imprint information by showing the imprint element.
     */
    showImprint() {
        document.getElementById('imprint').style.display = 'block';
    }
}