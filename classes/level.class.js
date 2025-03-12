/**
 * Represents a game level with various elements.
 * @class
 */
class Level {
    background;
    enemies;
    clouds;
    coins;
    salsaBottles;
    level_end_x = 5000;
    
    
    /**
     * Creates a new Level instance
     * @param {Object[]} enemies - Array of enemy objects
     * @param {Object[]} coins - Array of coin objects
     * @param {Object[]} salsaBottles - Array of salsa bottle objects
     * @param {Object[]} clouds - Array of cloud objects
     * @param {Object[]} background - Array of background elements
     */
    constructor(enemies, coins, salsaBottles, clouds, background) {
        this.enemies = enemies;
        this.coins = coins;  
        this.salsaBottles = salsaBottles;  
        this.clouds = clouds;  
        this.background = background;  
    }
}

