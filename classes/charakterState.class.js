/**
 * Manages the different states of the character
 */
class CharacterStateManager {
    constructor(character) {
        this.character = character;
        this.jumpAnimationActive = false;
        this.jumpAnimationFrame = 0;
        this.jumpAnimationComplete = false;
        this.jumpAnimationInterval = null;
    }

    /**
     * Updates character images based on current state
     */
    updateCharacterImages() {
        if (this.character.isDead()) {
            this.handleDeadState();
        } else if (this.character.isHurt()) {
            this.handleHurtState();
        } else if (this.character.isImmobilized) {
            this.handleImmobilizedState();
        } else if (this.character.isAboveGround()) {
            this.handleJumpAnimation();
        } else {
            this.handleGroundedState();
        }
    }

    /**
     * Handles the character's dead state animation
     */
    handleDeadState() {
        this.character.animateImages(this.character.IMAGES_DEAD);
    }

    /**
     * Handles the character's hurt state animation
     */
    handleHurtState() {
        this.character.animateImages(this.character.IMAGES_HURT);
    }

    /**
     * Handles the character's immobilized state
     * Freezes character in a specific stance
     */
    handleImmobilizedState() {
        this.character.img = this.character.imageCache[this.character.IMAGES_IDLE[0]];
        this.character.stopSnoringSound();
        this.character.lastMoveTime = Date.now();
    }

    /**
     * Handles the character's grounded state
     * Resets jump animation and updates ground animations
     */
    handleGroundedState() {
        this.resetJumpAnimation();
        this.updateGroundedImages();
    }

    /**
     * Resets all jump animation related properties and intervals
     */
    resetJumpAnimation() {
        if (this.jumpAnimationActive && this.jumpAnimationInterval) {
            clearInterval(this.jumpAnimationInterval);
        }

        this.jumpAnimationActive = false;
        this.jumpAnimationFrame = 0;
        this.jumpAnimationComplete = false;
    }

    /**
     * Updates images for character when on the ground
     */
    updateGroundedImages() {
        if (this.character.isImmobilized) {
            this.handleImmobilizedGroundState();
            return;
        }

        if (this.character.isMoving()) {
            this.handleMovingState();
        } else if (this.character.isInLongIdleState()) {
            this.handleLongIdleState();
        } else {
            this.handleShortIdleState();
        }
    }

    /**
     * Handles the character's immobilized state when on ground
     */
    handleImmobilizedGroundState() {
        this.character.img = this.character.imageCache[this.character.IMAGES_IDLE[0]];
        this.character.stopSnoringSound();
    }

    /**
     * Handles the character's moving state
     */
    handleMovingState() {
        this.character.animateImages(this.character.IMAGES_WALKING);
        this.character.stopSnoringSound();
    }

    /**
     * Handles the character's long idle state
     */
    handleLongIdleState() {
        this.character.animateImages(this.character.IMAGES_IDLE_LONG);
        this.character.playSnoringSound();
    }

    /**
     * Handles the character's short idle state
     */
    handleShortIdleState() {
        this.character.animateImages(this.character.IMAGES_IDLE);
        this.character.stopSnoringSound();
    }

    /**
     * Handles the jump animation sequence
     * Plays through the jump animation once per jump
     */
    handleJumpAnimation() {
        if (!this.jumpAnimationComplete) {
            let frameIndex = Math.min(
                this.jumpAnimationFrame,
                this.character.IMAGES_JUMPING.length - 1
            );
            this.character.img = this.character.imageCache[this.character.IMAGES_JUMPING[frameIndex]];
        } else {
            this.showFinalJumpFrame();
        }
        this.resetIdleTimer();
    }

    /**
     * Shows the final frame of the jump animation
     */
    showFinalJumpFrame() {
        this.character.img = this.character.imageCache[this.character.IMAGES_JUMPING[this.character.IMAGES_JUMPING.length - 1]];
    }

    /**
     * Progresses to the next frame in the jump animation sequence
     */
    progressJumpAnimation() {
        this.jumpAnimationFrame++;
        this.checkJumpAnimationComplete();
    }

    /**
     * Checks if the jump animation has completed
     */
    checkJumpAnimationComplete() {
        if (this.jumpAnimationFrame >= this.character.IMAGES_JUMPING.length) {
            this.jumpAnimationComplete = true;
        }
    }

    /**
     * Resets the idle timer to prevent entering idle state
     */
    resetIdleTimer() {
        let wasInLongIdleState = this.character.isInLongIdleState();
        this.character.lastMoveTime = Date.now();
        if (wasInLongIdleState) {
            this.character.stopSnoringSound();
        }
    }

    /**
     * Initiates jump animation sequence
     */
    startJumpAnimation() {
        if (this.jumpAnimationInterval) {
            clearInterval(this.jumpAnimationInterval);
        }
        this.jumpAnimationActive = true;
        this.jumpAnimationFrame = 0;
        this.jumpAnimationComplete = false;
        this.character.img = this.character.imageCache[this.character.IMAGES_JUMPING[0]];
        this.jumpAnimationInterval = setInterval(() => {
            this.progressJumpAnimation();
            if (this.jumpAnimationComplete) {
                clearInterval(this.jumpAnimationInterval);
            }
        }, 100);
    }

    /**
     * Progresses to the next frame in the jump animation sequence
     */
    progressJumpAnimation() {
        this.jumpAnimationFrame++;
        if (this.jumpAnimationFrame < this.character.IMAGES_JUMPING.length) {
            this.character.img = this.character.imageCache[this.character.IMAGES_JUMPING[this.jumpAnimationFrame]];
        }
        this.checkJumpAnimationComplete();
    }
}