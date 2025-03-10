/**
 * Class representing clouds in the game environment.
 * Extends MovableObject to inherit movement capabilities.
 */
class Clouds extends MovableObject{

    /**
     * Creates a new cloud instance.
     * Initializes position, dimensions and animation.
     */
    constructor() {
        super().loadImage('./assets/img/5_background/layers/4_clouds/1.png');

        this.x = -100 + Math.random() * 800;
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
        setInterval(() => {
            this.x -= 0.25;
            if (this.x < -500) {
                this.x = 800;
            }
        }, 1000 / 60)
    }
}