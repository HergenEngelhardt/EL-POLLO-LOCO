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
        let i = 0;
        
        // Movement and animation interval
        setInterval(() => {
            // Debug output to see if world and character are properly set
            console.log('ChickenBoss position:', this.x);
            if (this.world && this.world.character) {
                console.log('Character position:', this.world.character.x);
                console.log('Distance:', this.x - this.world.character.x);
            }
            
            // Increased detection range to 400px
            if (this.world && this.world.character && this.world.character.x > this.x - 400) {
                // First contact detected
                if (!this.hadfirstContact) {
                    console.log('First contact detected!');
                    this.hadfirstContact = true;
                    i = 0;
                }
                
                // Play alert animation for 12 frames before moving
                if (i < 12) {
                    console.log('Playing alert animation, frame:', i);
                    this.animateImages(this.IMAGES_ALERT);
                } else {
                    console.log('Alert finished, now walking');
                    this.animateImages(this.IMAGES_WALKING);
                    this.moveLeft();
                }
                i++;
            } else {
                // Default walking animation when character is not nearby
                this.animateImages(this.IMAGES_WALKING);
            }
        }, 150);
    }
}    