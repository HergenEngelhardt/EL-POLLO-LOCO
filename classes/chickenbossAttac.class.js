class ChickenBossAttack {
    constructor() {
        this.speed = 15;
        this.jumpSpeed = 0;
        this.isJumping = false;
        this.jumpCooldown = 0;
        this.canJump = true;
        this.movingDirection = 0;
        this.otherDirection = false;
        this.x = 0;
        this.y = 0;
        this.IMAGES_ATTACK = [];
        this.IMAGES_WALKING = [];
        this.world = {
            character: {
                isHurt: () => false,
                hit: () => {}
            },
            updateHealthStatusBar: () => {}
        };
    }

    /**
     * Handles boss behavior when in attack range
     * @param {number} distanceToCharacter - Distance to the character
     * @param {boolean} characterIsLeft - Whether character is to the left of boss
     */
    handleAttackingBehavior(distanceToCharacter, characterIsLeft) {
        this.animateImages(this.IMAGES_ATTACK);
        this.updateMovementDirection(characterIsLeft);
        this.applyMovement();
        if (this.canJump && Math.random() < 1.2) {
            this.jump();
        }
        this.checkAttackCollision(distanceToCharacter);
    }

    /**
     * Checks if boss is close enough to attack character
     * @param {number} distanceToCharacter - Distance to the character
     */
    checkAttackCollision(distanceToCharacter) {
        if (distanceToCharacter < 80 && !this.world.character.isHurt()) {
            this.world.character.hit();
            this.world.updateHealthStatusBar();
        }
    }

    /**
    * Handles normal movement behavior
    * @param {boolean} characterIsLeft - Whether character is to the left of boss
    */
    handleNormalMovement(characterIsLeft) {
        this.animateImages(this.IMAGES_WALKING);
        this.updateMovementDirection(characterIsLeft);
        this.applyMovement();
        this.tryToJump();
    }

    /**
     * Applies movement based on current direction
     */
    applyMovement() {
        this.moveBasedOnDirection();
        this.playMovementSound();
        this.handleJumpingIfNeeded();
    }

    /**
     * Moves the boss based on current direction
     */
    moveBasedOnDirection() {
        if (this.movingDirection > 0) {
            this.x += this.speed;
            this.otherDirection = true;
        } else {
            this.x -= this.speed;
            this.otherDirection = false;
        }
    }

    /**
     * Handles jumping logic if boss is currently jumping
     */
    handleJumpingIfNeeded() {
        if (this.isJumping) {
            this.updateJumpPhysics();
        }

        this.updateJumpCooldown();
    }

    /**
     * Updates jump physics when boss is mid-jump
     */
    updateJumpPhysics() {
        this.y -= this.jumpSpeed;
        this.jumpSpeed -= 1;
        if (this.y >= 80) {
            this.y = 80;
            this.isJumping = false;
            this.jumpCooldown = 30;
        }
    }

    /**
     * Updates jump cooldown timer
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
     * Initiates a jump if conditions are met
     */
    tryToJump() {
        if (this.canJump && Math.random() < 0.03) {
            this.jump();
        }
    }

    /**
    * Makes the boss jump
    */
    jump() {
        if (!this.isJumping && this.canJump) {
            this.isJumping = true;
            this.jumpSpeed = 25;
            this.speed *= 1.2;
            setTimeout(() => {
                this.speed = 15;
            }, 1000);
        }
    }
}