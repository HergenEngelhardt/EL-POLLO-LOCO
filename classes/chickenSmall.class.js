/**
 * Represents a small chicken enemy in the game
 * @extends MovableObject
 */
class ChickenSmall extends MovableObject {
    y = 355;
    height = 80;
    width = 50;
    isDead = false;

    IMAGES_WALKING = [
        './assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        './assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        './assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        './assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ]

    /**
     * Creates a new small chicken enemy
     * Initializes position, speed, and starts animation
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.x = 250 + Math.random() * 3000;
        this.speed = 0.15 + Math.random() * 0.5;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.world = null;
        this.offset = {
            top: 105,
            bottom: 10,
            left: 5,
            right: 5
        };
    }

    /**
    * Sets the reference to the world object
    * @param {World} world - The game world
    */
    setWorld(world) {
        this.world = world;
        this.animate(); 
    }

    /**
     * Sets up animation intervals for movement and sprite changes
     */
    animate() {
        this.clearAnimationIntervals();
        if (this.world && this.world.intervallManager) {
            this.setupMovementAnimation();
            this.setupImageAnimation();
        } else {
            this.setupBasicAnimation(); 
        }
    }

    /**
     * Clears any existing animation intervals
     */
    clearAnimationIntervals() {
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
        }
        if (this.animateInterval) {
            clearInterval(this.animateInterval);
        }
    }

    /**
     * Sets up basic animation when interval manager isn't available
     */
    setupBasicAnimation() {
        this.moveInterval = setInterval(() => {
            if (!this.isDead) {
                this.moveLeft();
            }
        }, 1000 / 60);
        
        this.animateInterval = setInterval(() => {
            if (this.isDead) {
                this.loadImage(this.IMAGES_DEAD[0]);
            } else {
                this.animateImages(this.IMAGES_WALKING);
            }
        }, 200);
    }

    /**
     * Sets up the movement animation interval
     */
    setupMovementAnimation() {
        this.moveInterval = this.world.intervallManager.registerInterval(
            setInterval(() => {
                if (!this.isDead) {
                    this.moveLeft();
                }
            }, 1000 / 60)
        );
    }

    /**
     * Sets up the image animation interval
     */
    setupImageAnimation() {
        this.animateInterval = this.world.intervallManager.registerInterval(
            setInterval(() => {
                if (this.isDead) {
                    this.loadImage(this.IMAGES_DEAD[0]);
                } else {
                    this.animateImages(this.IMAGES_WALKING);
                }
            }, 200)
        );
    }

    /**
     * Handles chicken death
     * Sets isDead flag and schedules object for deletion after delay
     */
    die() {
        this.isDead = true;
        setTimeout(() => {
            this.toDelete = true;
        }, 1500);
    }

    /**
    * Handles the small chicken being hit by a salsa bottle.
    * Kills the chicken on hit and plays sound effect.
    */
    hitByBottle() {
        if (!this.isDead) {
            this.die();
            SoundManager.play('punch');
        }
    }
}