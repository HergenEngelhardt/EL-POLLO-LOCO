/**
 * Manages enemy-related aspects during game restart
 */
class RestartEnemyManager {
    /**
     * Initializes enemies after level reset
     * @param {World} world - The game world object
     */
    initializeEnemies(world) {
        if (!world.level || !world.level.enemies) return;
        
        world.level.enemies.forEach(enemy => {
            this.initializeSingleEnemy(enemy, world);
        });
    }

    /**
     * Initializes a single enemy
     * @param {MovableObject} enemy - The enemy object
     * @param {World} world - The game world
     */
    initializeSingleEnemy(enemy, world) {
        this.setEnemyWorldReference(enemy, world);
        
        if (enemy instanceof Chicken || enemy instanceof ChickenSmall) {
            this.resetChickenEnemy(enemy);
        } else if (enemy instanceof ChickenBoss) {
            this.resetChickenBoss(enemy);
        }
    }

    /**
     * Sets the world reference for an enemy
     * @param {MovableObject} enemy - The enemy object
     * @param {World} world - The game world
     */
    setEnemyWorldReference(enemy, world) {
        if (typeof enemy.setWorld === 'function') {
            enemy.setWorld(world);
        }
    }

    /**
     * Resets properties of a chicken enemy
     * @param {Chicken|ChickenSmall} enemy - The chicken enemy
     */
    resetChickenEnemy(enemy) {
        enemy.isDead = false;
        enemy.toDelete = false;
        this.resetChickenOffset(enemy);
    }

    /**
     * Resets properties of the ChickenBoss
     * @param {ChickenBoss} boss - The ChickenBoss enemy
     */
    resetChickenBoss(boss) {
        boss.reset();
    }

    /**
     * Resets the offset for collision detection of a chicken enemy
     * @param {Chicken|ChickenSmall} enemy - The chicken enemy
     */
    resetChickenOffset(enemy) {
        enemy.offset = {
            top: enemy instanceof ChickenSmall ? 5 : 10,
            bottom: 10,
            left: 5,
            right: 5
        };
    }

    /**
     * Stops boss-related sounds
     */
    stopBossSounds() {
        SoundManager.stop('chickenboss');
        SoundManager.stop('bossAlert');
    }

    /**
     * Rebuilds boss sound objects
     */
    rebuildBossSounds() {
        if (SoundManager.sounds && SoundManager.sounds['chickenboss']) {
            SoundManager.sounds['chickenboss'] = new Audio('./audio/chickenboss.mp3');
        }
    }

    /**
     * Ensures that all Boss-Sounds are completely stopped
     */
    forceStopAllBossSounds() {
        this.stopBossSounds();
        this.rebuildBossSounds();
    }
}