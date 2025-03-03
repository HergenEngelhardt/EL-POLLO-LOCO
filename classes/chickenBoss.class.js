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
        this.offsetY = 50; 
        this.offsetX = 40; 
        this.offsetWidth = 80; 
        this.offsetHeight = 100;
    }

    animate() {
        setInterval(() => {
            if (this.isDead()) {
                if (!this.deathAnimationPlayed) {
                    this.playDeathAnimation();
                }
                return;
            }
            
            if (this.isHurt()) {
                this.animateImages(this.IMAGES_HURT);
                return;
            }
    
            if (this.world && this.world.character) {
                let distanceToCharacter = Math.abs(this.x - this.world.character.x);
                let characterIsLeft = this.world.character.x < this.x;
                
                if (this.isColliding(this.world.character) && !this.world.character.isHurt()) {
                    this.world.character.hit();
                    this.world.updateHealthStatusBar();
                }
    
                if (!this.hadfirstContact && distanceToCharacter < 500) {
                    this.hadfirstContact = true;
                    this.alertPhase = true;
                    this.alertFrameCount = 0;
                    this.otherDirection = !characterIsLeft;
                }
                
                if (this.hadfirstContact) {
                    if (this.alertPhase) {
                        this.otherDirection = !characterIsLeft;
                        this.animateImages(this.IMAGES_ALERT);
                        this.alertFrameCount++;
                        
                        if (this.alertFrameCount >= 12) {
                            this.alertPhase = false;
                            this.showHealthBar = true;  
                        }
                    } else {
                        this.updateHealthBarPosition();
                        
                        if (distanceToCharacter < 300) {
                            this.animateImages(this.IMAGES_ATTACK);
                            
                            if (Date.now() - this.lastDirectionChange > 4000) {
                                this.movingDirection *= -1;
                                this.lastDirectionChange = Date.now();
                            }
                            
                            if (this.movingDirection > 0) {
                                this.x += this.speed;
                                this.otherDirection = true;
                            } else {
                                this.x -= this.speed;
                                this.otherDirection = false;
                            }
                            
                            if (distanceToCharacter < 80 && !this.world.character.isHurt()) {
                                this.world.character.hit();
                                this.world.updateHealthStatusBar();
                            }
                        } else {
                            this.animateImages(this.IMAGES_WALKING);
                            
                            if (Date.now() - this.lastDirectionChange > 4000) {
                                this.movingDirection *= -1;
                                this.lastDirectionChange = Date.now();
                            }
                            
                            if (this.movingDirection > 0) {
                                this.x += this.speed;
                                this.otherDirection = true;
                            } else {
                                this.x -= this.speed;
                                this.otherDirection = false;
                            }
                        }
                    }
                } else {
                    this.img = this.imageCache[this.IMAGES_WALKING[0]];
                }
            }
        }, 150);
    }
    
    playDeathAnimation() {
        let deathInterval = setInterval(() => {
            if (this.deathAnimationIndex >= this.IMAGES_DEAD.length) {
                clearInterval(deathInterval);
                this.deathAnimationPlayed = true;
                this.toDelete = true;
                return;
            }
            
            let path = this.IMAGES_DEAD[this.deathAnimationIndex];
            this.img = this.imageCache[path];
            this.deathAnimationIndex++;
        }, 200);
    }
    
    updateHealthBarPosition() {
        this.healthBar.x = this.x + 20;
        this.healthBar.y = this.y - 30;
    }
    
    hit() {
    this.energy -= 20;
    this.lastHit = new Date().getTime();
    this.playHitSound();
    if (this.energy < 0) {
        this.energy = 0;
    }
    this.healthBar.setPercentage(this.energy);
    
    console.log('Boss hit! Energy left:', this.energy);
    }
    
    playHitSound() {
        let audio = new Audio('./audio/punch-140236.mp3');
        audio.play().catch(error => {
            console.error('Error playing boss hit sound:', error);
        });
    }
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        return timePassed < 500;
    }
    
    isDead() {
        return this.energy <= 0;
    }


}