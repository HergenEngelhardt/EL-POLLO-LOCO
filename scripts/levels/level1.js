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
    [
        new Background('./assets/img/5_background/layers/air.png', -719),
        new Background('./assets/img/5_background/layers/3_third_layer/2.png', -719),
        new Background('./assets/img/5_background/layers/2_second_layer/2.png', -719),
        new Background('./assets/img/5_background/layers/1_first_layer/2.png', -719),

        new Background('./assets/img/5_background/layers/air.png', 0),
        new Background('./assets/img/5_background/layers/3_third_layer/1.png', 0),
        new Background('./assets/img/5_background/layers/2_second_layer/1.png', 0),
        new Background('./assets/img/5_background/layers/1_first_layer/1.png', 0),

        new Background('./assets/img/5_background/layers/air.png', 719),
        new Background('./assets/img/5_background/layers/3_third_layer/2.png', 719),
        new Background('./assets/img/5_background/layers/2_second_layer/2.png', 719),
        new Background('./assets/img/5_background/layers/1_first_layer/2.png', 719),

        new Background('./assets/img/5_background/layers/air.png', 719*2),
        new Background('./assets/img/5_background/layers/3_third_layer/1.png', 719*2),
        new Background('./assets/img/5_background/layers/2_second_layer/1.png', 719*2),
        new Background('./assets/img/5_background/layers/1_first_layer/1.png', 719*2),

        new Background('./assets/img/5_background/layers/air.png', 719*3),
        new Background('./assets/img/5_background/layers/3_third_layer/2.png', 719*3),
        new Background('./assets/img/5_background/layers/2_second_layer/2.png', 719*3),
        new Background('./assets/img/5_background/layers/1_first_layer/2.png', 719*3),

        new Background('./assets/img/5_background/layers/air.png', 719*4),
        new Background('./assets/img/5_background/layers/3_third_layer/1.png', 719*4),
        new Background('./assets/img/5_background/layers/2_second_layer/1.png', 719*4),
        new Background('./assets/img/5_background/layers/1_first_layer/1.png', 719*4),

        new Background('./assets/img/5_background/layers/air.png', 719*5),
        new Background('./assets/img/5_background/layers/3_third_layer/2.png', 719*5),
        new Background('./assets/img/5_background/layers/2_second_layer/2.png', 719*5),
        new Background('./assets/img/5_background/layers/1_first_layer/2.png', 719*5),

        new Background('./assets/img/5_background/layers/air.png', 719*6),
        new Background('./assets/img/5_background/layers/3_third_layer/1.png', 719*6),
        new Background('./assets/img/5_background/layers/2_second_layer/1.png', 719*6),
        new Background('./assets/img/5_background/layers/1_first_layer/1.png', 719*6)
    ],
    
);    
}