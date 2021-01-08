let canvas = document.getElementById("paper");
let c = canvas.getContext("2d");
c.imageSmoothingEnabled = false;
c.mozImageSmoothingEnabled = false;

class Runner {
    constructor() {
        this.x = 60;
        this.y = canvas.height/2 - 30;
        this.state = "still";
        this.active = false;

        let spriteLeft = new Image(60, 60);
        spriteLeft.src = "assets/runningmanleft.png";
        let spriteRight = new Image(60, 60);
        spriteRight.src = "assets/runningmanright.png";
        let spriteStill = new Image(60, 60);
        spriteStill.src = "assets/runningmanstill.png";
        let spriteWon = new Image(80, 80);
        spriteWon.src = "assets/runningmanwon.png";

        this.sprite = {
            left: spriteLeft,
            right: spriteRight,
            still: spriteStill,
            won: spriteWon,
        }
    }

    update(state) {
        if(state != "still" && state != this.state) {
            this.x += 10;
        }

        this.state = state;
        
    }

    draw() {
        switch(this.state) {
            case "left":
                c.drawImage(this.sprite.left, this.x, this.y, this.sprite.left.width, this.sprite.left.height);
                break;
            case "right":
                c.drawImage(this.sprite.right, this.x, this.y, this.sprite.right.width, this.sprite.right.height);
                break;
            case "still":
                c.drawImage(this.sprite.still, this.x, this.y, this.sprite.still.width, this.sprite.still.height);
                break;
            case "won":
                c.drawImage(this.sprite.won, this.x, this.y, this.sprite.won.width, this.sprite.won.height);
                break;
            default:
                console.log("state not found")
        }
    }
}

class lavaRunner {
    constructor() {
        this.runner = new Runner();
        this.lavaX = -150;
        this.lavaV = 0;
        this.countDown = 5;
        this.gameOver = false;

        let finishLineSprite = new Image(20, 80);
        finishLineSprite.src = "assets/finishline.png"
        this.lineSprite = finishLineSprite;
    }

    update() {
        this.countDown -= .015;
        if(this.countDown > 0) {
            this.drawCountDown();
        } else if (!this.gameOver) {
            this.runner.active = true;

            this.lavaV = 1.4 + (this.runner.x - this.lavaX) / 100;
            this.lavaX += this.lavaV;

            if(this.runner.x < this.lavaX) {
                this.runner.active = false;
                this.gameOver = true;
                this.runner.state = "still";
            }
            if(this.runner.x > canvas.width - 100) {
                this.runner.active = false;
                this.gameOver = true;
                this.runner.state = "left";
                gameRunner.runner.update("right");
                this.runner.state = "won";
            }
        } else {
            if(this.runner.state == "won") {
                this.lavaV *= .95;
            } else {
                if(this.lavaX < canvas.width * 2) {
                    this.lavaV *= 1.05;
                } else {
                    this.lavaV = 0;
                }
            }
            this.lavaX += this.lavaV;
        }
    }

    draw() {
        c.drawImage(this.lineSprite, canvas.width - 100, canvas.height/2 - 40, this.lineSprite.width, this.lineSprite.height);
        
        this.runner.draw();

        c.fillStyle = "#FFAF87";
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(0, canvas.height);
        c.lineTo(this.lavaX + 150, canvas.height);
        c.lineTo(this.lavaX - 150, 0);
        c.lineTo(0, 0);
        c.closePath();
        c.fill();

        if(this.gameOver && this.runner.state != "won") {
            c.fillStyle = "white";
            c.font = "20px Courier New";
            c.fillText("damn you really died", canvas.width/2, canvas.height/2);
        } else if (this.runner.state == "won") {
            c.fillStyle = "white";
            c.font = "20px Courier New";
            c.fillText("good shit man", canvas.width/2, canvas.height/2);
        }
    }

    drawCountDown() {
        let opacity = this.countDown + .4;
        c.fillStyle = "rgba(255, 255, 255, "+(opacity*opacity)+")";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.font = "20px Courier New";
        c.fillText("use left and right arrows to take steps, avoid the lava", canvas.width/2, canvas.height/4);

        opacity = this.countDown - Math.floor(this.countDown) + .4;
        c.fillStyle = "rgba(255, 255, 255, "+(opacity*opacity)+")";
        c.font = "120px Courier New";
        c.fillText(Math.ceil(this.countDown), canvas.width/2, canvas.height/2);
    }
}

let gameRunner = new lavaRunner();

document.addEventListener("keydown", function(e) {
    switch(e.keyCode) {
        case 65:
        case 37:
            if(gameRunner.runner.active) {
                gameRunner.runner.update("left");
            }
            break;
        case 68:
        case 39:
            if(gameRunner.runner.active) {
                gameRunner.runner.update("right");
            }
            break;
        default:
    }
});

setInterval(function() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "#FF8E72";
    c.fillRect(0, 0, canvas.width, canvas.height);

    gameRunner.update();
    gameRunner.draw();
}, 15);