/**
 * Represents the game over screen that appears when the player loses.
 * @extends DrawableObject
 */
class GameOverScreen extends DrawableObject {
    /**
     * Creates a new GameOverScreen instance.
     */
    constructor() {
        super();
        this.loadImage('assets/img/9_intro_outro_screens/game_over/oh no you lost!.png');
        this.width = 720;
        this.height = 480;
        this.soundPlayed = false;
        this.screenDisplayed = false;
        this.buttonsCreated = false;
        this.world = null; 
    }

    /**
     * Sets the world reference for this game over screen.
     * @param {World} world - The game world object
     */
    setWorld(world) {
        this.world = world;
    }

    /**
     * Plays the game over sound effect once.
     */
    playGameOverSound() {
        if (!this.soundPlayed) {
            let audio = new Audio('./audio/losing.wav');
            audio.play().catch(error => {
                console.error('Error playing audio:', error);
            });
            this.soundPlayed = true;
        }
    }

    /**
     * Draws the game over screen on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    draw(ctx) {
        if (!ctx || !this.world) return;
        
        if (this.world.gameOver) {
            ctx.drawImage(this.img, (ctx.canvas.width - this.width) / 2, (ctx.canvas.height - this.height) / 2, this.width, this.height);
            this.playGameOverSound();
            
            if (!this.screenDisplayed) {
                if (ctx && ctx.canvas) {
                    this.showWinLoseScreen('lose', ctx.canvas);
                    this.screenDisplayed = true;
                }
            }
        }
    }
    
/**
 * Shows the win/lose screen with restart and menu buttons.
 * @param {string} result - The result of the game ('win' or 'lose')
 * @param {HTMLCanvasElement} canvas - The game canvas element
 */
showWinLoseScreen(result, canvas) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement) || !document.body.contains(canvas)) {
        console.error('Canvas is invalid or not in document in showWinLoseScreen');
        
        const mainCanvas = document.getElementById('canvas');
        if (mainCanvas && document.body.contains(mainCanvas)) {
            canvas = mainCanvas;
            console.log('Using main canvas as fallback');
        } else {
            return;
        }
    }
    if (this.buttonsCreated) {
        return;
    }
    
    try {
        this.removeExistingButtonContainer();
        this.createButtonsContainer(canvas);
        this.setupEventListeners();
    } catch (error) {
        console.error('Error showing win/lose screen:', error);
    }
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
        if (!canvas || !document.body) return;
        
        const canvasRect = canvas.getBoundingClientRect();
        const top = canvasRect.top + canvasRect.height * 0.65;
        const left = canvasRect.left + canvasRect.width / 2;
        
        let buttonsHTML = `
            <div id="win-loose-buttons-container" style="position: absolute; top: ${top}px; left: ${left}px; transform: translateX(-50%); text-align: center; z-index: 1000;">
                <button class="btn" id="restart-game-btn">Restart Game</button>
                <span> </span>
                <button class="btn" id="back-to-menu-btn">Back to Menu</button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', buttonsHTML);
        this.buttonsCreated = true;
    } catch (error) {
        console.error('Error creating buttons container:', error);
    }
}

/**
 * Sets up event listeners for the restart and menu buttons.
 */
setupEventListeners() {
    let self = this;
    document.getElementById('restart-game-btn').addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        self.handleRestartGame();
    });
    
    document.getElementById('back-to-menu-btn').addEventListener('click', () => {
        this.handleBackToMenu();
    });
}

/**
 * Handles the restart game button click.
 */
handleRestartGame() {
    this.removeButtonContainer();
    
    let world = this.world || window.world;
    if (world) {
        this.resetGameState(world);
        this.resetCharacterState(world);
        this.resetWorldState(world);
        this.reinitializeLevel(world);
    } else {
        this.handleMissingWorld();
    }
}

/**
 * Removes the buttons container from the DOM.
 */
removeButtonContainer() {
    let container = document.getElementById('win-loose-buttons-container');
    if (container) {
        container.remove();
    }
}

/**
 * Resets the game state.
 * @param {World} world - The game world object
 */
resetGameState(world) {
    world.gameOver = false;
    world.gameStarted = true;
    this.screenDisplayed = false;
    this.buttonsCreated = false;
    this.soundPlayed = false;
    
    if (world.character.animationInterval) {
        clearInterval(world.character.animationInterval);
    }
}

/**
 * Resets the character state.
 * @param {World} world - The game world object
 */
resetCharacterState(world) {
    world.character.energy = 100;
    world.character.deadAnimationPlayed = false;
    world.character.x = 100; 
    world.character.y = 180; 
    world.character.speedY = 0;
    world.character.otherDirection = false;
}

/**
 * Resets the world state.
 * @param {World} world - The game world object
 */
resetWorldState(world) {
    world.camera_x = 0;
    world.coinsCollected = 0;
    world.bottlesCollected = 0;
    world.throwableBottles = [];
}

/**
 * Reinitializes the game level.
 * @param {World} world - The game world object
 */
reinitializeLevel(world) {
    if (typeof initLevel1 === 'function') {
        initLevel1();
        if (typeof level1 !== 'undefined') {
            world.level = level1;
            world.setWorld();
        }
    }
    
    this.updateGameUI(world);
}

/**
 * Updates the game UI elements.
 * @param {World} world - The game world object
 */
updateGameUI(world) {
    world.updateHealthStatusBar();
    world.updateCoinStatusBar();
    world.updateBottleStatusBar();
    world.draw();
    setTimeout(() => {
        world.character.startAnimations();
    }, 100);
}

/**
 * Handles the case when the world object is not found.
 */
handleMissingWorld() {
    console.error("World object not found! Attempting fallback...");
    try {
        if (typeof startGame === 'function') {
            startGame();
            return;
        }
    } catch (e) {
        console.error("Fallback failed:", e);
    }
    
    console.warn("Using reload as last resort");
    location.reload();
}

/**
 * Handles the back to menu button click.
 */
handleBackToMenu() {
    let container = document.getElementById('win-loose-buttons-container');
    if (container) {
        container.remove();
    }
    location.reload();
}
}