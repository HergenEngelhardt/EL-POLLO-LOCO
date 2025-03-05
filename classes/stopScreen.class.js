class GameOverScreen extends DrawableObject {
    constructor() {
        super();
        this.loadImage('assets/img/9_intro_outro_screens/game_over/oh no you lost!.png');
        this.width = 720;
        this.height = 480;
        this.soundPlayed = false;
        this.screenDisplayed = false;
        this.buttonsCreated = false;
        this.world = null; // Store reference to world
    }

    // Add a setter to store the world reference
    setWorld(world) {
        this.world = world;
    }

    playGameOverSound() {
        if (!this.soundPlayed) {
            let audio = new Audio('./audio/losing.wav');
            audio.play().catch(error => {
                console.error('Error playing audio:', error);
            });
            this.soundPlayed = true;
        }
    }

    draw(ctx) {
        // Only draw the game over screen if the game is actually over
        if (this.world && this.world.gameOver) {
            ctx.drawImage(this.img, (ctx.canvas.width - this.width) / 2, (ctx.canvas.height - this.height) / 2, this.width, this.height);
            this.playGameOverSound();
            
            if (!this.screenDisplayed) {
                this.showWinLoseScreen('lose', ctx.canvas);
                this.screenDisplayed = true;
            }
        }
    }
    
    showWinLoseScreen(result, canvas) {
        // Guard against undefined canvas
        if (!canvas) {
            console.error('Canvas is undefined in showWinLoseScreen');
            return;
        }
        
        if (this.buttonsCreated) {
            return;
        }
        
        let existingContainer = document.getElementById('win-loose-buttons-container');
        if (existingContainer) {
            existingContainer.remove();
        }
        
        let canvasRect = canvas.getBoundingClientRect();
        
        let buttonsHTML = `
            <div id="win-loose-buttons-container" style="position: absolute; top: ${canvasRect.top + canvasRect.height * 0.65}px; left: ${canvasRect.left + canvasRect.width / 2}px; transform: translateX(-50%); text-align: center; z-index: 1000;">
                <button class="btn" id="restart-game-btn">Restart Game</button>
                <span> </span>
                <button class="btn" id="back-to-menu-btn">Back to Menu</button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', buttonsHTML);
        this.buttonsCreated = true;
        
        // Store a reference to this GameOverScreen instance
        const self = this;
        
        // Add event listeners to buttons
        document.getElementById('restart-game-btn').addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            console.log("Restart Game clicked");
            
            // Remove buttons
            const container = document.getElementById('win-loose-buttons-container');
            if (container) {
                container.remove();
            }
            
            // Try to get world from instance first, then from window
            const world = self.world || window.world;
            
            if (world) {
                console.log("World found, restarting game...");
                
                // Reset game flags
                world.gameOver = false;
                world.gameStarted = true;
                
                // Reset GameOverScreen state
                self.screenDisplayed = false;
                self.buttonsCreated = false;
                self.soundPlayed = false;
                
                // Stop any animations that might be running
                if (world.character.animationInterval) {
                    clearInterval(world.character.animationInterval);
                }
                
                // Reset character state
                world.character.energy = 100;
                world.character.deadAnimationPlayed = false;
                world.character.x = 100; // Reset to starting position
                world.character.y = 180; // Reset to ground level
                world.character.speedY = 0;
                
                // Reset camera position
                world.camera_x = 0;
                
                // Reset collectibles
                world.coinsCollected = 0;
                world.bottlesCollected = 0;
                world.throwableBottles = [];
                
                // Reinitialize level
                if (typeof initLevel1 === 'function') {
                    initLevel1();
                    if (typeof level1 !== 'undefined') {
                        world.level = level1;
                        world.setWorld();
                    }
                }
                
                // Update status bars
                world.updateHealthStatusBar();
                world.updateCoinStatusBar();
                world.updateBottleStatusBar();
                
                // Force redraw the canvas to clear the game over screen
                world.draw();
                
                // Restart animations
                setTimeout(() => {
                    world.character.startAnimations();
                    console.log("Game successfully restarted!");
                }, 100);
            } else {
                console.error("World object not found! Attempting fallback...");
                // Fallback - if we can't find the world object, at least try to reload the game
                try {
                    if (typeof startGame === 'function') {
                        startGame(); // Try to call startGame if it exists
                        return;
                    }
                } catch (e) {
                    console.error("Fallback failed:", e);
                }
                
                // Last resort: reload the page
                console.warn("Using reload as last resort");
                location.reload();
            }
        });
        
        document.getElementById('back-to-menu-btn').addEventListener('click', () => {
            let container = document.getElementById('win-loose-buttons-container');
            if (container) {
                container.remove();
            }
            location.reload();
        });
    }
}