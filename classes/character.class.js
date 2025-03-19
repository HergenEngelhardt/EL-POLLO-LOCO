/**
 * Represents the playable character in the game
 * Handles movement, animations, and character states
 * @extends MovableObject
 */
class Character extends MovableObject {
    y = 80;
    width = 130;
    height = 250;
    speed = 3;
    deadAnimationPlayed = false;
    lastMoveTime = Date.now();
    jumpAnimationActive = false;
    jumpAnimationFrame = 0;
    jumpAnimationComplete = false;
    lastBottleThrow = 0;
    originalThrowBottle = null;

    IMAGES_IDLE = [
        './assets/img/2_character_pepe/1_idle/idle/I-1.png',
        './assets/img/2_character_pepe/1_idle/idle/I-2.png',
        './assets/img/2_character_pepe/1_idle/idle/I-3.png',
        './assets/img/2_character_pepe/1_idle/idle/I-4.png',
        './assets/img/2_character_pepe/1_idle/idle/I-5.png',
        './assets/img/2_character_pepe/1_idle/idle/I-6.png',
        './assets/img/2_character_pepe/1_idle/idle/I-7.png',
        './assets/img/2_character_pepe/1_idle/idle/I-8.png',
        './assets/img/2_character_pepe/1_idle/idle/I-9.png',
        './assets/img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_IDLE_LONG = [
        './assets/img/2_character_pepe/1_idle/long_idle/I-11.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-12.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-13.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-14.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-15.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-16.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-17.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-18.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-19.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    IMAGES_WALKING = [
        './assets/img/2_character_pepe/2_walk/W-21.png',
        './assets/img/2_character_pepe/2_walk/W-22.png',
        './assets/img/2_character_pepe/2_walk/W-23.png',
        './assets/img/2_character_pepe/2_walk/W-24.png',
        './assets/img/2_character_pepe/2_walk/W-25.png',
        './assets/img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        './assets/img/2_character_pepe/3_jump/J-31.png',
        './assets/img/2_character_pepe/3_jump/J-32.png',
        './assets/img/2_character_pepe/3_jump/J-33.png',
        './assets/img/2_character_pepe/3_jump/J-34.png',
        './assets/img/2_character_pepe/3_jump/J-35.png',
        './assets/img/2_character_pepe/3_jump/J-36.png',
        './assets/img/2_character_pepe/3_jump/J-37.png',
        './assets/img/2_character_pepe/3_jump/J-38.png',
        './assets/img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_HURT = [
        './assets/img/2_character_pepe/4_hurt/H-41.png',
        './assets/img/2_character_pepe/4_hurt/H-42.png',
        './assets/img/2_character_pepe/4_hurt/H-43.png'
    ];


    IMAGES_DEAD = [
        './assets/img/2_character_pepe/5_dead/D-51.png',
        './assets/img/2_character_pepe/5_dead/D-52.png',
        './assets/img/2_character_pepe/5_dead/D-53.png',
        './assets/img/2_character_pepe/5_dead/D-54.png',
        './assets/img/2_character_pepe/5_dead/D-55.png',
        './assets/img/2_character_pepe/5_dead/D-56.png',
        './assets/img/2_character_pepe/5_dead/D-57.png'
    ];

    /**
      * Creates a new character instance and loads all required images
      */
    constructor() {
        super().loadImage(this.IMAGES_JUMPING[0]);
        this.loadAllCharacterImages();
        this.initializeComponents();
        this.setupCharacterState();
    }

    /**
     * Loads all character image sets
     */
    loadAllCharacterImages() {
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_IDLE_LONG);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
    }

    /**
     * Initializes character components
     */
    initializeComponents() {
        this.stateManager = new CharacterStateManager(this);
        this.movementController = new CharacterMovementController(this);
        this.applyGravity();
    }

    /**
     * Sets up initial character state
     */
    setupCharacterState() {
        this.currentImage = 0;
        this.world = {};
        this.isImmobilized = false;
        this.offset = {
            top: 85,
            bottom: 20,
            left: 25,
            right: 35
        };
    }

    /**
     * Starts the character animation loops and resets move time
     */
    startAnimations() {
        this.lastMoveTime = Date.now();
        this.originalThrowBottle = this.world.throwBottle;
        if (this.gravityInterval) {
            clearInterval(this.gravityInterval);
            this.gravityInterval = null;
        }
        this.applyGravity();
        
        this.animate();
    }

    /**
     * Main animation loop that handles character movement and updates
     */
    animate() {
        this.clearAnimationIntervals();
        this.setupMovementAnimation();
        this.setupImageAnimation();
    }

    /**
     * Clears any existing animation intervals
     */
    clearAnimationIntervals() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        if (this.imageAnimationInterval) {
            clearInterval(this.imageAnimationInterval);
            this.imageAnimationInterval = null;
        }
        if (this.stateManager && this.stateManager.jumpAnimationInterval) {
            clearInterval(this.stateManager.jumpAnimationInterval);
            this.stateManager.jumpAnimationInterval = null;
        }
    }

    /**
     * Sets up the movement animation interval
     */
    setupMovementAnimation() {
        this.animationInterval = this.world.intervallManager.registerInterval(
            setInterval(() => {
                this.movementController.handleMovement();
            }, 1000 / 175)
        );
    }

    /**
     * Sets up the character image animation interval
     */
    setupImageAnimation() {
        this.imageAnimationInterval = this.world.intervallManager.registerInterval(
            setInterval(() => {
                this.stateManager.updateCharacterImages();
            }, 200)
        );
    }

    /**
     * Makes the object jump by setting a positive vertical speed
     * Overriding the parent class method to add custom jump behavior
     */
    jump() {
        if (!this.isAboveGround()) {
            this.speedY = 18;
            this.acceleration = 1.5;
            this.playJumpSound();
            this.lastMoveTime = Date.now();
            this.stateManager.startJumpAnimation();
        }
    }

    /**
     * Checks if the character is currently moving
     * @returns {boolean} True if moving left or right
     */
    isMoving() {
        return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
    }

    /**
     * Checks if the character is in a long idle state
     * @returns {boolean} True if idle for more than 6 seconds and game is active
     */
    isInLongIdleState() {
        return Date.now() - this.lastMoveTime > 6000 &&
            !this.world.gameOver &&
            !this.world.gameWon;
    }

    /**
    * Resets the idle timer to wake character from idle/sleeping state
    * Called when throwing a bottle
    */
    resetIdleTimer() {
        this.lastMoveTime = Date.now();
        if (this.isInLongIdleState()) {
            this.stopSnoringSound();
        }
    }

    /**
    * Overrides the hit method from MovableObject
    * Wakes character from idle mode when hit
    */
    hit() {
        super.hit();
        this.lastMoveTime = Date.now();
        this.stopSnoringSound();
    }

    /**
     * Plays the snoring sound effect
     */
    playSnoringSound() {
        SoundManager.play('snoring', 0.1, true);
    }

    /**
     * Stops the snoring sound effect
     */
    stopSnoringSound() {
        SoundManager.stop('snoring');
    }

    /**
     * Animates through an array of images
     * @param {Array<string>} images - Array of image paths to animate
     */
    animateImages(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;

        if (images === this.IMAGES_DEAD && i === images.length - 1) {
            this.deadAnimationPlayed = true;
        }
    }

    /**
     * Plays the running sound effect if not already playing
     */
    playRunningSound() {
        SoundManager.play('running', 0.6, true);
    }

    /**
     * Stops the running sound effect and resets it
     */
    stopRunningSound() {
        SoundManager.stop('running');
    }

    /**
     * Checks if any boss in the world is in alert phase
     * @returns {boolean} True if a boss is in alert phase
     */
    isBossInAlertPhase() {
        if (!this.world || !this.world.level || !this.world.level.enemies) {
            return false;
        }

        for (let enemy of this.world.level.enemies) {
            if (enemy.constructor.name === 'ChickenBoss' && enemy.alertPhase) {
                return true;
            }
        }
        return false;
    }

    /**
     * Triggers bottle throwing action with a cooldown period
     * @param {number} cooldownMs - Cooldown time in milliseconds (default: 20000)
     * @returns {boolean} - Whether the bottle was thrown
     */
    throwBottle(cooldownMs = 20000) {
        if (this.isBossInAlertPhase()) {
            return false;
        }

        if (this.hasThrowCooldownExpired(cooldownMs)) {
            this.updateThrowTimestamps();
            return true;
        }
        
        return false;
    }

    /**
     * Checks if enough time has passed since the last bottle throw
     * @param {number} cooldownMs - Cooldown time in milliseconds
     * @returns {boolean} True if cooldown has expired
     */
    hasThrowCooldownExpired(cooldownMs) {
        if (!this.world) return false;
        
        let currentTime = Date.now();
        return !this.lastBottleThrow || currentTime - this.lastBottleThrow >= cooldownMs;
    }

    /**
     * Updates timestamps when a bottle is thrown
     */
    updateThrowTimestamps() {
        let currentTime = Date.now();
        this.lastMoveTime = currentTime;
        this.lastBottleThrow = currentTime;
    }

    /**
     * Resets the world.throwBottle method to its original state
     */
    resetThrowBottle() {
        if (this.originalThrowBottle) {
            this.world.throwBottle = this.originalThrowBottle;
            this.originalThrowBottle = null;
        }
    }

    /**
     * Resets the character to its initial state
     */
    reset() {
        this.x = 100; 
        this.y = 80;
        this.speedY = 0;
        this.otherDirection = false;
        this.isImmobilized = false;
        this.deadAnimationPlayed = false;
        this.energy = 100;
        this.lastHit = 0;
        this.lastMoveTime = Date.now();
        this.lastBottleThrow = 0;
        this.currentImage = 0;
        this.img = this.imageCache[this.IMAGES_IDLE[0]];
        if (this.stateManager) {
            this.stateManager.resetJumpAnimation();
        }
    }
}