class ChickenBossReset {
    /**
     * Creates a new ChickenBossReset instance
     * @param {ChickenBoss} boss - The boss character this reset controller belongs to
     */
    constructor(boss) {
        this.boss = boss;
    }

    /**
     * Resets the ChickenBoss to its initial state
     */
    reset() {
        this.resetBasicProperties();
        this.resetAnimationProperties();
        this.resetMovementProperties();
        this.resetCombatProperties();
        this.resetSounds();
        this.clearIntervals();
    }

    /**
     * Resets the basic properties of the boss
     */
    resetBasicProperties() {
        this.boss.hadfirstContact = false;
        this.boss.alertPhase = true;
        this.boss.energy = 100;
        this.boss.currentImage = 0;
        this.boss.showHealthBar = false;
        this.boss.healthBar.setPercentage(this.boss.energy);
        this.boss.toDelete = false;
        this.boss.soundDisabled = true;
    }

    /**
     * Resets the animation properties of the boss
     */
    resetAnimationProperties() {
        this.boss.animation.deathAnimationIndex = 0;
        this.boss.animation.deathAnimationPlayed = false;
        this.boss.animation.alertFrameCount = 0;
    }

    /**
     * Resets the movement properties of the boss
     */
    resetMovementProperties() {
        this.boss.movement.movingDirection = -1;
        this.boss.movement.lastDirectionChange = 0;
        this.boss.movement.canJump = true;
        this.boss.movement.isJumping = false;
        this.boss.movement.jumpCooldown = 0;
        this.boss.movement.jumpSpeed = 30;
        this.boss.movement.lastMovementSoundTime = Date.now() + 10000; 
    }

    /**
     * Resets the combat properties of the boss
     */
    resetCombatProperties() {
        this.boss.combat.attackCooldown = 0;
        this.boss.combat.lastHit = 0;
        this.boss.combat.bottleHitCount = 0;
    }

    /**
     * Resets all sound-related resources
     */
    resetSounds() {
        if (this.boss.alertSound) {
            this.boss.alertSound.pause();
            this.boss.alertSound.currentTime = 0;
            this.boss.alertSound = null;
        }
        
        if (this.boss.movementSoundInterval) {
            clearInterval(this.boss.movementSoundInterval);
            this.boss.movementSoundInterval = null;
        }
    }

    /**
     * Clears all animation and update intervals
     */
    clearIntervals() {
        if (this.boss.attackInterval) {
            clearInterval(this.boss.attackInterval);
            this.boss.attackInterval = null;
        }
        
        if (this.boss.animationInterval) {
            clearInterval(this.boss.animationInterval);
            this.boss.animationInterval = null;
        }
    }
}