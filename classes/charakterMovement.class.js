/**
 * Handles character movement logic
 */
class CharacterMovementController {
    constructor(character) {
        this.character = character;
    }

    /**
     * Handles character movement based on keyboard input
     */
    handleMovement() {
        if (this.character.isImmobilized) {
            return;
        }

        if (!this.character.isDead() || !this.character.deadAnimationPlayed) {
            this.handleHorizontalMovement();
            this.handleJump();
            this.updateCameraPosition();
        } else {
            clearInterval(this.character.animationInterval);
            this.character.world.gameOver = true;
        }
    }

    /**
     * Handles left/right movement based on keyboard input
     */
    handleHorizontalMovement() {
        if (this.character.world.keyboard.RIGHT && this.character.x < this.character.world.level.level_end_x) {
            this.moveRight();
            this.character.otherDirection = false;
            this.character.lastMoveTime = Date.now();
        } else if (this.character.world.keyboard.LEFT && this.character.x > 0) {
            this.moveLeft();
            this.character.otherDirection = true;
            this.character.lastMoveTime = Date.now();
        } else {
            this.character.stopRunningSound();
        }
    }

    /**
     * Handles jump action based on keyboard input
     */
    handleJump() {
        if (this.character.world.keyboard.JUMP && !this.character.isAboveGround()) {
            this.character.jump();
        }
    }

    /**
     * Updates the camera position relative to character
     */
    updateCameraPosition() {
        this.character.world.camera_x = -this.character.x;
    }

    /**
     * Moves the character right and handles sound effects
     */
    moveRight() {
        if (this.character.isAboveGround()) {
            this.character.x += this.character.speed * 0.9;
        } else {
            this.character.x += this.character.speed;
        }

        if (!this.character.isAboveGround()) {
            this.character.playRunningSound();
        } else {
            this.character.stopRunningSound();
        }
    }

    /**
     * Moves the character left and handles sound effects
     */
    moveLeft() {
        if (this.character.isAboveGround()) {
            this.character.x -= this.character.speed * 0.65;
        } else {
            this.character.x -= this.character.speed;
        }

        if (!this.character.isAboveGround()) {
            this.character.playRunningSound();
        } else {
            this.character.stopRunningSound();
        }
    }
}