/**
 * Represents the final boss enemy in the game - a giant chicken boss
 * @extends MovableObject
 */
class ChickenBoss extends MovableObject {
    y = 80;
    height = 400;
    width = 220;
    x = 4000;
    healthBar = new Statusbar('health');
    showHealthBar = false;
    currentImage = 0;

    IMAGES_ALERT = [
        './assets/img/4_enemie_boss_chicken/2_alert/G5.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G6.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G7.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G8.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G9.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G10.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G12.png'
    ]

    IMAGES_ATTACK = [
        './assets/img/4_enemie_boss_chicken/3_attack/G13.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G14.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G15.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G16.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G17.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G18.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G19.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G20.png'
    ]

    IMAGES_HURT = [
        './assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
        './assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
        './assets/img/4_enemie_boss_chicken/4_hurt/G23.png',
    ]

    IMAGES_DEAD = [
        './assets/img/4_enemie_boss_chicken/5_dead/G24.png',
        './assets/img/4_enemie_boss_chicken/5_dead/G25.png',
        './assets/img/4_enemie_boss_chicken/5_dead/G26.png'
    ]

    IMAGES_WALKING = [
        './assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        './assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        './assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        './assets/img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    hadfirstContact = false;
    alertPhase = true;
    energy = 100;

    /**
     * Creates a new ChickenBoss instance and initializes animations
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.speed = 23;
        this.loadAllImages();
        this.setupInitialState();
        this.createComponents();
        this.animate();
    }

    /**
     * Loads all required image sets
     */
    loadAllImages() {
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
    }

    /**
     * Sets up initial state properties
     */
    setupInitialState() {
        this.world = {};
        this.toDelete = false;
        this.healthBar.width = 180;
        this.healthBar.height = 60;
        this.offset = {
            top: 25,
            bottom: 50,
            left: 20,
            right: 20
        };
    }

    /**
     * Creates animation, movement and combat components
     */
    createComponents() {
        this.animation = new ChickenBossAnimation(this);
        this.movement = new ChickenBossMovement(this);
        this.combat = new ChickenBossCombat(this);
    }

    /**
     * Controls animation and movement based on game state
     */
    animate() {
        this.animation.animate();
    }

    /**
     * Sets up the main animation interval
     */
    setupAnimationLoop() {
        this.animationInterval = setInterval(() => {
            if (!this.processCurrentState()) {
                this.handleCharacterInteraction();
            }
        }, 150);
    }

    /**
     * Processes current state (dead or hurt)
     * @returns {boolean} True if a state was processed and further processing should be stopped
     */
    processCurrentState() {
        if (this.isDead()) {
            this.animation.handleDeathState();
            return true;
        }

        if (this.isHurt()) {
            this.animation.handleHurtState();
            return true;
        }

        return false;
    }

    /**
     * Handles all character interaction logic
     */
    handleCharacterInteraction() {
        if (!this.isWorldCharacterAvailable()) {
            return;
        }

        let metrics = this.calculateCharacterMetrics();
        this.combat.checkCharacterCollision();
        this.handleFirstContact(metrics.distance, metrics.isLeft);

        this.updateBehaviorBasedOnContact(metrics);
    }

    /**
     * Checks if world character reference is available
     * @returns {boolean} True if world and character are available
     */
    isWorldCharacterAvailable() {
        return this.world && this.world.character;
    }

    /**
     * Updates behavior based on first contact status
     * @param {Object} metrics - Metrics containing distance and position data
     */
    updateBehaviorBasedOnContact(metrics) {
        if (this.hadfirstContact) {
            this.handleBossActiveBehavior(metrics.distance, metrics.isLeft);
        } else {
            this.animation.handleIdleState();
        }
    }

    /**
     * Calculates distance and relative position to character
     * @returns {Object} Object with distance and isLeft properties
     */
    calculateCharacterMetrics() {
        let distance = Math.abs(this.x - this.world.character.x);
        let isLeft = this.world.character.x < this.x;

        return {
            distance: distance,
            isLeft: isLeft
        };
    }

    /**
     * Handles first detection of character
     * @param {number} distanceToCharacter - Distance to the character
     * @param {boolean} characterIsLeft - Whether character is to the left of boss
     */
    handleFirstContact(distanceToCharacter, characterIsLeft) {
        if (!this.hadfirstContact && distanceToCharacter < 500) {
            this.initiateAlertPhase(characterIsLeft);
            this.immobilizeCharacter();
            this.playAlertSound();
        }
    }

    /**
     * Initiates the boss alert phase
     * @param {boolean} characterIsLeft - Whether character is to the left of boss
     */
    initiateAlertPhase(characterIsLeft) {
        this.hadfirstContact = true;
        this.alertPhase = true;
        this.animation.alertFrameCount = 0;
        this.otherDirection = !characterIsLeft;
    }

    /**
     * Immobilizes the character during the alert phase
     */
    immobilizeCharacter() {
        if (this.world && this.world.character) {
            this.world.character.isImmobilized = true;
        }
    }

    /**
     * Plays the boss alert sound with auto-stop timer
     */
    playAlertSound() {
        if (!this.alertSound) {
            this.alertSound = SoundManager.play('bossAlert', 0.5);
        }

        setTimeout(() => {
            this.stopAlertSound();
        }, 10000);
    }

    /**
     * Stops the alert sound and resets it
     */
    stopAlertSound() {
        if (this.alertSound) {
            this.alertSound.pause();
            this.alertSound.currentTime = 0;
        }
    }

    /**
     * Handles boss behavior when active (after first contact)
     * @param {number} distanceToCharacter - Distance to the character
     * @param {boolean} characterIsLeft - Whether character is to the left of boss
     */
    handleBossActiveBehavior(distanceToCharacter, characterIsLeft) {
        if (this.alertPhase) {
            this.handleAlertPhaseBehavior(characterIsLeft);
        } else {
            this.handleActiveCombatBehavior(distanceToCharacter, characterIsLeft);
        }
    }

    /**
     * Handles behavior during alert phase
     * @param {boolean} characterIsLeft - Whether character is to the left
     */
    handleAlertPhaseBehavior(characterIsLeft) {
        this.animation.handleAlertPhase(characterIsLeft);
    }

    /**
     * Handles behavior during active combat
     * @param {number} distanceToCharacter - Distance to the character
     * @param {boolean} characterIsLeft - Whether character is to the left
     */
    handleActiveCombatBehavior(distanceToCharacter, characterIsLeft) {
        this.combat.updateHealthBarPosition();

        if (distanceToCharacter < 300) {
            this.combat.handleAttackingBehavior(distanceToCharacter, characterIsLeft);
        } else {
            this.handleNormalMovement(characterIsLeft);
        }
    }

    /**
    * Handles normal movement behavior
    * @param {boolean} characterIsLeft - Whether character is to the left of boss
    */
    handleNormalMovement(characterIsLeft) {
        this.animation.animateImages(this.IMAGES_WALKING);
        this.movement.updateMovementDirection(characterIsLeft);
        this.movement.applyMovement();
        this.movement.tryToJump();
    }

    /**
     * Checks if boss is dead
     * @returns {boolean} True if energy is zero
     */
    isDead() {
        return this.combat.isDead();
    }

    /**
     * Checks if boss is hurt
     * @returns {boolean} True if boss was recently hit
     */
    isHurt() {
        return this.combat.isHurt();
    }

    /**
     * Handles boss taking damage
     */
    hit() {
        this.combat.hit();
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
        this.hadfirstContact = false;
        this.alertPhase = true;
        this.energy = 100;
        this.currentImage = 0;
        this.showHealthBar = false;
        this.healthBar.setPercentage(this.energy);
        this.toDelete = false;
        this.soundDisabled = true;
    }

    /**
     * Resets the animation properties of the boss
     */
    resetAnimationProperties() {
        this.animation.deathAnimationIndex = 0;
        this.animation.deathAnimationPlayed = false;
        this.animation.alertFrameCount = 0;
    }

    /**
     * Resets the movement properties of the boss
     */
    resetMovementProperties() {
        this.movement.movingDirection = -1;
        this.movement.lastDirectionChange = 0;
        this.movement.canJump = true;
        this.movement.isJumping = false;
        this.movement.jumpCooldown = 0;
        this.movement.jumpSpeed = 30;
        this.movement.lastMovementSoundTime = Date.now() + 10000; // 10 Sekunden Cooldown
    }

    /**
     * Resets the combat properties of the boss
     */
    resetCombatProperties() {
        this.combat.attackCooldown = 0;
        this.combat.lastHit = 0;
        this.combat.bottleHitCount = 0;
    }

    /**
     * Resets all sound-related resources
     */
    resetSounds() {
        if (this.alertSound) {
            this.alertSound.pause();
            this.alertSound.currentTime = 0;
            this.alertSound = null;
        }
        
        if (this.movementSoundInterval) {
            clearInterval(this.movementSoundInterval);
            this.movementSoundInterval = null;
        }
    }

    /**
     * Clears all animation and update intervals
     */
    clearIntervals() {
        if (this.attackInterval) {
            clearInterval(this.attackInterval);
            this.attackInterval = null;
        }
        
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }
}