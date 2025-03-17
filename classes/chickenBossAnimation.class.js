/**
 * Handles all animation states and behaviors for the chicken boss enemy
 */
class ChickenBossAnimation {
    /**
     * Creates a new boss animation controller
     * @param {Object} boss - The boss character instance this animation controls
     */
    constructor(boss) {
        this.boss = boss;
        this.deathAnimationIndex = 0;
        this.deathAnimationPlayed = false;
        this.alertFrameCount = 0;
    }

    /**
     * Initializes the animation loop for the boss
     */
    animate() {
        this.boss.setupAnimationLoop();
    }

    /**
     * Handles the boss alert phase animation and state
     * @param {boolean} characterIsLeft - Whether the player character is to the left of the boss
     */
    handleAlertPhase(characterIsLeft) {
        this.updateAlertAnimation(characterIsLeft);
        this.incrementAlertCounter();

        if (this.isAlertPhaseComplete()) {
            this.completeAlertPhase();
        }
    }

    /**
    * Updates the animation during the alert phase
    * @param {boolean} characterIsLeft - Whether the player character is to the left of the boss
    */
    updateAlertAnimation(characterIsLeft) {
        this.boss.otherDirection = !characterIsLeft;
        let totalFrames = this.boss.IMAGES_ALERT.length;
        let repeatCount = Math.floor(24 / totalFrames);
        if (repeatCount > 1) {
            let currentCycle = Math.floor(this.alertFrameCount / totalFrames);
            if (currentCycle < repeatCount) {
                this.animateImages(this.boss.IMAGES_ALERT);
            }
        } else {
            this.animateImages(this.boss.IMAGES_ALERT);
        }
    }

    /**
     * Increments the alert animation frame counter
     */
    incrementAlertCounter() {
        this.alertFrameCount++;
    }

    /**
     * Checks if the alert phase has completed its animation cycle
     * @returns {boolean} True if alert phase should end
     */
    isAlertPhaseComplete() {
        return this.alertFrameCount >= 24;
    }

    /**
     * Completes the alert phase and transitions to combat
     */
    completeAlertPhase() {
        this.boss.alertPhase = false;
        this.boss.showHealthBar = true;
        this.releaseCharacter();
        this.stopAlertSound();
    }

    /**
     * Releases the character from immobilization
     */
    releaseCharacter() {
        if (this.boss.world && this.boss.world.character) {
            this.boss.world.character.isImmobilized = false;
        }
    }

    /**
     * Stops the alert sound effect
     */
    stopAlertSound() {
        if (this.boss.alertSound) {
            this.boss.alertSound.pause();
            this.boss.alertSound.currentTime = 0;
        }
    }

    /**
     * Handles the death state animation of the boss
     */
    handleDeathState() {
        if (!this.deathAnimationPlayed) {
            this.playDeathAnimation();
        }
    }

    /**
     * Handles the hurt state animation when the boss takes damage
     */
    handleHurtState() {
        this.animateImages(this.boss.IMAGES_HURT);
    }

    /**
     * Plays the death animation sequence and triggers game completion when finished
     */
    /**
     * Plays the death animation sequence and triggers game completion when finished
     */
    playDeathAnimation() {
        let ANIMATION_FRAME_DELAY = 200;
        let deathInterval = setInterval(() => {
            if (this.isDeathAnimationComplete()) {
                this.finalizeDeathAnimation(deathInterval);
                return;
            }

            this.showNextDeathFrame();
        }, ANIMATION_FRAME_DELAY);
    }

    /**
     * Checks if the death animation has reached its final frame
     * @returns {boolean} True if all death animation frames have been shown
     */
    isDeathAnimationComplete() {
        return this.deathAnimationIndex >= this.boss.IMAGES_DEAD.length;
    }

    /**
     * Finalizes the death animation and triggers game completion
     * @param {number} intervalId - The ID of the setInterval to clear
     */
    finalizeDeathAnimation(intervalId) {
        clearInterval(intervalId);
        this.deathAnimationPlayed = true;
        this.boss.toDelete = true;

        if (this.boss.world) {
            this.boss.world.gameWon = true;
        }
    }

    /**
     * Shows the next frame of the death animation sequence
     */
    showNextDeathFrame() {
        let path = this.boss.IMAGES_DEAD[this.deathAnimationIndex];
        this.boss.img = this.boss.imageCache[path];
        this.deathAnimationIndex++;
    }

    /**
     * Handles cycling through animation image frames
     * @param {Array<string>} images - Array of image paths for the current animation
     */
    animateImages(images) {
        let i = this.boss.currentImage % images.length;
        let path = images[i];
        this.boss.img = this.boss.imageCache[path];
        this.boss.currentImage++;
    }

    /**
     * Sets the boss to its idle state appearance
     */
    handleIdleState() {
        this.boss.img = this.boss.imageCache[this.boss.IMAGES_WALKING[0]];
    }
}