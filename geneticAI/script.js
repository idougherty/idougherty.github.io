    var ianling = [];
    var projectile = [];
    
    var viewPane = "generate";
    var fighting = false;
    var fightSpeed = 1;
    var contender1 = 10000;
    var contender2 = 10000;
    var competition = false;
    var needsToGenerate = false;
    var fightInterval;
    var ianlingID = 0;
    var competitionNo = 1;
    
    function Projectile(x, y, d, firedBy) {
        this.x = x;
        this.y = y;
        this.d = d;
        this.size = 5;
        this.firedBy = firedBy;
    }
    
    function Ianling(shotReady, dodgeReady, shootingMovementSpeed, reloadingMin, reloadingMax, rank, ID) {
        this.health = 3;
        this.energy = 0;
        this.energyRechargeTimer = 0;
        this.width = 20;
        this.height = 20;
        this.x = 0;
        this.y = 0;
        this.d = 0;
        this.vd = 0;
        this.vx = 0;
        this.vy = 0;
        this.shotTimer = 0;
        this.shotReady = shotReady;
        this.dodgeTimer = 0;
        this.dodgeReady = dodgeReady;
        this.shootingMovementSpeed = shootingMovementSpeed;
        this.reloadingMin = 0;//reloadingMin;
        this.reloadingMax = 5;//reloadingMax;
        this.rank = rank;
        this.wins = 0;
        this.losses = 0;
        this.speed = 1;
        this.shooting = false;
        this.ID = ID;
    }
    
    Ianling.prototype.reset = function() {
        this.health = 3;
        this.energy = 0;
        this.energyRechargeTimer = 0;
        this.width = 20;
        this.height = 20;
        this.x = 0;
        this.y = 0;
        this.d = 0;
        this.vd = 0;
        this.vx = 0;
        this.vy = 0;
        this.shotTimer = 0;
        this.dodgeTimer = 0;
        this.wins = 0;
        this.losses = 0;
        this.speed = 1;
        this.shooting = false;
    };
    
    
    
    function contender1Collision() {
        if(ianling[contender1].x <= 25 || ianling[contender1].x + ianling[contender1].width >= 395 || ianling[contender1].y <= 25 || ianling[contender1].y + ianling[contender1].height >= 375) {
            ianling[contender1].d -= 180;
        }
        
        var i;
        for(i = 0; i < projectile.length; i++) {
            if(ianling[contender1].x <= projectile[i].x + projectile[i].size && ianling[contender1].x + ianling[contender1].width >= projectile[i].x && ianling[contender1].y <= projectile[i].y + projectile[i].size && ianling[contender1].y + ianling[contender1].width >= projectile[i].y && projectile[i].firedBy !== "1") {
                 ianling[contender1].health -= 1;
                 projectile.splice(i, 1);
            }
        }
    }
    
    function contender2Collision() {
        if(ianling[contender2].x <= 405 || ianling[contender2].x + ianling[contender2].width >= 775 || ianling[contender2].y <= 25 || ianling[contender2].y + ianling[contender2].height >= 375) {
            ianling[contender2].d -= 180;
        }
        
        var i;
        for(i = 0; i < projectile.length; i++) {
            if(ianling[contender2].x <= projectile[i].x + projectile[i].size && ianling[contender2].x + ianling[contender2].width >= projectile[i].x && ianling[contender2].y <= projectile[i].y + projectile[i].size && ianling[contender2].y + ianling[contender2].width >= projectile[i].y && projectile[i].firedBy !== "2") {
                 ianling[contender2].health -= 1;
                 projectile.splice(i, 1);
            }
        }
    }
    
    Ianling.prototype.reload = function() {
        this.speed = 2;
        this.energyRechargeTimer++;
        if(this.energyRechargeTimer === 100) {
            this.energy += 1;
        } else if(this.energyRechargeTimer === 120) {
            this.energy += 1;
        } else if(this.energyRechargeTimer === 140) {
            this.energy += 1;
        } else if(this.energyRechargeTimer === 160) {
            this.energy += 1;
        } else if(this.energyRechargeTimer === 180) {
            this.energy += 1;
            this.energyRechargeTimer = 0;
        }
    };
    
    function contender1Shoot() {
        ianling[contender1].energyRechargeTimer = 0;
        ianling[contender1].shotTimer++;
        ianling[contender1].speed = ianling[contender1].shootingMovementSpeed;
        if(ianling[contender1].shotTimer >= ianling[contender1].shotReady) {
            ianling[contender1].shotTimer = 0;
            ianling[contender1].energy -= 1;
            projectile.push(new Projectile(ianling[contender1].x + ianling[contender1].width/2, ianling[contender1].y + ianling[contender1].height/2, ((Math.atan2((ianling[contender2].y - ianling[contender1].y), ianling[contender2].x - ianling[contender1].x)) * 180 / Math.PI), "1"));
        
            projectile[projectile.length-1].d += Math.random() * ianling[contender1].speed*10 - ianling[contender1].speed*10/2;
        }
    }
    
    function contender2Shoot() {
        ianling[contender2].energyRechargeTimer = 0;
        ianling[contender2].shotTimer++;
        ianling[contender2].speed = ianling[contender2].shootingMovementSpeed;
        if(ianling[contender2].shotTimer >= ianling[contender2].shotReady) {
            ianling[contender2].shotTimer = 0;
            ianling[contender2].energy -= 1;
            projectile.push(new Projectile(ianling[contender2].x + ianling[contender2].width/2, ianling[contender2].y + ianling[contender2].height/2, ((Math.atan2((ianling[contender1].y - ianling[contender2].y), ianling[contender1].x - ianling[contender2].x)) * 180 / Math.PI), "2"));
        
            projectile[projectile.length-1].d += Math.random() * ianling[contender2].speed*10 - ianling[contender2].speed*10/2;
        }
    }
    
    Ianling.prototype.dodge = function() {
        this.x += (Math.abs(Math.abs(this.d) % 360 - 180) - 90) * 0.02 * this.speed;
        this.y += (Math.abs(Math.abs(this.d - 90) % 360 - 180) - 90) * 0.02 * this.speed;
        
        this.dodgeTimer++;
        if(this.dodgeTimer >= this.dodgeReady) {
            this.d = Math.random()*360;
            this.dodgeTimer = 0;
        }
    };
    
    function findRank() {
        ianling.sort(function(a, b) {
            return a.wins - b.wins;
        });
        
        
    }
    
    function projectileMove(i) {
        projectile[i].x += (Math.abs(Math.abs(projectile[i].d) % 360 - 180) - 90) * 0.06;
        projectile[i].y += (Math.abs(Math.abs(projectile[i].d - 90) % 360 - 180) - 90) * 0.074;
    }
    
    function chooseContender() {
        
        if(contender2 + 1 === ianling.length || contender2 <= 0) {
            contender1 += 1;
            contender2 = contender1 + 1;
        } else {
            contender2 += 1;
        }
        
        competition = true;
        
        if(contender1 > ianling.length || contender1 < 0 || contender1 + 1 === ianling.length) {
            contender1 = 0;
            contender2 = 1;
            
            competitionNo += 1;
            var i;
            for(i = 0; i < ianling.length; i++) {
                ianling[i].reset();
                ianling[i].wins = 0;
            }
        }
        
        if(contender1 + 2 === ianling.length) {
            competition = false;
            needsToGenerate = true;
            generate();
        }
    }
    
    function toTheDeath() {
        if(ianling[contender1].energy >= ianling[contender1].reloadingMax || ianling[contender1].shooting === true) {
            ianling[contender1].shooting = true;
            contender1Shoot();
            if(ianling[contender1].energy <= ianling[contender1].reloadingMin) {
                ianling[contender1].shooting = false;
            }
        } else {
            ianling[contender1].reload();
        }
        
        if(ianling[contender2].energy >= ianling[contender2].reloadingMax || ianling[contender2].shooting === true) {
            ianling[contender2].shooting = true;
            contender2Shoot();
            if(ianling[contender2].energy <= ianling[contender2].reloadingMin) {
                ianling[contender2].shooting = false;
            }
        } else {
            ianling[contender2].reload();
        }
        
        ianling[contender1].dodge();
        contender1Collision();
        ianling[contender2].dodge();
        contender2Collision();
        
        if(ianling[contender1].health <= 0) {
            ianling[contender1].losses += 1;
            ianling[contender2].wins += 1;
            clearInterval(fightInterval);
            fighting = false;
            projectile.splice(0, projectile.length);
            
            if(competition === true) {
                fight();
            }
        }
        
        if(ianling[contender2].health <= 0) {
            ianling[contender2].losses += 1;
            ianling[contender1].wins += 1;
            clearInterval(fightInterval);
            fighting = false;
            projectile.splice(0, projectile.length);
            
            if(competition === true) {
                fight();
            }
        }
        
        var i;
        for(i = 0; i < projectile.length; i++) {
            projectileMove(i);
        }
    }
    
    
    
    function showInfo() {
        var infoDisplay = $("#infoDisplay");
        
        infoDisplay.append("<h2>Ianlings of Generation "+(competitionNo-1)+"</h2>");
        
        var i;
        for(i = 0; i < ianling.length; i++) {
            infoDisplay.append("<h4>Ianling "+ianling[i].ID+"</h4>"+
            "<p>Movement Speed While Shooting: "+ianling[i].shootingMovementSpeed+"</p>"+
            "<p> Dodging Frequency: "+ianling[i].dodgeReady+"</p>"+
            "<p>Shooting Frequency: "+ianling[i].shotReady+"</p>"+
            "<p>Amount of Shots: "+(ianling[i].reloadingMax-ianling[i].reloadingMin)+"</p>"+
            "<p>Wins: "+ianling[i].wins+"</p>");
        }
    }
    
    function fight() {
        viewPane = "fight";
        if(ianling.length === 0) {
            
        } else if(fighting === false) {
            fighting = true;
            chooseContender();
            fightInterval = setInterval(toTheDeath, fightSpeed);
            
            ianling[contender2].x = 590;
            ianling[contender2].y = 190;
            ianling[contender2].health = 3;
            ianling[contender2].d = 0;
            
            ianling[contender1].x = 190;
            ianling[contender1].y = 190;
            ianling[contender1].health = 3;
            ianling[contender1].d = 180;
        }
    }
    
    function generate() {
        if(ianling.length === 0) {
            var i;
            for(i = 0; i < 10; i++) {
                ianling.push(new Ianling(
                Math.floor(Math.random()*150)+10,
                Math.floor(Math.random()*150),
                Math.random()*3,
                Math.floor(Math.random()*5),
                Math.floor(Math.random()*5) + 5,
                i + 1, 
                ianlingID));
                ianlingID += 1;
            }
        } else if(needsToGenerate === true) {
            findRank();
            showInfo();
            
            console.log(ianling);
            
            var j;
            for(j = 0; j < ianling.length; j++) {
                if(j <= ianling.length/2) {
                    ianling.splice(j, 1);
                }
            }
            
            console.log(ianling);
            
            var oopsFixer = ianling.length/2;
            for(j = 0; j <= oopsFixer; j++) {
                var mate1 = j;
                var mate2 = Math.floor(Math.random()*ianling.length/2);
                
                ianling.push(new Ianling((ianling[mate1].shotReady + ianling[mate2].shotReady)/2,
                (ianling[mate1].dodgeReady + ianling[mate2].dodgeReady)/2,
                (ianling[mate1].shootingMovementSpeed + ianling[mate2].shootingMovementSpeed)/2,
                (ianling[mate1].reloadingMin + ianling[mate2].reloadingMin)/2,
                (ianling[mate1].reloadingMax + ianling[mate2].reloadingMax)/2,
                ianling.length, 
                ianlingID));
                ianlingID += 1;
            }
            
            console.log(ianling);
        }
        fight();
    }
    
window.onload = function() {
    
    generate();
    
    var canvas = document.getElementById("paper");
    var c = canvas.getContext("2d");
    
    function drawFight() {
        c.beginPath();
        c.moveTo(canvas.width/2, 0);
        c.lineTo(canvas.width/2, canvas.height);
        
        c.lineWidth = 8;
        c.strokeStyle = "#ccc";
        c.stroke();
        
        c.fillStyle = "#333";
        c.fillText("health: " + ianling[contender1].health, 40, 40);
        c.fillText("health: " + ianling[contender2].health, 440, 40);
        
        c.fillText("rank: " + contender1, 40, 60);
        c.fillText("rank: " + contender2, 440, 60);
        
        c.fillStyle = "#aa33aa";
        c.fillRect(ianling[contender1].x, ianling[contender1].y, ianling[contender1].width, ianling[contender1].height);
        
        c.fillStyle = "#33aaaa";
        c.fillRect(ianling[contender2].x, ianling[contender2].y, ianling[contender2].width, ianling[contender2].height);
        
        c.fillStyle = "#33a";
        var i;
        for(i = 0; i < projectile.length; i++) {
            c.fillRect(projectile[i].x, projectile[i].y, projectile[i].size, projectile[i].size);
        }
    }
    
    function drawGenerate() {
        
    }

    setInterval(function() {
        c.fillStyle = "white";
        c.fillRect(0, 0, canvas.width, canvas.height);
        
        switch(viewPane) {
            case "fight":
                drawFight();
                break;
            case "generate":
                drawGenerate();
                break;
                default:
        }
        
        c.strokeStyle = "#aaa";
        c.lineWidth = 50;
        c.strokeRect(0, 0, canvas.width, canvas.height);
    }, fightSpeed);
};