class StartScreen extends DrawableObject {
    constructor() {
        super();
        this.loadImage('assets/img/9_intro_outro_screens/start/startscreen_1.png');

        this.playButton = new DrawableObject();
        this.playButton.loadImage('./assets/icons/playbutton.png');
        this.playButton.x = 650;
        this.playButton.y = 10;
        this.playButton.width = 50;
        this.playButton.height = 50;

        this.guitarButton = new DrawableObject();
        this.guitarButton.loadImage('./assets/icons/guitar-159661_640.png');
        this.guitarButton.x = 10;
        this.guitarButton.y = 10;
        this.guitarButton.width = 50;
        this.guitarButton.height = 75;

        this.width = 720;
        this.height = 480;
        this.backgroundMusic = new Audio('./audio/backgroundMusic.mp3');
        this.backgroundMusic.loop = true;

        canvas.addEventListener("click", (event) => {
            let rect = canvas.getBoundingClientRect();
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;
        
            if (this.isGuitarButtonClicked(x, y)) {
            }
        });
    }

    draw(ctx) {
        ctx.drawImage(this.img, 0, 0, this.width, this.height);
        this.playButton.draw(ctx);
        this.guitarButton.draw(ctx);
    }

        isPlayButtonClicked(x, y) {
            return x >= this.playButton.x && x <= this.playButton.x + this.playButton.width &&
                   y >= this.playButton.y && y <= this.playButton.y + this.playButton.height;
        }
    
        isGuitarButtonClicked(x, y) {
            const isClicked = x >= this.guitarButton.x && x <= this.guitarButton.x + this.guitarButton.width &&
                              y >= this.guitarButton.y && y <= this.guitarButton.y + this.guitarButton.height;
            if (isClicked) {
                this.toggleMusic();
            }
            return isClicked;
    }

    toggleMusic() {
        if (this.backgroundMusic.paused) {
            this.backgroundMusic.play().catch(error => console.error('Error playing music:', error));
        } else {
            this.backgroundMusic.pause();
        }
    }
}