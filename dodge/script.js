window.onload = function() {
    var canvas = document.getElementById("paper");
    var c = canvas.getContext("2d");
    var music = document.getElementById("music");
    var keyDownX;
    var keyDownY;
    var keyAlreadyDownX = 0;
    var keyAlreadyDownY = 0;
    var gapPosTop = Math.floor((Math.random() * canvas.width * 1 / 4) + (canvas.width / 4));
    var gapPosLeft = Math.floor((Math.random() * canvas.height * 1 / 4) + (canvas.height / 4));
    var speed = 3;
    var score = 0;
    var levelCounter = 0;
    var p = [];
    var i;
    var gamespeed = 30;
    
    var player = {
      x: canvas.width / 2 - 10,
      y: canvas.height / 2 - 10,
      width: 20,
      height: 20,
      speed: 5,
      alive: "kinda"
    };
    
    var crusher = {
        top: {
            left: {
                x: 0,
                y: 0,
                width: 220,
                height: 40
            },
            right: {
                x: 280,
                y: 0,
                width: 220,
                height: 40
            },
            direction: 1
        },
        left: {
            top: {
                x: 0,
                y: 0,
                width: 40,
                height: 220
            },
            bottom: {
                x: 0,
                y: 280,
                width: 40,
                height: 220
            },
            direction: 1
        }
    };
    
    function addParticles() {
        for(i = 0; i < 101; i++) {
          p.push({x: player.x, y: player.y, vx: Math.random()*10 - 5, vy: Math.random()*-5});
        }
    }
    
    document.body.addEventListener('keydown', function(e) {
      switch(e.which) {
        case 37:
          if((keyAlreadyDownX === 0)) {
            keyAlreadyDownX = 1;
            keyDownX = setInterval(function() {
                if(player.x >= 0) {
                  player.x -= player.speed;
                }
            }, gamespeed);
          }
          break;
        case 38:
          if((keyAlreadyDownY === 0)) {
            keyAlreadyDownY = 1;
            keyDownY = setInterval(function() {
                if(player.y >= 0) {
                    player.y -= player.speed;  
                }
            }, gamespeed);
          }
          break;
        case 39:
          if((keyAlreadyDownX === 0)) {
            keyAlreadyDownX = 1;
            keyDownX = setInterval(function() {
                if(player.x + player.width <= canvas.width) {
                  player.x += player.speed;
                }
            }, gamespeed);
          }
          break;
        case 40:
          if((keyAlreadyDownY === 0)) {
            keyAlreadyDownY = 1;
            keyDownY = setInterval(function() {
                if(player.y + player.width <= canvas.height) {
                    player.y += player.speed;
                }
            }, gamespeed);
          }
          break;
        case 32:
          if(player.alive !== true) {
              player.alive = true;
              score = 0;
              music.play();
          }
          break;
        default:
      }
    });
    
    document.body.addEventListener('keyup', function(e) {
      switch(e.which) {
        case 37:
        case 39:
          clearInterval(keyDownX);
          keyAlreadyDownX = 0;
          break;
        case 38:
        case 40:
          clearInterval(keyDownY);
          keyAlreadyDownY = 0;
          break;
        default:
      }
    });
    
    setInterval(function() {
      c.fillStyle = "rgba(255, 255, 255, 0.3)";
      c.fillRect(0, 0, canvas.width, canvas.height);
      
      if(player.alive === true) {
          if(levelCounter <= 500) {
              crusher.top.left.y += speed * crusher.top.direction;
              crusher.top.right.y += speed * crusher.top.direction;
              crusher.left.top.x += speed * crusher.left.direction;
              crusher.left.bottom.x += speed * crusher.left.direction;
              levelCounter += speed;
          } else {
              crusher.top.direction = Math.floor(Math.random()*2);
              if(crusher.top.direction === 0) {
                  crusher.top.direction = -1;
              }
              
              crusher.left.direction = Math.floor(Math.random()*2);
              if(crusher.left.direction === 0) {
                  crusher.left.direction = -1;
              }
              
              gapPosTop = Math.floor((Math.random() * canvas.width * 1 / 4) + (canvas.width / 4));
              gapPosLeft = Math.floor((Math.random() * canvas.height * 1 / 4) + (canvas.height / 4));
              
              if(crusher.top.direction === 1) {
                  crusher.top.left.y = 0;
                  crusher.top.right.y = 0;
              
                  crusher.top.left.width = gapPosTop;
                  crusher.top.right.x = gapPosTop + 60;
                  crusher.top.right.width = canvas.width - (gapPosTop + 60);
              } else {
                  crusher.top.left.y = canvas.height - crusher.top.left.height;
                  crusher.top.right.y = canvas.height - crusher.top.right.height;
              
                  crusher.top.left.width = gapPosTop;
                  crusher.top.right.x = gapPosTop + 60;
                  crusher.top.right.width = canvas.width - (gapPosTop + 60);
              }
              
              if(crusher.left.direction === 1) {
                  crusher.left.top.x = 0;
                  crusher.left.bottom.x = 0;
              
                  crusher.left.top.height = gapPosLeft;
                  crusher.left.bottom.y = gapPosLeft + 60;
                  crusher.left.bottom.height = canvas.width - (gapPosLeft + 60);
              } else {
                  crusher.left.top.x = canvas.width - crusher.left.top.width;
                  crusher.left.bottom.x = canvas.width - crusher.left.bottom.width;
              
                  crusher.left.top.height = gapPosLeft;
                  crusher.left.bottom.y = gapPosLeft + 60;
                  crusher.left.bottom.height = canvas.width - (gapPosLeft + 60);
              }
              
              levelCounter = 0;
              
              score++;
              gamespeed /= 1.05;
              if(speed <= 5) {
                  speed += 0.5;
              } else if(speed <= 7.5){
                  speed += 0.1;
              }
          }
  
          c.fillStyle = "black";
          c.font = "25px Courier New";
          c.fillText("Score: " + score, 40, 40);
          
          if((player.x + player.width >= crusher.top.left.x) && (player.x <= crusher.top.left.x + crusher.top.left.width) && (player.y + player.width >= crusher.top.left.y) && (player.y <= crusher.top.left.y + crusher.top.left.height)) {
              player.alive = false;
              music.pause(); 
              music.load();
            addParticles();
          } else if((player.x + player.width >= crusher.top.right.x) && (player.x <= crusher.top.right.x + crusher.top.right.width) && (player.y + player.width >= crusher.top.right.y) && (player.y <= crusher.top.right.y + crusher.top.right.height)) {
              player.alive = false;
            music.pause(); 
            music.load();
            addParticles();
          } else if((player.x + player.width >= crusher.left.top.x) && (player.x <= crusher.left.top.x + crusher.left.top.width) && (player.y + player.width >= crusher.left.top.y) && (player.y <= crusher.left.top.y + crusher.left.top.height)) {
            player.alive = false;
            music.pause(); 
            music.load();
            addParticles();
            
          } else if((player.x + player.width >= crusher.left.bottom.x) && (player.x <= crusher.left.bottom.x + crusher.left.bottom.width) && (player.y + player.width >= crusher.left.bottom.y) && (player.y <= crusher.left.bottom.y + crusher.left.bottom.height)) {
            player.alive = false;
            music.pause(); 
            music.load();
            addParticles();
          }
          
          c.fillStyle = "#ff6666";
          c.fillRect(crusher.top.left.x, crusher.top.left.y, crusher.top.left.width, crusher.top.left.height);
          c.fillRect(crusher.top.right.x, crusher.top.right.y, crusher.top.right.width, crusher.top.right.height);
          c.fillRect(crusher.left.top.x, crusher.left.top.y, crusher.left.top.width, crusher.left.top.height);
          c.fillRect(crusher.left.bottom.x, crusher.left.bottom.y, crusher.left.bottom.width, crusher.left.bottom.height);
          
          c.fillStyle = "#00aaaa";
          c.fillRect(player.x, player.y, player.width, player.height);
      } else if(player.alive === false) {
          
          c.fillStyle = "black";
          c.font = "25px Courier New";
          c.fillText("Score: " + score, 195, 245);
          c.fillText("[Space to Restart]", 120, 275);
          gamespeed = 30;
          
          for(i = 0; i < p.length; i++) {
              p[i].x += p[i].vx;
              p[i].y += p[i].vy;
              p[i].vy += 0.3;
            
              
              c.fillStyle = "#11aaaa";
              c.fillRect(p[i].x, p[i].y, 5, 5);
          }
          
          gapPosTop = Math.floor((Math.random() * canvas.width * 1 / 4) + (canvas.width / 4));
          gapPosLeft = Math.floor((Math.random() * canvas.height * 1 / 4) + (canvas.height / 4));
          speed = 3;
          levelCounter = 0;
    
          player = {
              x: canvas.width / 2 - 10,
              y: canvas.height / 2 - 10,
              width: 20,
              height: 20,
              speed: 5,
              alive: false
          };
    
          crusher = {
            top: {
                left: {
                    x: 0,
                    y: 0,
                    width: 220,
                    height: 40
                },
                right: {
                    x: 280,
                    y: 0,
                    width: 220,
                    height: 40
                },
                direction: 1
            },
            left: {
                top: {
                    x: 0,
                    y: 0,
                    width: 40,
                    height: 220
                },
                bottom: {
                    x: 0,
                    y: 280,
                    width: 40,
                    height: 220
                },
                direction: 1
            }
          };
      } else {
          c.fillStyle = "black";
          c.font = "25px Courier New";
          c.fillText("[Space to Start]", 120, 275);
      }
    }, gamespeed);
  };
  