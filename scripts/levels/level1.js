/**
 * Level 1 configuration for El Pollo Loco game.
 * This file defines the layout and elements of the first level.
 * @module level1
 */

/**
 * Global variable that holds the Level 1 instance.
 * @type {Level}
 */
let level1;

/**
 * Initializes Level 1 by creating a new Level instance and populating it with
 * enemies, collectibles, and background elements.
 * @function
 * @returns {void}
 */
function initLevel1() {
    let backgrounds = [];
    let segmentWidth = 720;
    for (let i = -1; i <= 6; i++) {
        let variant = (i % 2 === 0) ? '1' : '2';
        let xPos = i * segmentWidth;
        backgrounds.push(
            new Background('./assets/img/5_background/layers/air.png', xPos),
            new Background(`./assets/img/5_background/layers/3_third_layer/${variant}.png`, xPos),
            new Background(`./assets/img/5_background/layers/2_second_layer/${variant}.png`, xPos),
            new Background(`./assets/img/5_background/layers/1_first_layer/${variant}.png`, xPos)
        );
    }

level1 = new Level(
    [
    new Chicken(),
    new Chicken(),
    new Chicken(),
    new ChickenSmall(),
    new ChickenSmall(),
    new ChickenSmall(),
    new ChickenSmall(),
    new ChickenBoss()
    ],
    [
        new Coin(),
        new Coin(),
        new Coin(),
        new Coin(),
        new Coin()
    ],
    [
        new SalsaBottle(),
        new SalsaBottle(),
        new SalsaBottle(),
        new SalsaBottle(),
        new SalsaBottle(),
        new SalsaBottle(),
        new SalsaBottle(),
        new SalsaBottle(),
        new SalsaBottle(),
        new SalsaBottle(),
        new SalsaBottle(),
        new SalsaBottle()
    ],
    [
        new Clouds(),
        new Clouds(),
        new Clouds(),
        new Clouds(),
        new Clouds(),
        new Clouds(),
        new Clouds()
    ],
    backgrounds
);    
}