class GameOverScreen extends DrawableObject {
    constructor() {
        super();
        this.loadImage('assets/img/9_intro_outro_screens/game_over/oh no you lost!.png');
        this.width = 720;
        this.height = 480;
        this.soundPlayed = false;
    }

    playGameOverSound() {
        if (!this.soundPlayed) {
            let audio = new Audio('./audio/losing.wav');
            audio.play().catch(error => {
                console.error('Error playing audio:', error);
            });
            this.soundPlayed = true;
        }
    }

    draw(ctx) {
        ctx.drawImage(this.img, (ctx.canvas.width - this.width) / 2, (ctx.canvas.height - this.height) / 2, this.width, this.height);
        this.playGameOverSound();
        this.showWinLoseScreen('lose');
    }
    
    showWinLoseScreen(result) {
        let winLoseContainer = document.getElementById('win-loose');
        let winLoseImage = document.getElementById('win-loose-image');
        
        if (result === 'win') {
            winLoseImage.src = 'assets/img/9_intro_outro_screens/win/win_2.png';
        } else {
            winLoseImage.src = 'assets/img/9_intro_outro_screens/game_over/oh no you lost!.png';
        }
        
        winLoseContainer.style.display = 'block';
    }
}