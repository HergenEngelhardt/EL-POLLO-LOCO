/**
 * Represents a small chicken enemy in the game
 * @extends MovableObject
 */
class ChickenSmall extends MovableObject{
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
        this.x = 250 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
        this.offset = {
            top: 40,
            bottom: 10,
            left: 5,
            right: 5
        };
    }

    /**
     * Sets up animation intervals for movement and sprite changes
     */
    animate() {
        setInterval(() => {
            if (!this.isDead) {
                this.moveLeft();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead) {
                this.loadImage(this.IMAGES_DEAD[0]);
            } else {
                this.animateImages(this.IMAGES_WALKING);
            }
        }, 200);
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
}