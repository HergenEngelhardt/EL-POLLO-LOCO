class Character extends MovableObject {
    y = 80;
    width = 130;
    height = 250;
    speed = 4;
    deadAnimationPlayed = false;
    lastMoveTime = Date.now();
    runningSound = new Audio('audio/running-1-6846.mp3');

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
        '../assets/img/2_character_pepe/2_walk/W-22.png',
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
        this.offset = {
            top: 85,
            bottom: -10,
            left: 10,
            right: 20
        };
    }

    /**
     * Starts the character animation loops and resets move time
     */
    startAnimations() {
        this.lastMoveTime = Date.now();
        this.animate();
    }

    /**
     * Main animation loop that handles character movement and updates
     */
    animate() {
        this.animationInterval = setInterval(() => {
            this.handleMovement();
        }, 1000 / 175);

        this.imageAnimationInterval = setInterval(() => {
            this.updateCharacterImages();
        }, 100);
    }

    /**
     * Handles character movement based on keyboard input
     */
    handleMovement() {
        if (!this.isDead() || !this.deadAnimationPlayed) {
            this.handleHorizontalMovement();
            this.handleJump();
            this.updateCameraPosition();
        } else {
            clearInterval(this.animationInterval);
            this.world.gameOver = true;
        }
    }

    /**
     * Handles left/right movement based on keyboard input
     */
    handleHorizontalMovement() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
            this.lastMoveTime = Date.now();
        } else if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
            this.lastMoveTime = Date.now();
        } else {
            this.stopRunningSound();
        }
    }

    /**
     * Handles jump action based on keyboard input
     */
    handleJump() {
        if (this.world.keyboard.JUMP && !this.isAboveGround()) {
            this.jump();
            this.lastMoveTime = Date.now();
        }
    }

    /**
     * Updates the camera position relative to character
     */
    updateCameraPosition() {
        this.world.camera_x = -this.x;
    }

    /**
     * Updates character images based on current state
     */
    updateCharacterImages() {
        if (this.isDead()) {
            this.animateImages(this.IMAGES_DEAD);
        } else if (this.isHurt()) {
            this.animateImages(this.IMAGES_HURT);
        } else if (this.isAboveGround()) {
            this.animateImages(this.IMAGES_JUMPING);
        } else {
            this.updateGroundedImages();
        }
    }

    /**
     * Updates images for character when on the ground
     */
    updateGroundedImages() {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.animateImages(this.IMAGES_WALKING);
        } else if (Date.now() - this.lastMoveTime > 6000) {
            this.animateImages(this.IMAGES_IDLE_LONG);
        } else {
            this.animateImages(this.IMAGES_IDLE);
        }
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
     * Moves the character right and handles sound effects
     */
    moveRight() {
        super.moveRight();
        if (!this.isAboveGround()) {
            this.playRunningSound();
        } else {
            this.stopRunningSound();
        }
    }

    /**
     * Moves the character left and handles sound effects
     */
    moveLeft() {
        super.moveLeft();
        if (!this.isAboveGround()) {
            this.playRunningSound();
        } else {
            this.stopRunningSound();
        }
    }

    /**
     * Plays the running sound effect if not already playing
     */
    playRunningSound() {
        if (this.runningSound.paused) {
            this.runningSound.play().catch(error => {
                console.error('Error playing running sound:', error);
            });
        }
    }

    /**
     * Stops the running sound effect and resets it
     */
    stopRunningSound() {
        if (!this.runningSound.paused) {
            this.runningSound.pause();
            this.runningSound.currentTime = 0;
        }
    }

    /**
     * Triggers bottle throwing action and updates last move time
     */
    throwBottle() {
        if (this.world) {
            this.world.throwBottle();
            this.lastMoveTime = Date.now();
        }
    }
}