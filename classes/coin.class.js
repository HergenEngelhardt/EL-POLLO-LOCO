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
        this.x = 150 + Math.random() * 3500;
        this.y = 290 - Math.random() *  200;
        this.height = 100;
        this.width = 100;
        this.offset = { 
            left: 35,
            right: 35,
            top: 35,
            bottom: 35 
        };
    }

    /**
     * Play the sound effect when coin is collected.
     */
    playCollectSound() {        if (SoundManager.enabled) {
            SoundManager.play('collect', 0.3);
        }
    }
}