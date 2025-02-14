class Level {
    enemies;
    cloud;
    background;
    level_end_x = 1900;
    constructor(enemies, cloud, background) {
        this.enemies = enemies;
        this.cloud = cloud;
        this.background = background;
    }
}