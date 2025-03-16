/**
 * Class representing a status bar in the game.
 * Handles different types of status bars: health, coin, and bottle.
 * @extends DrawableObject
 */
class Statusbar extends DrawableObject {
    STATUSBAR_HEALTH = [
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];

    STATUSBAR_COIN = [
        './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png',
    ];

    STATUSBAR_BOTTLE = [
        './assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        './assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        './assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        './assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        './assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        './assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];

    percentage = 100;
    type = 'health';

    /**
    * Creates a new status bar.
    * @param {string} [type='health'] - Type of the status bar ('health', 'coin', or 'bottle').
    */
    constructor(type = 'health') {
        super();
        this.type = type;
        if (type === 'health') {
            this.loadImages(this.STATUSBAR_HEALTH);
            this.setPercentage(100);
        } else if (type === 'coin') {
            this.loadImages(this.STATUSBAR_COIN);
            this.setCoinPercentage(0);
        } else if (type === 'bottle') {
            this.loadImages(this.STATUSBAR_BOTTLE);
            this.setBottlePercentage(0);
        }
        this.x = 0;
        this.y = type === 'health' ? -15 : (type === 'coin' ? 30 : 80);
        this.width = 200;
        this.height = 80;
    }

    /**
     * Updates the health status bar percentage and corresponding image.
     * @param {number} percentage - The health percentage value (0-100).
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.STATUSBAR_HEALTH[this.resolveHealthImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
 * Updates the health status bar percentage and corresponding image.
 * @param {number} percentage - The health percentage value (0-100).
 */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.STATUSBAR_HEALTH[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Updates the coin status bar percentage and corresponding image.
     * @param {number} percentage - The coin percentage value (0-100).
     */
    setCoinPercentage(percentage) {
        this.percentage = percentage;
        let path = this.STATUSBAR_COIN[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Updates the bottle status bar percentage and corresponding image.
     * @param {number} percentage - The bottle percentage value (0-100).
     */
    setBottlePercentage(percentage) {
        this.percentage = percentage;
        let path = this.STATUSBAR_BOTTLE[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Determines the image index for any status bar based on current percentage.
     * @returns {number} Index of the image to display.
     */
    resolveImageIndex() {
        if (this.percentage == 0) {
            return 0;
        } else if (this.percentage <= 20) {
            return 1;
        } else if (this.percentage <= 40) {
            return 2;
        } else if (this.percentage <= 60) {
            return 3;
        } else if (this.percentage <= 80) {
            return 4;
        } else {
            return 5;
        }
    }
}