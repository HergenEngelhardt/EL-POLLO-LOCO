class ChickenBoss extends MovableObject {
    y = 80;
    height = 400;
    width = 220;
    x = 1700;

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
    
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.speed = 0.15 + Math.random() * 0.5;
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.world = {};
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.isDead()) {
                this.animateImages(this.IMAGES_DEAD);
                return;
            }
            
            if (this.isHurt()) {
                this.animateImages(this.IMAGES_HURT);
                return;
            }

            if (this.world && this.world.character) {
                const distanceToCharacter = Math.abs(this.x - this.world.character.x);
                
                if (!this.hadfirstContact && this.world.character.x > this.x - 400) {
                    this.hadfirstContact = true;
                    this.alertPhase = true;
                    this.alertFrameCount = 0;
                }
                
                if (this.hadfirstContact) {
                    if (this.alertPhase) {
                        this.animateImages(this.IMAGES_ALERT);
                        this.alertFrameCount++;
                        
                        if (this.alertFrameCount >= 12) {
                            this.alertPhase = false;
                        }
                    } else if (distanceToCharacter < 150) {
                        if (this.attackCooldown <= 0) {
                            this.animateImages(this.IMAGES_ATTACK);
                            this.attackCooldown = 10;
                            
                            if (distanceToCharacter < 80 && !this.world.character.isHurt()) {
                                this.world.character.hit();
                                this.world.updateHealthStatusBar();
                            }
                        } else {
                            this.attackCooldown--;
                        }
                    } else {
                        this.animateImages(this.IMAGES_WALKING);
                        
                        if (Date.now() - this.lastDirectionChange > 4000) {
                            this.movingDirection *= -1;
                            this.lastDirectionChange = Date.now();
                            this.otherDirection = !this.otherDirection;
                        }
                        
                        if (this.movingDirection > 0) {
                            this.x += this.speed;
                        } else {
                            this.x -= this.speed;
                        }
                    }
                } else {
                    this.animateImages(this.IMAGES_WALKING);
                }
            }
        }, 150);
    }
    
    hit() {
        this.energy -= 20;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }
    
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        return timePassed < 500;
    }
    
    isDead() {
        return this.energy <= 0;
    }
}