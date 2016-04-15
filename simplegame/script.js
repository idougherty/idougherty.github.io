window.onload = function() {
  
  var canvas = document.getElementById("paper");
  var c = canvas.getContext("2d");
  
  var p = [];
  
  var player = {
    x: 50,
    y: 295,
    vy: 0,
    width: 40,
    height: 20,
    keyDown: null,
    alive: true,
    score: 0,
    shotReady: true,
    health: 3,
    hurtin: 0,
    vulnerable: true,
    visibility: 0,
    visibilityMod: -1,
    draw: function() {
      var i;
      for(i = 0; i < rocks.length; i++) {
        player.collision(i);
      }
      
      player.y += player.vy;
      player.vy *= 0.3;
      
      if(player.vulnerable === false) {
        player.visibility += player.visibilityMod;
        if(player.visibility >= 1) {
          player.visibilityMod = -0.05;
        } else if(player.visibility <= 0) {
          player.visibilityMod = 0.05;
        }
      } else {
        player.visibility = 1;
      }
      
      c.globalAlpha = player.visibility;
      c.fillStyle = "white";
      c.drawImage(document.getElementById("ufo"), player.x, player.y, player.width, player.height);
      c.globalAlpha = 1;
    },
    collision: function(i) {
      if(player.x <= rocks[i].x + rocks[i].width && player.x + player.width >= rocks[i].x && player.y <= rocks[i].y + rocks[i].height && player.y + player.height >= rocks[i].y && player.vulnerable === true) {
        if(rocks[i].type === "rock") {
          player.health -= 1;
          rocks.splice(i, 1);
          
          player.hurtin = 1;
          player.vulnerable = false;
          setTimeout(function(){player.vulnerable = true}, 2000);
          
          c.fillStyle = "rgba(255, 100, 100, 1)";
          c.fillRect(0, 0, canvas.width, canvas.height);
          
          if(player.health <= 0) {
            player.alive = false;
            player.explode();
          }
        } else {
          player.score += 500;
          rocks.splice(i, 1);
        }
      }
    },
    explode: function () {
      var i;
      for(i = 0; i < 150; i++) {
        p.push({
          x: player.x + 5,
          y: player.y + 5,
          vx: Math.random() * 10 - 5 + player.vy * 0.7,
          vy: Math.random() * 5 - 2.5 + player.vy * 0.7,
          isBullet: false,
        });
      }
    },
    shoot: function() {
      p.push({
        x: player.x + 9,
        y: player.y + 9,
        vx: 10,
        vy: 0,
        height: 3,
        width: 3,
        isBullet: true,
        collision: function(j) {
          var i;
          for(i = 0; i < rocks.length; i++) {
            
            if(p[j].x <= rocks[i].x + rocks[i].width && p[j].x + p[j].width >= rocks[i].x && p[j].y <= rocks[i].y + rocks[i].height && p[j].y + p[j].height >= rocks[i].y) {
              rocks.splice(i, 1);
              p.splice(j, 1);
            }
            
          }
        }
      });
    },
    reset: function() {
      player.x = 50;
      player.y = 295;
      player.keyDown = null;
      player.alive = true;
      player.score = 0;
      player.shotReady = true;
      player.health = 3;
      player.hurtin = 0;
      
      rocks.splice(0, rocks.length);
      rockCounter = 0;
      makeRocks();
    }
  };
  
  document.body.addEventListener('keydown', function(e) {
    switch(e.which) {
      case 38:
        if(player.keyDown === null) {
          player.keyDown = setInterval(function() {
            if(player.y > 0)
              player.vy = -7;
          }, 30);
        }
        break;
      case 40:
        if(player.keyDown === null) {
          player.keyDown = setInterval(function() {
            if(player.y + player.height < canvas.height)
              player.vy = 7;
          }, 30);
        }
        break;
      case 32:
        if(player.alive === false) {
          player.reset();
        }
        break;
      default:
    }
  });
  
  document.body.addEventListener('keyup', function(e) {
    switch(e.which) {
      case 38:
      case 40:
        clearInterval(player.keyDown);
        player.keyDown = null;
        break;
      default:
    }
  });
  
  function Rock(type) {
    this.x = canvas.width;
    this.y = Math.random() * canvas.height - 10;
    this.width = Math.random() * 15 + 20;
    this.height = Math.random() * 15 + 20;
    this.speed = 5;
    this.type = type;
    this.i = rocks.length;
  }
  
  Rock.prototype.collision = function(i) {
    if(this.x + this.width <= -50) {
      this.x = canvas.width;
      this.y = Math.random() * canvas.height - 10;
      if(this.type !== "rock") {
        rocks.splice(i, 1);
      }
    }
  };
  
  Rock.prototype.draw = function(i) {
    this.move();
    this.collision(i);
    
    if(this.type === "rock") {
      c.drawImage(document.getElementById("rock"), this.x, this.y, this.width, this.height);
    } else {
      c.drawImage(document.getElementById("coin"), this.x, this.y, this.width, this.height);
    }
  };
  
  Rock.prototype.move = function() {
    this.x -= this.speed;
    if(this.speed <= 12.5) {
      this.speed *= 1.00025;
    }
  };
  
  var rocks = [];
  
  var rockAmount = 40;
  var rockCounter = 0;
  
  function makeRocks() {
    setTimeout(function() {
      rocks.push(new Rock("rock"));
      rockCounter++;
      
      if(rockCounter < rockAmount) {
        makeRocks();
      }
    }, 200);
  }
  
  makeRocks();
  
  setInterval(function() {
    rocks.push(new Rock("not a rock lololol"));
  }, 5000);
  
  var position = 0;
  
  setInterval(function(){
    c.globalAlpha = 0.45;
    c.drawImage(document.getElementById("background"), position, 0, 600, 600);
    c.drawImage(document.getElementById("background"), position + 600, 0, 600, 600);
    c.drawImage(document.getElementById("background"), position + 1200, 0, 600, 600);
    c.globalAlpha = 1;
    
    if(position <= -600) {
      position = 0;
    }
    position -= 1;
    
    if(player.alive) {
      player.draw();
      player.score += 1;
    }
    
    var i;
    for(i = 0; i < rocks.length; i++) {
      rocks[i].draw(i);
    }
    
    for(i = 0; i < p.length; i++) {
        p[i].x += p[i].vx;
        p[i].y += p[i].vy;
        //p[i].vy += 0.1;
      if(p[i].isBullet === false) {
        p[i].vx -= 7 * 0.05;
        p[i].vx *= 0.98;
        p[i].vy *= 0.95;
      } else {
        p[i].collision(i);
      }   
      
      c.fillStyle = "white";
      c.fillRect(p[i].x, p[i].y, 3, 3);
    }
    
    
    c.font = "15px Courier New";
    c.fillStyle = "white";
    c.fillText("Score: " + player.score, 20, 20);
  
    c.fillText("Health: " + player.health, 20, 35);
    
    if(player.alive || player.hurtin > 0.01) {
      c.fillStyle = "rgba(0, 0, 0, 0)";
      c.fillStyle = "rgba(255, 100, 100, "+player.hurtin+")";
      c.fillRect(0, 0, canvas.width, canvas.height);
      player.hurtin *= 0.90;
    } else {
      c.font = "35px Courier New";
      c.fillStyle = "white";
      c.fillText("Press [space] to restart", 200, 290);
    }
    
    if(player.score > 20000) {
      c.font = "35px Courier New";
      c.fillStyle = "white";
      c.fillText("Good job Delgado", 200, 290);
      c.fillRect(0, 598, 2, 2);
    }
  }, 30);
};