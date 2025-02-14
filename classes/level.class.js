class Level {
    background;
    enemies;
    clouds;
    coins;
    salsaBottles;
    level_end_x = 1900;
    
    constructor(enemies, coins, salsaBottles, clouds, background) {
        this.enemies = enemies;
        this.coins = coins;  
        this.salsaBottles = salsaBottles;  
        this.clouds = clouds;  
        this.background = background;  
    }
}

