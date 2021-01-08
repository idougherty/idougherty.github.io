let canvas = document.getElementById("paper");
let c = canvas.getContext("2d");
c.imageSmoothingEnabled = false;
c.mozImageSmoothingEnabled = false;

class Car {
    constructor(x, y, d) {
        this.x = x;
        this.y = y;
        this.d = d;
        
        this.vx = 0;
        this.vy = 0;
        this.speed = 0;
        this.alive = true;
        
        this.width = 60;
        this.height = 30;        

        this.corners = [];
        this.findCorners();
    }

    static pointCollide(car, p) {
        const a = car.corners[0];
        const b = car.corners[1];
        const c = car.corners[2];
        const d = car.corners[3];

        const t1 = Math.abs((b[0] * p[1] - p[0] * b[1]) + (c[0] * b[1] - b[0] * c[1]) + (p[0] * c[1] - c[0] * p[1])) / 2; //pbc
        const t2 = Math.abs((a[0] * p[1] - p[0] * a[1]) + (d[0] * a[1] - a[0] * d[1]) + (p[0] * d[1] - d[0] * p[1])) / 2; //pad
        const t3 = Math.abs((b[0] * p[1] - p[0] * b[1]) + (a[0] * b[1] - b[0] * a[1]) + (p[0] * a[1] - a[0] * p[1])) / 2; //pba
        const t4 = Math.abs((d[0] * p[1] - p[0] * d[1]) + (c[0] * d[1] - d[0] * c[1]) + (p[0] * c[1] - c[0] * p[1])) / 2; //dpc

        const r = car.width * car.height;
        
        return t1 + t2 + t3 + t4 < r;
    }

    update(key) {
        if(this.alive) {
            const realSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);

            if(key.left && !key.right) {
                this.d -= Math.min(.02 * realSpeed, .07);
            } else if(key.right && !key.left) {
                this.d += Math.min(.02 * realSpeed, .07);
            }

            if(key.up && !key.down && this.speed < 1.5) {
                this.speed += .4;
            } else if(key.down && !key.up && this.speed > -1.5) {
                this.speed -= .4;
            } else {
                this.speed *= .8;
            }
        } else {
            this.speed *= .8;
        }

        this.vx *= .7;
        this.vy *= .7;

        this.vx += Math.cos(this.d) * this.speed;
        this.vy += Math.sin(this.d) * this.speed;

        this.x += this.vx;
        this.y += this.vy;

        this.findCorners();
        return this.wallCollide();
    }

    findCorners() {
        const dx = this.width/2;
        const dy = this.height/2

        const rx = Math.cos(this.d) * (dx) - Math.sin(this.d) * (dy);
        const ry = Math.cos(this.d) * (dy) + Math.sin(this.d) * (dx);

        const lx = Math.cos(this.d) * (-dx) - Math.sin(this.d) * (dy);
        const ly = Math.cos(this.d) * (dy) + Math.sin(this.d) * (-dx);
        
        let c = [];

        c[0] = [this.x + rx, this.y + ry];
        c[1] = [this.x + lx, this.y + ly];
        c[2] = [this.x - rx, this.y - ry];
        c[3] = [this.x - lx, this.y - ly];

        this.corners[0] = this.findCornerPosition(c, (val) => val[0] * -1);
        this.corners[1] = this.findCornerPosition(c, (val) => val[1] * -1);
        this.corners[2] = this.findCornerPosition(c, (val) => val[0] * 1);
        this.corners[3] = this.findCornerPosition(c, (val) => val[1] * 1);
    }

    wallCollide() {
        if(this.corners[0][0] < 0) {
            this.x = this.x - this.corners[0][0];
        } else if(this.corners[2][0] > canvas.width) {
            this.x = canvas.width + this.x - this.corners[2][0];
        }

        return this.corners[1][1];
    }

    findCornerPosition(corners, lambda) {
        let best = corners[0];

        for(const corner of corners) {
            if(lambda(corner) > lambda(best)) {
                best = corner;
            }
        }

        return best;
    }

    draw() {
        c.fillStyle = "red";
        c.translate(this.x, this.y);
        c.rotate(this.d);
        c.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        c.rotate(-this.d);
        c.translate(-this.x, -this.y);
    }
}

class Road {
    constructor() {
        this.x = canvas.width/2 - 320;
        this.y = 0;

        let sprite = new Image(640, 480);
        sprite.src = "assets/road.png";
        this.sprite = sprite;
    }

    update() {
        // this.y += 1;
    }

    draw(offset) {
        const y1 = - Math.floor(offset/canvas.height) * canvas.height;
        const y2 = y1 - canvas.height;
        c.drawImage(this.sprite, this.x, y1, this.sprite.width, this.sprite.height);
        c.drawImage(this.sprite, this.x, y2, this.sprite.width, this.sprite.height);
    }
}

class Frog {
    static width = 64;
    static height = 64;

    constructor(x, y, dir, jumpTimer, vx) {
        this.y = y;
        this.x = x;
        this.dir = dir;
        this.jumpTimer = jumpTimer;
        this.vx = vx;

        let sprite = new Image(Frog.width, Frog.height);
        sprite.src = "assets/road.png";
        this.sprite = sprite;
    }

    static pointCollide(frog, point) {
        return frog.x < point.x && frog.y < point.y && frog.x + Frog.width > point.x && frog.y + Frog.height > point.y;
    }

    update(offset) {
        this.jumpTimer--;

        if(this.jumpTimer < 0) {
            this.vx = this.dir * 10;
            this.jumpTimer = 70;
        }

        this.vx *= .92;

        if(Math.abs(this.vx) < 1) {
            this.vx = 0;
        }

        this.x += this.vx;

        if(this.dir * (this.x - canvas.width/2 + this.sprite.width/2) > canvas.width/2 + this.sprite.width) {
            this.x -= (canvas.width + this.sprite.width * 2) * this.dir;
        }
        return this.y > - offset + canvas.height; 
    }

    draw() {
        c.fillStyle = "green";
        c.fillRect(this.x, this.y, this.sprite.width, this.sprite.height);
    }
}

class FrogHandler {
    constructor() {
        this.key = {
            left: false,
            right: false,
            up: false,
            down: false,
        };

        this.car = new Car(canvas.width/2, canvas.height/2, -Math.PI/2);
        this.road = new Road();
        this.frogs = [];
        this.frogAmt = 8;
        this.gameOver = false;
        this.isWon = false;
        this.scrollSpeed = 0;

        this.offset = 0;
        this.nextLayer = 0;
    }

    spawnFrogLayer() {
        let fy = -this.offset - 100;

        fy = Math.floor(fy / 100) * 100;
        let fdir = Math.sign(Math.random() - .5);

        let count = 0;

        for(let i = 1; i < canvas.width / 100; i++) {
            if(Math.random() > .3) continue;
            if(count > 4) break;
            
            let fx = 100 * i * fdir;
            let fjumpTimer = 70 - i * 10;
            let fvx = 0;
            
            this.frogs.push(new Frog(fx, fy, fdir, fjumpTimer, fvx));

            count++
        }
    }

    update() {
        const offsetTarget = Math.max(-this.car.y + canvas.height * .3, this.offset + this.scrollSpeed);
        this.offset += (offsetTarget - this.offset) / 20;

        if(this.scrollSpeed < 40 && !this.gameOver) {
            this.scrollSpeed += .5;
        }

        for(const [index, frog] of this.frogs.entries()) {
            if(frog.update(this.offset)) {
                this.frogs.splice(index, 1);
            }

            let collision = false;
            for(const point of this.car.corners) {
                if(Frog.pointCollide(frog, {x:point[0], y:point[1]})) {
                    collision = true;
                }
            }

            const points = [[frog.x, frog.y], [frog.x + Frog.width, frog.y], [frog.x, frog.y + Frog.height], [frog.x + Frog.width, frog.y + Frog.height]]
            
            for(const point of points) {
                if(Car.pointCollide(this.car, point)) {
                    collision = true;
                }
            }

            if(collision) {
                this.gameOver = true;
                this.isWon = false;
                this.car.alive = false
            }
        }

        if(this.offset > this.nextLayer) {
            this.spawnFrogLayer();
            this.nextLayer += Math.floor(Math.random()*1.1 + 1) * 100;
        }

        this.road.update();

        if(!this.gameOver) {
            if(this.car.update(this.key) > -this.offset + canvas.height) {
                this.gameOver = true;
                this.isWon = false;
                this.car.alive = false
            }
        } else {
            this.car.update(this.key)
            this.scrollSpeed *= .9;
        }
    }

    draw() {
        c.translate(0, this.offset);
        
        this.road.draw(this.offset);
        
        this.car.draw();
        
        for(const frog of this.frogs) {
            frog.draw();
        }

        c.translate(0, -this.offset);
        
        c.globalCompositeOperation = "difference";
        if(this.gameOver) { 
            c.fillStyle = "white";
            c.textAlign = "center";
            c.textBaseline = "middle";
            c.font = "20px Courier New";
            if(this.isWon) {
                c.fillText("wow, nice!", canvas.width/2, canvas.height/2);
            } else {
                c.fillText("the frogs gotcha dude", canvas.width/2, canvas.height/2);
            }
        }
        c.globalCompositeOperation = "source-over";
    }
}

document.addEventListener("keydown", function(e) {
    switch(e.keyCode) {
        case 65:
        case 37:
            gameHandler.key.left = true;
            break;
        case 87:
        case 38:
            gameHandler.key.up = true;
            break;
        case 68:
        case 39:
            gameHandler.key.right = true;
            break;
        case 83:
        case 40:
            gameHandler.key.down = true;
            break;
        default:
    }
});

document.addEventListener("keyup", function(e) {
    switch(e.keyCode) {
        case 65:
        case 37:
            gameHandler.key.left = false;
            break;
        case 87:
        case 38:
            gameHandler.key.up = false;
            break;
        case 68:
        case 39:
            gameHandler.key.right = false;
            break;
        case 83:
        case 40:
            gameHandler.key.down = false;
            break;
        default:
    }
});

let gameHandler = new FrogHandler();

setInterval(function() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "#C0E5C8";
    c.fillRect(0, 0, canvas.width, canvas.height);

    gameHandler.update();
    
    gameHandler.draw();
}, 15);