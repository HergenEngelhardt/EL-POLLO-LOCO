/**
 * Class representing a collectible coin in the game.
 * @extends MovableObject
 */
class Coin extends MovableObject {
    /**
     * Create a new coin object.
     * Coins appear at random positions within defined boundaries.
     */
    constructor() {
        super().loadImage('./assets/img/8_coin/coin_1.png');
        this.x = 150 + Math.random() * 1175;
        this.y = 290 - Math.random() *  200;
        this.height = 100;
        this.width = 100;
        this.offset = { 
            left: 20,
            right: 20,
            top: 20,
            bottom: 20 
        };
        this.collectSound = new Audio('./audio/collect.mp3');
    }

    /**
     * Play the sound effect when coin is collected.
     */
    playCollectSound() {
        this.collectSound.volume = 0.3;
        this.collectSound.play().catch(err => console.error('Error playing coin collect sound:', err));
    }
}