/**
 * Class representing a chicken enemy in the game.
 * Extends the MovableObject class to inherit movement capabilities.
 */
class Chicken extends MovableObject{
    y = 335; 
    height = 100;
    width = 80; 
    isDead = false; 


    IMAGES_WALKING = [ 
        './assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        './assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        './assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];


    IMAGES_DEAD = [
        './assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ]

    /**
     * Creates a new Chicken instance with randomized position and speed.
     * Initializes animations and collision detection offsets.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]); 
        this.x = 250 + Math.random() * 2500; 
        this.speed = 0.15 + Math.random() * 0.5; 
        this.loadImages(this.IMAGES_WALKING); 
        this.loadImages(this.IMAGES_DEAD); 
        this.animate(); 
        this.offset = {
            top: 80,
            bottom: 10, 
            left: 5, 
            right: 5 
        };
    }

    /**
     * Sets up animation intervals for movement and sprite changes.
     * Handles different animations based on chicken state (alive/dead).
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
     * Handles chicken death sequence.
     * Sets death state and schedules removal from the game.
     */
    die() {
        this.isDead = true; 
        setTimeout(() => {
            this.toDelete = true; 
        }, 1500);
    }
}