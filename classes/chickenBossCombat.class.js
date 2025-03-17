/**
 * Handles combat logic for the chicken boss enemy
 * @class
 */
class ChickenBossCombat {
    /**
     * Creates a new ChickenBossCombat instance
     * @param {Object} boss - The boss entity this combat system belongs to
     */
    constructor(boss) {
        this.boss = boss;
        this.attackCooldown = 0;
        this.lastHit = 0;
        this.bottleHitCount = 0;
    }

    /**
     * Applies damage to the boss and updates its state
     */
    hit() {
        this.boss.energy -= 20;
        this.lastHit = new Date().getTime();
        if (this.boss.world && !this.boss.world.gameWon && !this.boss.world.gameOver) {
            this.playHitSound();
        }
        if (this.boss.energy < 0) {
            this.boss.energy = 0;
        }
        this.boss.healthBar.setPercentage(this.boss.energy);
    }

    /**
     * Plays the sound effect when the boss is hit
     */
    playHitSound() {
        SoundManager.play('punch');
    }

    /**
     * Checks if the boss has no energy left
     * @returns {boolean} True if the boss is dead, false otherwise
     */
    isDead() {
        return this.boss.energy <= 0;
    }

    /**
     * Determines if the boss is currently in a hurt state
     * @returns {boolean} True if the boss was recently hit, false otherwise
     */
    isHurt() {
        let timeSinceHit = new Date().getTime() - this.lastHit;
        return timeSinceHit < 500;
    }

    /**
     * Checks if the boss is colliding with the character and damages the character if needed
     */
    checkCharacterCollision() {
        if (this.boss.isColliding(this.boss.world.character) && !this.boss.world.character.isHurt()) {
            this.boss.world.character.hit();
            this.boss.world.updateHealthStatusBar();
        }
    }

    /**
     * Controls the boss's attacking behavior based on character position
     * @param {number} distanceToCharacter - The distance between boss and character
     * @param {boolean} characterIsLeft - Whether the character is to the left of the boss
     */
    handleAttackingBehavior(distanceToCharacter, characterIsLeft) {
        this.boss.animation.animateImages(this.boss.IMAGES_ATTACK);
        this.boss.movement.updateMovementDirection(characterIsLeft);
        this.boss.speed = 30;
        this.boss.movement.applyMovement();

        if (this.boss.movement.canJump && Math.random() < 0.75) {
            this.boss.movement.jump();
        }

        this.checkAttackCollision(distanceToCharacter);
    }

    /**
     * Checks if the boss is close enough to attack the character
     * @param {number} distanceToCharacter - The distance between boss and character
     */
    checkAttackCollision(distanceToCharacter) {
        if (distanceToCharacter < 150 && !this.boss.world.character.isHurt()) {
            this.boss.world.character.hit();
            SoundManager.play('chickenboss', 0.5);
            this.boss.world.updateHealthStatusBar();
        }
    }

    /**
     * Updates the position of the boss's health bar to follow the boss
     */
    updateHealthBarPosition() {
        this.boss.healthBar.x = this.boss.x + 20;
        this.boss.healthBar.y = this.boss.y - 30;
    }
}