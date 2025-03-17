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
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_IDLE_LONG);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.applyGravity();
        this.currentImage = 0;
        this.world = {};
        this.isImmobilized = false;
        this.offset = {
            top: 85,
            bottom: 20,
            left: 25,
            right: 35
        };
        this.stateManager = new CharacterStateManager(this);
        this.movementController = new CharacterMovementController(this);
    }

    /**
     * Starts the character animation loops and resets move time
     */
    startAnimations() {
        this.lastMoveTime = Date.now();
        this.originalThrowBottle = this.world.throwBottle;
        this.animate();
    }

    /**
     * Main animation loop that handles character movement and updates
     */
    animate() {
        this.animationInterval = setInterval(() => {
            this.movementController.handleMovement();
        }, 1000 / 175);

        this.imageAnimationInterval = setInterval(() => {
            this.stateManager.updateCharacterImages();
        }, 200);
    }

    /**
     * Makes the object jump by setting a positive vertical speed
     * Overriding the parent class method to add custom jump behavior
     */
    jump() {
        super.jump();
        this.stateManager.startJumpAnimation();
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
    
    // Check if any enemy is a boss in alert phase
    for (let enemy of this.world.level.enemies) {
        // More robust check for boss in alert phase
        if (enemy.constructor.name === 'ChickenBoss' && enemy.alertPhase) {
            return true;
        }
    }
    return false;
}

/**
 * Triggers bottle throwing action with a cooldown period
 * @param {number} cooldownMs - Cooldown time in milliseconds (default: 1000)
 * @returns {boolean} - Whether the bottle was thrown
 */
throwBottle(cooldownMs = 20000) {

    if (this.world && this.world.level && this.world.level.enemies) {
        for (let enemy of this.world.level.enemies) {
            if (enemy instanceof ChickenBoss && enemy.alertPhase) {
                console.log('Boss is in alert phase, cannot throw bottle');
                return false; 
            }
        }
    }
    
    let currentTime = Date.now();
    if (this.world && (!this.lastBottleThrow || currentTime - this.lastBottleThrow >= cooldownMs)) {
        this.lastMoveTime = currentTime;
        this.lastBottleThrow = currentTime;
        return true;
    }
    return false;
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
}