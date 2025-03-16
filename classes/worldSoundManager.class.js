/**
 * Handles all sound-related functionality for the game world
 * @class
 */
class WorldSoundManager {
    /**
     * Creates a new WorldSoundManager
     * @param {World} world - Reference to the main world
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Stops character sounds
     */
    stopCharacterSounds() {
        if (this.world.character) {
            this.world.character.stopRunningSound();
            this.world.character.stopSnoringSound();
        }
    }

    /**
     * Stops enemy sounds, particularly for boss enemies
     */
    stopEnemySounds() {
        if (this.world.level && this.world.level.enemies) {
            this.world.level.enemies.forEach(enemy => {
                if (enemy instanceof ChickenBoss) {
                    this.stopBossEnemySounds(enemy);
                }
            });
        }
    }

    /**
     * Stops sounds specific to boss enemies
     * @param {ChickenBoss} bossEnemy - The boss enemy to stop sounds for
     */
    stopBossEnemySounds(bossEnemy) {
        bossEnemy.playMovementSound = function () { };
        if (bossEnemy.alertSound) {
            bossEnemy.alertSound.pause();
            bossEnemy.alertSound.currentTime = 0;
            bossEnemy.alertSound = null;
        }
    }

    /**
     * Stops all game sound effects
     */
    stopGameSounds() {
        SoundManager.stopBackgroundMusic();
        SoundManager.stopAll();
    }

    /**
     * Stops all background sounds when game ends
     */
    stopAllBackgroundSounds() {
        this.stopCharacterSounds();
        this.stopEnemySounds();
        this.stopGameSounds();
    }

    /**
     * Toggles background music on/off
     */
    toggleBackgroundMusic() {
        if (!SoundManager.sounds['backgroundMusic'] || SoundManager.sounds['backgroundMusic'].paused) {
            SoundManager.playBackgroundMusic();
        } else {
            SoundManager.stopBackgroundMusic();
        }
    }
}