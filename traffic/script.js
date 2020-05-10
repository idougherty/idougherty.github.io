window.onload = function() {
var time = 3;
    
var canvas = document.getElementById("paper");
var c = canvas.getContext("2d");

var carnum = 0;
var data = {
    flowtotal: 0,
    collecting: false,
    trafficintensity: 9,
};

var intersection = {
    x: 210,
    y: 210,
    width: 180,
    height: 180,
    stateNS: "green",
    stateWE: "red",
    timer: 0,
    yellowLength: 5,
    redLength: 15,
    greenNS: function() {
        intersection.stateNS = "green";
        intersection.stateWE = "red";
        setTimeout(intersection.yellowNS, (intersection.redLength-intersection.yellowLength)*1000/time);
    },
    yellowNS: function() {
        intersection.stateNS = "yellow";
        setTimeout(intersection.redNS, intersection.yellowLength*1000/time);
    },
    redNS: function() {
        intersection.stateNS = "red";
        intersection.stateWE = "green";
        setTimeout(intersection.greenNS, intersection.redLength*1000/time);
        setTimeout(intersection.yellowWE, intersection.yellowLength*1000/time);
    },
    yellowWE: function() {
        intersection.stateWE = "yellow";
    }
};

function Car(x, y, d, exitPath) {
    this.x = x;
    this.y = y;
    this.d = d;
    this.od = d;
    this.exitPath = exitPath;
    this.vx = 0;
    this.vy = 0;
    this.vd = 0;
    this.width = 35;
    this.height = 20;
    this.speed = 3;
    this.vspeed = 0;
    this.color = "hsl("+(Math.random()*360)+", "+((Math.random()*20)+30)+"%, "+((Math.random()*20)+20)+"%)";
    this.turning = false;
    this.turned = false;
    this.runCar = function() {
        this.think();
        this.move();
        this.draw();
        
        if(this.turning) {
            this.turn();
        }
        
        if(this.y - this.width/2 > 600 || this.x - this.width/2 > 600 || this.y + this.width/2 < 0 || this.x + this.width/2 < 0) {
            cars.splice(cars.indexOf(this), 1);
            carnum--;
            if(data.collecting)
                data.flowtotal++;
        }
    };
    this.turn = function() {
        if(this.y + this.width/2 > 260 && this.x + this.width/2 > 260 && this.y - this.width/2 < 340 && this.x - this.width/2 < 340) {
            switch(this.exitPath) {
                case 1:
                    if(this.d >= this.od + 90) {
                        this.d = this.od + 90;
                        this.vd = 0;
                        this.turning = false;
                        this.turned = true;
                    } else {
                        this.vd = 5;
                    }
                    break;
                case 0:
                    this.vd = 0;
                    this.turning = false;
                    this.turned = true;
                    break;
                case -1:
                    if(this.d <= this.od - 90) {
                        this.d = this.od - 90;
                        this.vd = 0;
                        this.turning = false;
                        this.turned = true;
                    } else {
                        this.vd = -2.3;
                    }
                    break;
                default:
                    this.turning = false;
            }
        } else {
            this.vd = 0;
        }
    };
    this.stop = function() {
        if(this.speed > 0) {
            this.vspeed = -0.15;
        } else {
            this.speed = 0;
        }
    };
    this.think = function() {
        if(this.speed > 3) {
            this.vspeed = -0.1;
        } else if(this.speed < 3) {
            this.vspeed = 0.1;
        } else {
            this.vspeed = 0;
        }
        
        if(this.x + this.width/2 > intersection.x && this.y + this.width/2 > intersection.y && this.x - this.width/2 < intersection.x + intersection.width && this.y - this.width/2 < intersection.y + intersection.height) {
            if(this.od === 90 || this.od === -90) {
                switch(intersection.stateNS) {
                    case "green":
                        this.speed = 3;
                        this.turning = true;
                        break;
                    case "yellow":
                        if(!this.turning && this.turned === false) {
                            this.stop();
                        }
                        break;
                    case "red":
                        if(!this.turning && this.turned === false) {
                            this.stop();
                        }
                        break;
                    default:
                }
            } else {
                switch(intersection.stateWE) {
                    case "green":
                        this.speed = 3;
                        this.turning = true;
                        break;
                    case "yellow":
                        if(!this.turning && this.turned === false) {
                            this.stop();
                        }
                        break;
                    case "red":
                        if(!this.turning && this.turned === false) {
                            this.stop();
                        }
                        break;
                    default:
                }
            }
        }
        
        for(var i = 0; i < cars.length; i++) {
            if(this.d === 90 && cars[i].y - this.width/2 < this.y + this.width/2 + 40 && cars[i].y > this.y && cars[i].d === 90) {
                this.stop();
            } else if(this.d === -90 && cars[i].y + this.width/2 > this.y - this.width/2 - 40 && cars[i].y < this.y && cars[i].d === -90) {
                this.stop();
            } else if(this.d === 0 && cars[i].x - this.width/2 < this.x + this.width/2 + 40 && cars[i].x > this.x && cars[i].d === 0) {
                this.stop();
            } else if(this.d === 180 && cars[i].x + this.width/2 > this.x - this.width/2 - 40 && cars[i].x < this.x && cars[i].d === 180) {
                this.stop();
            }
        }
    };
    this.move = function() {
        this.speed += this.vspeed;
        this.vx = this.speed * Math.cos(this.d * Math.PI / 180);
        this.vy = this.speed * Math.sin(this.d * Math.PI / 180);
        
        this.x += this.vx;
        this.y += this.vy;
        this.d += this.vd;
    };
    this.draw = function() {
        c.translate(this.x, this.y);
        c.rotate(this.d * Math.PI / 180);
        c.fillStyle = this.color;
        c.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        c.rotate(-this.d * Math.PI / 180);
        c.translate(-this.x , -this.y);
    };
}

var cars = [];

function runsim() {
    c.fillStyle = "#385";
    c.fillRect(0, 0, 600, 600);
    
    c.fillStyle = "#999";
    c.fillRect(260, 0, 80, 600);
    c.fillRect(0, 260, 600, 80);
    
    for(var i = 0; i < cars.length; i++) {
        cars[i].runCar();
    }
    
    c.globalAlpha = 0.3;
    c.fillStyle = intersection.stateNS;
    c.fillRect(210, 210, 180, 50);
    c.fillRect(210, 340, 180, 50);
    c.fillStyle = intersection.stateWE;
    c.fillRect(210, 210, 50, 180);
    c.fillRect(340, 210, 50, 180);
    c.globalAlpha = 1;
    
    if(carnum < data.trafficintensity && data.collecting) {
        carnum++;
        setTimeout(function() {
            switch(Math.floor(Math.random() * 4)) {
                case 0:
                    cars.push(new Car(280, 0, 90, Math.floor(Math.random() * 3) - 1, cars.length));
                    break;
                case 1:
                    cars.push(new Car(320, 600, -90, Math.floor(Math.random() * 3) - 1));
                    break;
                case 2:
                    cars.push(new Car(0, 320, 0, Math.floor(Math.random() * 3) - 1));
                    break;
                case 3:
                    cars.push(new Car(600, 280, 180, Math.floor(Math.random() * 3) - 1));
                    break;
            }
        }, Math.random() * 10000/time);
    }
}

document.getElementById("startbtn").addEventListener("click", function() {
    intersection.greenNS();
    
    data.collecting = true;
    
    setTimeout(function() {
        data.collecting = false;
        console.log(data.flowtotal/6);
        data.flowtotal = 0;
    }, 21600000/time);
});

setInterval(runsim, 60/time);
};