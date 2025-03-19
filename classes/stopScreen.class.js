/**
 * Represents the game over screen that appears when the player loses.
 * @extends GameEndScreen
 */
class GameOverScreen extends GameEndScreen {
    /**
     * Creates a new GameOverScreen instance.
     */
    constructor() {
        super(
            './assets/img/9_intro_outro_screens/game_over/oh no you lost!.png',
            'losing'
        );
    }

    /**
     * Determines whether to show the game over screen
     * @returns {boolean} Whether to show the screen
     */
    shouldShowScreen() {
        return this.world && this.world.gameOver;
    }
}