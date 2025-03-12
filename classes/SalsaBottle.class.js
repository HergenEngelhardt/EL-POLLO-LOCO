/**
 * Class representing a throwable salsa bottle in the game.
 * Bottles can be thrown as projectiles and display splash animations on impact.
 * @extends MovableObject
 */
class SalsaBottle extends MovableObject {
    IMAGES_ROTATE = [
        './assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ]

    IMAGES_SPLASH = [
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ]

    /**
     * Creates a new salsa bottle object.
     * Initializes position, size, and collision offsets.
     */
    constructor() {
        super().loadImage('./assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.x = 250 + Math.random() * 3500;
        this.y = 350;
        this.height = 100;
        this.width = 80;
        this.hasBeenThrown = false;
        this.offset = {
            left: 20,
            right: 10,
            top: 40,
            bottom: 10
        };
    }

    /**
     * Sets the reference to the world object
     * @param {World} world - The game world
     */
    setWorld(world) {
        this.world = world;
    }

    /**
     * Initiates throwing the bottle from the specified position.
     * Sets up animation, physics, and movement.
     * @param {number} x - The x-coordinate to throw from
     * @param {number} y - The y-coordinate to throw from
     * @param {World} world - The game world
     */
    throw(x, y, world) {
        this.loadImages(this.IMAGES_ROTATE);
        this.x = x;
        this.y = y;
        this.height = 100;
        this.width = 80;
        this.hasBeenThrown = true;
        this.speedY = 15;
        this.speedX = 15;
        this.world = world;
        this.applyGravity();
        if (this.animationInterval) clearInterval(this.animationInterval);
        if (this.moveInterval) clearInterval(this.moveInterval);
        this.animate();
        this.move();
    }

    /**
     * Controls the bottle's movement after being thrown.
     * Applies physics and checks for ground collision.
     */
    move() {
        this.moveInterval = setInterval(() => {
            this.x += this.speedX;
            this.y -= this.speedY;
            this.speedY -= 1;
            if (this.y > 350) {
                this.splash();
                clearInterval(this.moveInterval);
            }
        }, 1000 / 60);
    }

    /**
     * Handles the bottle rotation animation while in flight.
     */
    animate() {
        this.animationInterval = setInterval(() => {
            this.animateImages(this.IMAGES_ROTATE);
        }, 100);
    }

    /**
     * Initiates the splash animation when bottle hits the ground.
     */
    splash() {
        this.loadImages(this.IMAGES_SPLASH);
        this.currentImage = 0;

        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }

        this.animateSplash();
    }

    /**
     * Controls the splash animation sequence.
     * Removes the bottle after animation completes.
     */
    animateSplash() {
        let splashInterval = setInterval(() => {
            this.animateImages(this.IMAGES_SPLASH);
            if (this.currentImage >= this.IMAGES_SPLASH.length) {
                clearInterval(splashInterval);
                this.removeBottle();
            }
        }, 100);
    }

    /**
     * Removes the bottle from the game world after splash animation.
     * Cleans up resources and moves the bottle offscreen.
     */
    removeBottle() {
        if (this.world && this.world.activeThrowableBottles) {
            let index = this.world.activeThrowableBottles.indexOf(this);
            if (index > -1) {
                this.world.activeThrowableBottles.splice(index, 1);
            }
        } else {
            console.warn('Cannot remove bottle: world reference or activeThrowableBottles missing');
        }
        this.img = null;
        this.x = -1000;
        this.y = -1000;
    }

    /**
    * Plays the bottle collection sound effect
    */
    playCollectSound() {
        let sound = new Audio('audio/collectBottle.mp3');
        sound.volume = 0.3;
        sound.play();
    }
}