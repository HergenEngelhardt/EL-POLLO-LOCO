/**
 * Handles movement behavior for the chicken boss enemy
 * Controls direction, jumping mechanics and sound effects
 */
class ChickenBossMovement {
    /**
     * Creates a new ChickenBossMovement instance
     * @param {Object} boss - The boss character this movement controller belongs to
     */
    constructor(boss) {
        this.boss = boss;
        this.movingDirection = -1;
        this.lastDirectionChange = 0;
        this.canJump = true;
        this.isJumping = false;
        this.jumpCooldown = 0;
        this.jumpSpeed = 25;
    }

    /**
     * Updates the direction the boss should move based on character position
     * @param {boolean} characterIsLeft - Whether the player character is to the left of the boss
     */
    updateMovementDirection(characterIsLeft) {
        this.movingDirection = characterIsLeft ? -1 : 1;
        this.boss.otherDirection = !characterIsLeft;
    }

    /**
     * Applies all movement-related updates in a single frame
     */
    applyMovement() {
        this.moveBasedOnDirection();
        this.playMovementSound();
        this.handleJumpingIfNeeded();
    }

    /**
     * Moves the boss based on the current movement direction
     */
    moveBasedOnDirection() {
        if (this.movingDirection > 0) {
            this.boss.x += this.boss.speed;
            this.boss.otherDirection = true;
        } else {
            this.boss.x -= this.boss.speed;
            this.boss.otherDirection = false;
        }
    }

    /**
     * Handles jumping logic if the boss is currently in a jump
     */
    handleJumpingIfNeeded() {
        if (this.isJumping) {
            this.updateJumpPhysics();
        }

        this.updateJumpCooldown();
    }

    /**
     * Updates the jump physics (position and speed) while in air
     */
    updateJumpPhysics() {
        this.boss.y -= this.jumpSpeed;
        this.jumpSpeed -= this.boss.acceleration;
        if (this.boss.y >= 80) {
            this.boss.y = 80;
            this.isJumping = false;
            this.jumpCooldown = 30;
        }
    }

    /**
     * Manages the cooldown between jumps
     */
    updateJumpCooldown() {
        if (this.jumpCooldown > 0) {
            this.jumpCooldown--;
            this.canJump = false;
        } else {
            this.canJump = true;
        }
    }

    /**
     * Randomly attempts to initiate a jump with a 3% chance per frame when allowed
     */
    tryToJump() {
        if (this.canJump && Math.random() < 0.06) {
            this.jump();
        }
    }

    /**
     * Makes the boss jump if conditions allow
     * Increases speed temporarily during the jump
     */
    jump() {
        if (!this.isJumping && this.canJump) {
            this.isJumping = true;
            this.jumpSpeed = 18;
            this.boss.acceleration = 2;
            this.boss.speed *= 1.4;
            setTimeout(() => {
                this.boss.speed = 15;
            }, 1000);
        }
    }

    /**
     * Plays movement sound at regular intervals if the boss is alive
     * Uses a cooldown to prevent sound spamming
     */
    playMovementSound() {
        let now = new Date().getTime();

        if (!this.boss.isDead() && (!this.lastMovementSoundTime || now - this.lastMovementSoundTime > 1000)) {
            SoundManager.play('chickenboss', 0.3);
            this.lastMovementSoundTime = now;
        }
    }
}