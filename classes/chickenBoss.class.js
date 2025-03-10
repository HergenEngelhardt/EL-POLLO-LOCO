/**
 * Represents the final boss enemy in the game - a giant chicken boss
 * @extends MovableObject
 */
class ChickenBoss extends MovableObject {
    y = 80;
    height = 400;
    width = 220;
    x = 1700;
    healthBar = new Statusbar('health');
    showHealthBar = false;

    IMAGES_ALERT = [
        'assets/img/4_enemie_boss_chicken/2_alert/G5.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G6.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G7.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G8.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G9.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G10.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G12.png'
    ]

    IMAGES_ATTACK = [
        'assets/img/4_enemie_boss_chicken/3_attack/G13.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G14.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G15.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G16.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G17.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G18.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G19.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G20.png'
    ]

    IMAGES_HURT = [
        'assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G23.png',
    ]

    IMAGES_DEAD = [
        'assets/img/4_enemie_boss_chicken/5_dead/G24.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G25.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G26.png'
    ]

    IMAGES_WALKING = [
        '/assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        '/assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        '/assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        '/assets/img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    hadfirstContact = false;
    alertPhase = true;
    alertFrameCount = 0;
    movingDirection = -1;
    lastDirectionChange = 0;
    attackCooldown = 0;
    energy = 100;
    lastHit = 0;
    deathAnimationPlayed = false;
    deathAnimationIndex = 0;

    /**
     * Creates a new ChickenBoss instance and initializes animations
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.speed = 7.5;
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.world = {};
        this.animate();
        this.toDelete = false;
        this.healthBar.width = 180;
        this.healthBar.height = 60;
        this.offset = {
            top: 25,
            bottom: 50,
            left: 20,
            right: 20
        };
    }

    /**
     * Controls animation and movement based on game state
     */
    animate() {
        this.setupAnimationLoop();
    }

    /**
     * Sets up the main animation interval
     */
    setupAnimationLoop() {
        setInterval(() => {
            if (!this.processCurrentState()) {
                this.handleCharacterInteraction();
            }
        }, 150);
    }

    /**
     * Processes current state (dead or hurt)
     * @returns {boolean} True if a state was processed and further processing should be stopped
     */
    processCurrentState() {
        if (this.isDead()) {
            this.handleDeathState();
            return true;
        }

        if (this.isHurt()) {
            this.handleHurtState();
            return true;
        }

        return false;
    }

    /**
     * Handles all character interaction logic
     */
    handleCharacterInteraction() {
        if (!this.world || !this.world.character) {
            return;
        }

        const metrics = this.calculateCharacterMetrics();
        this.checkCharacterCollision();
        this.handleFirstContact(metrics.distance, metrics.isLeft);

        if (this.hadfirstContact) {
            this.handleBossActiveBehavior(metrics.distance, metrics.isLeft);
        } else {
            this.handleIdleState();
        }
    }

    /**
     * Calculates distance and relative position to character
     * @returns {Object} Object with distance and isLeft properties
     */
    calculateCharacterMetrics() {
        const distance = Math.abs(this.x - this.world.character.x);
        const isLeft = this.world.character.x < this.x;

        return {
            distance: distance,
            isLeft: isLeft
        };
    }

    /**
     * Handles boss behavior when dead
     */
    handleDeathState() {
        if (!this.deathAnimationPlayed) {
            this.playDeathAnimation();
        }
    }

    /**
     * Handles boss behavior when hurt
     */
    handleHurtState() {
        this.animateImages(this.IMAGES_HURT);
    }

    /**
     * Checks for collision with character and damages character if needed
     */
    checkCharacterCollision() {
        if (this.isColliding(this.world.character) && !this.world.character.isHurt()) {
            this.world.character.hit();
            this.world.updateHealthStatusBar();
        }
    }

    /**
     * Handles first detection of character
     * @param {number} distanceToCharacter - Distance to the character
     * @param {boolean} characterIsLeft - Whether character is to the left of boss
     */
    handleFirstContact(distanceToCharacter, characterIsLeft) {
        if (!this.hadfirstContact && distanceToCharacter < 500) {
            this.hadfirstContact = true;
            this.alertPhase = true;
            this.alertFrameCount = 0;
            this.otherDirection = !characterIsLeft;
        }
    }

    /**
     * Handles boss behavior when active (after first contact)
     * @param {number} distanceToCharacter - Distance to the character
     * @param {boolean} characterIsLeft - Whether character is to the left of boss
     */
    handleBossActiveBehavior(distanceToCharacter, characterIsLeft) {
        if (this.alertPhase) {
            this.handleAlertPhase(characterIsLeft);
        } else {
            this.updateHealthBarPosition();

            if (distanceToCharacter < 300) {
                this.handleAttackingBehavior(distanceToCharacter);
            } else {
                this.handleNormalMovement();
            }
        }
    }

    /**
     * Handles the alert phase animation and state
     * @param {boolean} characterIsLeft - Whether character is to the left of boss
     */
    handleAlertPhase(characterIsLeft) {
        this.otherDirection = !characterIsLeft;
        this.animateImages(this.IMAGES_ALERT);
        this.alertFrameCount++;

        if (this.alertFrameCount >= 12) {
            this.alertPhase = false;
            this.showHealthBar = true;
        }
    }

    /**
     * Handles boss behavior when in attack range
     * @param {number} distanceToCharacter - Distance to the character
     */
    handleAttackingBehavior(distanceToCharacter) {
        this.animateImages(this.IMAGES_ATTACK);
        this.updateMovementDirection();
        this.applyMovement();

        if (distanceToCharacter < 80 && !this.world.character.isHurt()) {
            this.world.character.hit();
            this.world.updateHealthStatusBar();
        }
    }

    /**
     * Handles normal movement behavior
     */
    handleNormalMovement() {
        this.animateImages(this.IMAGES_WALKING);
        this.updateMovementDirection();
        this.applyMovement();
    }

    /**
     * Updates movement direction based on timer
     */
    updateMovementDirection() {
        if (Date.now() - this.lastDirectionChange > 4000) {
            this.movingDirection *= -1;
            this.lastDirectionChange = Date.now();
        }
    }

    /**
     * Applies movement based on current direction
     */
    applyMovement() {
        if (this.movingDirection > 0) {
            this.x += this.speed;
            this.otherDirection = true;
        } else {
            this.x -= this.speed;
            this.otherDirection = false;
        }
    }

    /**
     * Sets the boss to idle state
     */
    handleIdleState() {
        this.img = this.imageCache[this.IMAGES_WALKING[0]];
    }

    /**
     * Plays the death animation sequence
     */
    playDeathAnimation() {
        let deathInterval = setInterval(() => {
            if (this.deathAnimationIndex >= this.IMAGES_DEAD.length) {
                clearInterval(deathInterval);
                this.deathAnimationPlayed = true;
                this.toDelete = true;

                if (this.world) {
                    this.world.gameWon = true;
                }

                return;
            }

            let path = this.IMAGES_DEAD[this.deathAnimationIndex];
            this.img = this.imageCache[path];
            this.deathAnimationIndex++;
        }, 200);
    }

    /**
     * Updates health bar position to follow boss
     */
    updateHealthBarPosition() {
        this.healthBar.x = this.x + 20;
        this.healthBar.y = this.y - 30;
    }

    /**
     * Handles boss taking damage
     */
    hit() {
        this.energy -= 15;
        this.lastHit = new Date().getTime();
        this.playHitSound();
        if (this.energy < 0) {
            this.energy = 0;
        }
        this.healthBar.setPercentage(this.energy);
    }

    /**
     * Plays sound effect when hit
     */
    playHitSound() {
        let audio = new Audio('./audio/punch-140236.mp3');
        audio.play().catch(error => {
            console.error('Error playing boss hit sound:', error);
        });
    }

    /**
     * Checks if boss is dead
     * @returns {boolean} True if energy is zero
     */
    isDead() {
        return this.energy <= 0;
    }
}