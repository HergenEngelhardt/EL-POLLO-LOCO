class StartScreen extends DrawableObject {
    constructor() {
        super();
        this.loadImage('assets/img/9_intro_outro_screens/start/startscreen_1.png');
        this.playButton = new DrawableObject();
        this.playButton.loadImage('assets/icons/playbutton.png');
        this.playButton.x = 650;
        this.playButton.y = 10;
        this.playButton.width = 50;
        this.playButton.height = 50;
        this.width = 720; 
        this.height = 480; 
    }

    draw(ctx) {
        ctx.drawImage(this.img, 0, 0, this.width, this.height); 
        this.playButton.draw(ctx);
    }

    isPlayButtonClicked(x, y) {
        return x >= this.playButton.x && x <= this.playButton.x + this.playButton.width &&
               y >= this.playButton.y && y <= this.playButton.y + this.playButton.height;
    }


    
}