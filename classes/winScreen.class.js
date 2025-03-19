/**
 * Represents the game win screen that appears when the player defeats the boss.
 * @extends GameEndScreen
 */
class GameWinScreen extends GameEndScreen {
    /**
     * Creates a new GameWinScreen instance.
     */
    constructor() {
        super(
            './assets/img/9_intro_outro_screens/win/win_2.png',
            'winning'
        );
        this.winAudio = null;
    }

    /**
     * Determines whether to show the win screen
     * @returns {boolean} Whether to show the screen
     */
    shouldShowScreen() {
        return this.world && this.world.gameWon;
    }

    /**
     * Stops the win sound if it's playing.
     */
    stopWinSound() {
        SoundManager.stop('winning');
    }

    /**
     * Override to additionally stop win sound
     */
    cleanupBeforeRestart() {
        this.stopWinSound();
        super.cleanupBeforeRestart();
    }

    /**
     * Override to additionally stop win sound
     */
    handleBackToMenu() {
        this.stopWinSound();
        super.handleBackToMenu();
    }
}