/**
 * Represents a movable object in the game that can move, jump, and interact with other objects.
 * @class
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;
    energy = 100;
    lastHit = 0;
    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };

    /**
         * Applies gravity effect to the object, making it fall if above ground
         */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Checks if the object is above the ground level
     * @returns {boolean} True if above ground, false otherwise
     */
    isAboveGround() {
        return this.y < 180;
    }

    /**
     * Animates the object by cycling through a series of images
     * @param {string[]} images - Array of image paths to animate
     */
    animateImages(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Makes the object jump by setting a positive vertical speed
     */
    jump() {
        this.speedY = 18;
        this.acceleration = 1.5;
        this.playJumpSound();
        this.lastMoveTime = Date.now();
    }

    /**
     * Plays the jump sound effect
     */
    playJumpSound() {
        SoundManager.play('jump');
    }

    /**
     * Moves the object to the right
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Checks if this object is colliding with another movable object
     * @param {MovableObject} mo - The other movable object to check collision with
     * @returns {boolean} True if objects are colliding, false otherwise
     */
    isColliding(mo) {
        return (this.x + this.offset.left + this.width - this.offset.right) >= (mo.x + mo.offset.left) &&
            (this.x + this.offset.left) <= (mo.x + mo.offset.left + mo.width - mo.offset.right) &&
            (this.y + this.offset.top + this.height - this.offset.bottom) >= (mo.y + mo.offset.top) &&
            (this.y + this.offset.top) <= (mo.y + mo.offset.top + mo.height - mo.offset.bottom);
    }

    /**
     * Checks if this object is colliding with another object from the top
     * @param {MovableObject} mo - The other movable object to check collision with
     * @returns {boolean} True if colliding from top, false otherwise
     */
    isCollidingFromTop(mo) {
        return (this.x + this.offset.left + this.width - this.offset.right) > (mo.x + mo.offset.left) &&
            (this.x + this.offset.left) < (mo.x + mo.offset.left + mo.width - mo.offset.right) &&
            (this.y + this.offset.top + this.height - this.offset.bottom) < (mo.y + mo.offset.top + 0) &&
            (this.y + this.offset.top + this.height - this.offset.bottom) > (mo.y + mo.offset.top - 20) && 
            this.speedY < 0;
    }

    /**
     * Handles when the object gets hit, reducing energy and triggering hit effects
     */
    hit() {
        this.energy -= 20;
        if (this.world && !this.world.gameWon && !this.world.gameOver) {
            this.playHitSound();
        }
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Plays the hit sound effect
     */
    playHitSound() {
        SoundManager.play('hit');
    }

    /**
     * Checks if the object is currently in a hurt state
     * @returns {boolean} True if the object was recently hit, false otherwise
     */
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        return timePassed < 500;
    }

    /**
     * Checks if the object is dead (no energy left)
     * @returns {boolean} True if energy is zero, false otherwise
     */
    isDead() {
        return this.energy == 0;
    }
}