let canvas = document.getElementById("paper");
let c = canvas.getContext("2d");
c.imageSmoothingEnabled = false;
c.mozImageSmoothingEnabled = false;

class Arrow {
    static WIDTH = 80;
    static HEIGHT = 80;

    constructor(x, y, dir) {
        this.x = x;
        this.y = y;
        this.speed = 4;
        this.dir = dir;

        let spriteLeft = new Image(Arrow.WIDTH, Arrow.HEIGHT);
        spriteLeft.src = "assets/arrow-left.png";

        let spriteUp = new Image(Arrow.WIDTH, Arrow.HEIGHT);
        spriteUp.src = "assets/arrow-up.png";
        
        let spriteRight = new Image(Arrow.WIDTH, Arrow.HEIGHT);
        spriteRight.src = "assets/arrow-right.png";
        
        let spriteDown = new Image(Arrow.WIDTH, Arrow.HEIGHT);
        spriteDown.src = "assets/arrow-down.png";

        this.sprite = {
            left: spriteLeft,
            up: spriteUp,
            right: spriteRight,
            down: spriteDown,
        }
    }

    update() {
        // this.speed += .1;
        this.y += this.speed;
    }

    checkBounds() {
        return this.y > canvas.height/2;
    }

    draw() {
        let sprite = null;

        switch(this.dir) {
            case "left":
                sprite = this.sprite.left;
                break;
            case "up":
                sprite = this.sprite.up;
                break;
            case "right":
                sprite = this.sprite.right;
                break;
            case "down":
                sprite = this.sprite.down;
                break;
            default:
        }

        c.drawImage(sprite, this.x, this.y, Arrow.WIDTH, Arrow.HEIGHT);
    }
}

class Particle {
    constructor(x, y, d, vx, vy, vd, size = 7) {
        this.x = x;
        this.y = y;
        this.d = d;
        this.vx = vx;
        this.vy = vy;
        this.vd = vd;
        this.size = size;
    }

    update() {
        this.vx *= .9;
        this.vy *= .9;

        this.x += this.vx;
        this.y += this.vy;
        this.d += this.vd;

        this.size -= .2;
    }

    checkSize() {
        return this.size < 0;
    }

    draw() {
        c.translate(this.x, this.y);
        c.rotate(this.d);
        c.fillStyle = "white";
        c.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        c.rotate(-this.d);
        c.translate(-this.x, -this.y);
    }
}

class Target {
    static WIDTH = 88;
    static HEIGHT = 88;

    constructor(x, y, dir) {
        this.x = x;
        this.y = y;
        this.size = 0;
        this.arrows = [];
        this.timer = 0;
        this.keyDown = false;
        this.dir = dir;
        
        this.sprite = new Image(Target.WIDTH, Target.HEIGHT);
        this.sprite.src = "assets/target-" + dir + ".png";
    }

    update() {
        let success = false;

        if(this.keyDown && this.timer > 20) {
            this.timer = 0;

            const tolerance = 20;

            for(const [idx, arrow] of this.arrows.entries()) {
                if(arrow.y + tolerance > this.y && arrow.y + Arrow.HEIGHT < this.y + Target.HEIGHT + tolerance) {
                    this.arrows.splice(idx, 1);

                    success = true;
                    this.size = 16;
                }
            }
        }

        this.size *= .9;
        this.timer++;
        return success;
    }

    draw(opacity) {
        for(const arrow of this.arrows) {
            c.globalAlpha = opacity;
            arrow.draw();
        }

        c.globalAlpha = Math.min(this.timer/20, opacity);
        c.drawImage(this.sprite, this.x - this.size/2, this.y - this.size/2, Target.WIDTH + this.size, Target.HEIGHT + this.size);
        c.globalAlpha = 1;
    }
}

class Dancer {
    constructor() {
        this.formTimer = 0;
        this.health = 3;
        this.red = 0;
        this.sprites = {};
        
        let dancerLeft = new Image(800, 600);
        dancerLeft.src = "assets/dancer-left.png";
        this.sprites["left"] = dancerLeft;
        
        let dancerRight = new Image(800, 600);
        dancerRight.src = "assets/dancer-right.png";
        this.sprites["right"] = dancerRight;
        
        let dancerUp = new Image(800, 600);
        dancerUp.src = "assets/dancer-up.png";
        this.sprites["up"] = dancerUp;
        
        let dancerDown = new Image(800, 600);
        dancerDown.src = "assets/dancer-down.png";
        this.sprites["down"] = dancerDown;
        
        let dancerMad = new Image(800, 600);
        dancerMad.src = "assets/dancer-mad.png";
        this.sprites["mad"] = dancerMad;

        this.form = "left";

        let light = new Image(800, 600);
        light.src = "assets/light.png";
        this.light = light;

        let shadow = new Image(800, 600);
        shadow.src = "assets/shadow.png";
        this.shadow = shadow;

        let star = new Image(44, 44);
        star.src = "assets/star.png";
        this.star = star;
    }

    switchForm(form) {
        if(this.formTimer > 10) {
            this.form = form;
            this.formTimer = 0;

            if(form == "mad") {
                this.red = .5;
                this.health--;
            }
        }
    }

    update() {
        this.formTimer++;
        this.red -= .02;
    }

    drawStars() {
        for(let i = 0; i < this.health; i++) {
            c.drawImage(this.star, canvas.width * .1, canvas.height * .1 + 60 * i, this.star.width, this.star.height)
        }
    }

    drawLight() {
        if(this.form == "mad") {
            c.fillStyle = "red";
            c.globalAlpha = Math.max(this.red, 0);

            c.fillRect(0, 0, canvas.width, canvas.height);

            c.globalAlpha = 1;
        }

        c.drawImage(this.shadow, -this.shadow.width/2 + canvas.width/2, -this.shadow.height/2 + canvas.height/2, this.shadow.width, this.shadow.height);
    }

    draw() {
        c.drawImage(this.light, -this.light.width/2 + canvas.width/2, -this.light.height/2 + canvas.height/2, this.light.width, this.light.height);
    
        const sprite = this.sprites[this.form];

        c.drawImage(sprite, -sprite.width/2 + canvas.width/2, -sprite.height/2 + canvas.height/2, sprite.width, sprite.height);
    }
}

class DDRHandler {
    constructor() {
        this.arrowTimer = 0;
        this.tilt = 0;
        this.dtilt = 0;
        this.levels = 35;
        this.UIOpacity = 1;
        this.particles = [];
        this.gameOver = false;
        this.winState = false;
        
        this.dancer = new Dancer();
        
        this.target = {
            left: null,
            up: null,
            right: null,
            down: null,
        };

        const spacing = 20;
        const border = (Target.WIDTH - Arrow.WIDTH) / 2;
        let y = canvas.height * .25;
        
        let x = - spacing * 1.5 - Arrow.WIDTH * 2 - border;
        let dir = "left";
        this.target.left = new Target(x, y, dir);

        x = - spacing * .5 - Arrow.WIDTH - border;
        dir = "down";
        this.target.down = new Target(x, y, dir);

        x = + spacing * .5 - border;
        dir = "up";
        this.target.up = new Target(x, y, dir);

        x = + spacing * 1.5 + Arrow.WIDTH - border;
        dir = "right";
        this.target.right = new Target(x, y, dir);
    }

    updateRunning() {
        for(const [idx, target] of Object.entries(this.target)) {
            if(target.update()) {
                for(let i = 0; i < 36; i++) {
                    const x = target.x + Math.random() * Target.WIDTH;
                    const y = target.y + Math.random() * Target.HEIGHT;
                    const d = Math.random() * Math.PI * 2; 

                    const vx = Math.random() * 10 - 5;
                    const vy = Math.random() * 10 - 5;
                    const vd = Math.random() * .3 - .15; 

                    const p = new Particle(x, y, d, vx, vy, vd);
                    this.particles.push(p);

                    this.dtilt = .05 * Math.sign(Math.random() - .5);
                }

                this.dancer.switchForm(target.dir);
            }

            for(let i = target.arrows.length - 1; i >= 0; i--) {
                target.arrows[i].update();
    
                if(target.arrows[i].checkBounds()) {
                    target.arrows.splice(i, 1);
                    this.dancer.switchForm("mad");
                }
            }
        }

        
        for(const [idx, particle] of this.particles.entries()) {
            particle.update();

            if(particle.checkSize()) {
                this.particles.splice(idx, 1);
            }
        }

        this.dancer.update();

        if(this.dancer.health <= 0) {
            this.gameOver = true;
            this.winState = false;
        }

        if(this.levels <= 0) {
            this.gameOver = true;
            this.winState = true;

            for(const [idx, target] of Object.entries(this.target)) {
                for(const arrow of target.arrows) {
                    for(let i = 0; i < 36; i++) {
                        const x = arrow.x + Math.random() * Arrow.WIDTH;
                        const y = arrow.y + Math.random() * Arrow.HEIGHT;
                        const d = Math.random() * Math.PI * 2; 
                        
                        const vx = Math.random() * 10 - 5;
                        const vy = Math.random() * 10 - 5;
                        const vd = Math.random() * .5 - .25; 
                        const size = 10;
                        
                        const p = new Particle(x, y, d, vx, vy, vd, size);
                        this.particles.push(p);
                    }
                }
            }
        }

        if(this.arrowTimer > 40) {
            if(this.levels > 0) {
                this.spawnArrows();
            }

            this.arrowTimer = 0
        }

        this.dtilt *= .8;
        this.tilt *= .8;
        this.tilt += this.dtilt;
        this.arrowTimer++;
    }

    updateOver() {
        this.UIOpacity *= .8;//this.UIOpacity > .02 ? this.UIOpacity - .02 : 0;

        for(const [idx, target] of Object.entries(this.target)) {
            for(let i = target.arrows.length - 1; i >= 0; i--) {
                target.arrows[i].update();
            }
        }

        for(const [idx, particle] of this.particles.entries()) {
            particle.update();

            if(particle.checkSize()) {
                this.particles.splice(idx, 1);
            }
        }

        this.dancer.update();
    }

    update() {
        if(!this.gameOver) {
            this.updateRunning();
        } else {
            this.updateOver();
        }
    }

    spawnArrows() {
        this.levels--;
        const spacing = 20;

        if(Math.random() < .25) {
            const x = - spacing * 1.5 - Arrow.WIDTH * 2;
            const y = -canvas.width / 2 - Arrow.HEIGHT;
            const dir = "left";

            this.target.left.arrows.push(new Arrow(x, y, dir));
        }

        if(Math.random() < .25) {
            const x = + spacing * 1.5 + Arrow.WIDTH;
            const y = -canvas.width / 2 - Arrow.HEIGHT;
            const dir = "right";

            this.target.right.arrows.push(new Arrow(x, y, dir));
        }
        
        if(Math.random() < .25) {
            const x = + spacing * .5;
            const y = -canvas.width / 2 - Arrow.HEIGHT;
            const dir = "up";

            this.target.up.arrows.push(new Arrow(x, y, dir));
        } else if(Math.random() < .33) {
            const x = - spacing * .5 - Arrow.WIDTH;
            const y = -canvas.width / 2 - Arrow.HEIGHT;
            const dir = "down";

            this.target.down.arrows.push(new Arrow(x, y, dir));
        }
    }

    draw() {
        this.dancer.draw();

        c.translate(canvas.width/2, canvas.height/2);
        c.rotate(gameHandler.tilt);

        this.target.left.draw(this.UIOpacity);
        this.target.up.draw(this.UIOpacity);
        this.target.right.draw(this.UIOpacity);
        this.target.down.draw(this.UIOpacity);
        
        for(const particle of this.particles) {
            particle.draw();
        }

        c.rotate(-gameHandler.tilt);
        c.translate(-canvas.width/2, -canvas.height/2);

        this.dancer.drawLight();
        c.globalAlpha = this.UIOpacity;
        this.dancer.drawStars();
        c.globalAlpha = 1;

        
        c.globalCompositeOperation = "difference";
        if(this.gameOver) { 
            c.fillStyle = "white";
            c.textAlign = "center";
            c.textBaseline = "middle";
            c.font = "20px 'Press Start 2P'";
            
            if(this.winState) {
                c.fillText("youre such a good dancer dude", canvas.width/2, canvas.height/2);
            } else {
                c.fillText("booo do better", canvas.width/2, canvas.height/2);
            }
        }
        c.globalCompositeOperation = "source-over";
    }
}

let gameHandler = new DDRHandler();

document.addEventListener("keydown", function(e) {
    switch(e.keyCode) {
        case 65:
        case 37:
            gameHandler.target.left.keyDown = true;
            break;
        case 87:
        case 38:
            gameHandler.target.up.keyDown = true;
            break;
        case 68:
        case 39:
            gameHandler.target.right.keyDown = true;
            break;
        case 83:
        case 40:
            gameHandler.target.down.keyDown = true;
            break;
        default:
    }
});

document.addEventListener("keyup", function(e) {
    switch(e.keyCode) {
        case 65:
        case 37:
            gameHandler.target.left.keyDown = false;
            break;
        case 87:
        case 38:
            gameHandler.target.up.keyDown = false;
            break;
        case 68:
        case 39:
            gameHandler.target.right.keyDown = false;
            break;
        case 83:
        case 40:
            gameHandler.target.down.keyDown = false;
            break;
        default:
    }
});

setInterval(function() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "#4B3F72";
    c.fillRect(0, 0, canvas.width, canvas.height);

    gameHandler.update();
    gameHandler.draw();
}, 15);