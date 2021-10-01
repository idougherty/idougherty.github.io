let canvas = document.getElementById("paper");
let c = canvas.getContext("2d");
c.imageSmoothingEnabled = false;
c.mozImageSmoothingEnabled = false;

class Mouse {
    x = 0;
    y = 0;
    left = false;
    right = false;
}

function updateState(e) {
    if(e.buttons == 3) {
        mouse.left = true;
        mouse.right = true;
    } else if(e.buttons == 2) {
        mouse.left = false;
        mouse.right = true;
    } else if(e.buttons == 1) {
        mouse.left = true;
        mouse.right = false;
    } else {
        mouse.left = false;
        mouse.right = false;
    }
}

function updatePos(e) {
    let rect = e.target.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
}

let mouse = new Mouse();

canvas.addEventListener("mousemove", updatePos);
canvas.addEventListener("mousedown", updateState);
canvas.addEventListener("mouseup", updateState);

function mod(n, m) {
    return ((n % m) + m) % m;
}

class Drop {
    constructor(x, y, hue) {
        this.x = x;
        this.y = y;
        this.vBottom = 3;
        this.vExit = 3;
        this.spawnY = y;
        this.hue = hue;
        this.dripping = true;
        this.length = 0;
    }

    update() {
        this.vExit += .2;
        if(!this.dripping) {
            this.vExit += .2;
            this.y += this.vExit;
        } else {
            this.vBottom += .1;
            this.length += this.vBottom;
        }
    }

    draw() {
        c.strokeStyle = "hsl("+this.hue+", 70%, 50%)";
        c.lineWidth = 20;
        c.lineCap = "round";
        
        c.beginPath();
        c.moveTo(this.x, this.y);
        c.lineTo(this.x, this.y + this.length);

        c.stroke();
    }
}

class Dropper {
    constructor(x, y, hue) {
        this.x = x;
        this.y = y;
        this.hue = hue;
        
        this.button = {
            x: x + 3,
            y: y + 29,
            color: "#CD523C",
            down: false,
            lastState: false,
        };

        this.drops = [];

        let sprite = new Image(100, 100);
        sprite.src = "assets/dropper.png";
        this.sprite = sprite;
    }

    update() {
        this.updateButton();

        for(let drop of this.drops) {
            drop.update();
        }
    }

    updateButton() {
        this.button.lastState = this.button.down;

        this.button.down = false;
        const dx = this.button.x - mouse.x;
        const dy = this.button.y - mouse.y;

        if(Math.sqrt(dx*dx + dy*dy) < 20) {
            if(mouse.left) {
                this.button.down = true;
                this.button.color = "#B76151";
            } else {
                this.button.color = "#F9826D";
            }
        } else {
            this.button.color = "#D56F5D";
        }

        if(this.button.lastState != this.button.down) {
            if(this.button.down) {
                this.drops.push(new Drop(this.x + 3, this.y + this.sprite.height - 20, this.hue));
            } else {
                this.drops[this.drops.length - 1].dripping = false;
            }
        }
    }

    draw() {
        c.fillStyle = "hsl("+this.hue+", 70%, 50%)";
        c.fillRect(this.x - this.sprite.width/2 + 8, this.y, this.sprite.width - 16, this.sprite.height - 30);
        c.fillRect(this.x - 8, this.y, 18, this.sprite.height - 10);

        c.fillStyle = this.button.color;
        c.fillRect(this.button.x - 9, this.button.y - 9, 18, 18);

        for(let drop of this.drops) {
            drop.draw();
        }

        c.drawImage(this.sprite, this.x - this.sprite.width/2, this.y, this.sprite.width, this.sprite.height);
    }
}

class Bucket {
    constructor(lRGB, rRGB) {
        this.x = canvas.width/2;
        this.y = canvas.height*2/3;
        this.color = null;
        this.leftRGB = lRGB;
        this.rightRGB = rRGB;
        this.goalMix = Math.random()*.8 + .1;
        this.currMix = null;
        this.goalColor = this.mixColors(this.leftRGB, this.rightRGB, this.goalMix);
        this.leftHueAmt = 0;
        this.rightHueAmt = 0;
        this.level = 0;
        this.realBottom = this.y + 80;

        let sprite = new Image(400, 240);
        sprite.src = "assets/bucket.png";
        this.sprite = sprite;
    }

    update() {
        this.level = Math.min((this.leftHueAmt + this.rightHueAmt) / 20, 120);
        this.currMix = (this.rightHueAmt / (this.rightHueAmt + this.leftHueAmt));
        this.color = this.mixColors(this.leftRGB, this.rightRGB, this.currMix);
    }

    mixColors(c1, c2, ratio) {
        const n1 = [c1[0]*c1[0], c1[1]*c1[1], c1[2]*c1[2]];
        const n2 = [c2[0]*c2[0], c2[1]*c2[1], c2[2]*c2[2]];

        const r = Math.floor(Math.sqrt(n1[0] + (n2[0] - n1[0]) * ratio));
        const g = Math.floor(Math.sqrt(n1[1] + (n2[1] - n1[1]) * ratio));
        const b = Math.floor(Math.sqrt(n1[2] + (n2[2] - n1[2]) * ratio)); 
        
        return "rgb("+r+", "+g+", "+b+")";
    }

    static HSLtoRGB(H, S, L) {
        const C = (1 - Math.abs(2 * L - 1)) * S;
        const X = C * (1 - Math.abs((H / 60) % 2 - 1));
        const m = L - C / 2;
        
        const RGB = [0, 0, 0];
        const Xidx = mod(Math.ceil(-H/60 + 1), 3);
        const Cidx = mod(Math.floor(H/120 + .5), 3);

        RGB[Xidx] = X;
        RGB[Cidx] = C;
        
        RGB[0] = (RGB[0] + m) * 255;
        RGB[1] = (RGB[1] + m) * 255;
        RGB[2] = (RGB[2] + m) * 255;
        
        return RGB;
    }

    draw() {
        if(this.color) {
            c.fillStyle = this.color;
            c.fillRect(this.x - this.sprite.width/2 + 40, this.realBottom, this.sprite.width - 100, -this.level);
        }
        c.drawImage(this.sprite, this.x - this.sprite.width/2, this.y - this.sprite.height/2, this.sprite.width, this.sprite.height);
    }
}

class fuelMixer {
    constructor() {
        const hue1 = Math.floor(Math.random()*360);
        const hue2 = Math.floor(hue1 + Math.random()*20 + 60);

        this.dropper = {
            left: new Dropper(canvas.width*2/5, 0, hue1), 
            right: new Dropper(canvas.width*3/5, 0, hue2), 
        };

        this.bucket = new Bucket(Bucket.HSLtoRGB(hue1, .7, .5), Bucket.HSLtoRGB(hue2, .7, .5));

        let gaugeSprite = new Image(56, 384);
        gaugeSprite.src = "assets/gauge.png";
        let markerSprite = new Image(104, 44);
        markerSprite.src = "assets/marker.png"

        this.gauge = {
            sprite: gaugeSprite,
            marker: {
                sprite: markerSprite,
            },
        }
    }

    update() {
        this.dropper.left.update();
        this.dropper.right.update();

        for(const [index, drop] of this.dropper.left.drops.entries()) {
            if(drop.y + drop.length > this.bucket.realBottom - this.bucket.level) {
                const lastLength = drop.length;
                drop.length = this.bucket.realBottom - this.bucket.level - drop.y;
                this.bucket.leftHueAmt += lastLength - Math.max(drop.length, 0);
            }

            if(drop.length < 0) {
                this.dropper.left.drops.splice(index, 1);
            }
        }

        for(const [index, drop] of this.dropper.right.drops.entries()) {
            if(drop.y + drop.length > this.bucket.realBottom - this.bucket.level) {
                const lastLength = drop.length;
                drop.length = this.bucket.realBottom - this.bucket.level - drop.y;
                this.bucket.rightHueAmt += lastLength - Math.max(drop.length, 0);
            }

            if(drop.length < 0) {
                this.dropper.right.drops.splice(index, 1);
            }
        }
        
        this.bucket.update();
    }
    
    draw() {
        this.dropper.left.draw();
        this.dropper.right.draw();
        this.bucket.draw();

        var grd = c.createLinearGradient(0, 50, 0, canvas.height - 50);
        grd.addColorStop(0, "hsl("+this.dropper.left.hue+", 70%, 50%)");
        grd.addColorStop(1, "hsl("+this.dropper.right.hue+", 70%, 50%)");
        
        c.fillStyle = grd;
        c.fillRect(canvas.width * 7/8, 50, 40, canvas.height - 100);
        
        c.drawImage(this.gauge.sprite, canvas.width * 7/8 - 8, 50, this.gauge.sprite.width, this.gauge.sprite.height);

        c.fillStyle = this.bucket.goalColor;
        c.fillRect(canvas.width * 7/8 - 56, 50 + this.bucket.goalMix * (canvas.height - 100) - 12, 36, 28);

        c.drawImage(this.gauge.marker.sprite, canvas.width * 7/8 - 64, 50 + this.bucket.goalMix * (canvas.height - 100) - 20, this.gauge.marker.sprite.width, this.gauge.marker.sprite.height);

        c.fillStyle = "black";
        c.fillRect(canvas.width * 7/8, 50 + this.bucket.currMix * (canvas.height - 100), 40, 4);
    }
}

let gameRunner = new fuelMixer();

setInterval(function() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "#89b";
    c.fillRect(0, 0, canvas.width, canvas.height);

    gameRunner.update();
    gameRunner.draw();
}, 15);