/**
 * Class representing clouds in the game environment.
 * Extends MovableObject to inherit movement capabilities.
 */
class Clouds extends MovableObject {

    /**
     * Creates a new cloud instance.
     * Initializes position, dimensions and animation.
     */
    constructor() {
        super().loadImage('./assets/img/5_background/layers/4_clouds/1.png');

        this.x = -800 + Math.random() * 6000;
        this.animate();
        this.y = 0;
        this.width = 500;
        this.height = 250;
    }

    /**
     * Animates the cloud by moving it from right to left.
     * Resets position when cloud moves beyond the left edge of the screen.
     */
    animate() {
        this.moveLeft();
        this.clearAnimationInterval();
        this.setupAnimation();
    }

    /**
     * Clears any existing animation interval
     */
    clearAnimationInterval() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
    }

    /**
     * Sets up the animation interval based on available systems
     */
    setupAnimation() {
        if (this.world && this.world.intervallManager) {
            this.setupManagedAnimation();
        } else {
            this.setupDirectAnimation();
        }
    }

    /**
     * Sets up animation using the world's interval manager
     */
    setupManagedAnimation() {
        this.animationInterval = this.world.intervallManager.registerInterval(
            setInterval(() => {
                this.animateCloud();
            }, 1000 / 60)
        );
    }

    /**
     * Sets up animation directly with setInterval when no manager is available
     */
    setupDirectAnimation() {
        this.animationInterval = setInterval(() => {
            this.animateCloud();
        }, 1000 / 60);
    }

    /**
     * Performs the actual cloud animation logic
     */
    animateCloud() {
        this.x -= 0.25;
        if (this.x < -500) {
            this.x = 800;
        }
    }
}