window.onload = function() {
    var canvas = document.getElementById("paper");
    var c = canvas.getContext("2d");
    var scl = 20;
    var time = 300;
    
    var food = {
        foods: [],
        create: function() {
            food.foods.push({x: Math.floor(Math.random()*canvas.height/scl) * scl, y: Math.floor(Math.random()*canvas.height/scl)*scl});
            time *= .9;
        },
        draw: function() {
            c.fillStyle = "#11ee55";
            for(var i = 0; i < food.foods.length; i++) {
                c.fillRect(food.foods[i].x, food.foods[i].y, scl, scl);
            }
        }
    };
    
    food.create();
    food.create();
    food.create();
    food.create();
    
    var snake = {
        x: 40,
        y: 40,
        vx: 1,
        vy: 0,
        height: 20,
        width: 20,
        length: 2,
        tail: [],
        dead: false,
        steps: [],
        move: function() {
            snake.x += snake.vx * scl;
            snake.y += snake.vy * scl;
        },
        draw: function() {
            c.fillStyle = "#3388bb";
            
            c.fillRect(snake.x, snake.y, scl, scl);
            
            for(var i = 0; i < snake.tail.length; i++) {
                c.fillStyle = "#3366aa";
                c.fillRect(snake.tail[i].x, snake.tail[i].y, scl, scl);
            }
        },
        grow: function () {
            if(snake.tail.length <= snake.length) {
                snake.tail.push({x: snake.x, y: snake.y, life: snake.length-1});
            }
            
            for(var i = 0; i < snake.tail.length; i++) {
                
                if(snake.tail[i].life === 0) {
                    snake.tail.splice(i, 1);
                }
                
                snake.tail[i].life -= 1;
            }
        },
        collision: function() {
            for(var i = 0; i < food.foods.length; i++) {
                if(snake.x === food.foods[i].x && snake.y === food.foods[i].y) {
                    snake.length += 100;
                    food.foods.splice(i, 1);
                    food.create();
                }
            }
            
            for(i = 0; i < snake.tail.length; i++) {
                if(snake.x === snake.tail[i].x && snake.y === snake.tail[i].y) {
                    snake.dead = true;
                }
            }
            
            for(i = 0; i < snake2.tail.length; i++) {
                if(snake.x === snake2.tail[i].x && snake.y === snake2.tail[i].y) {
                    snake.dead = true;
                }
            }
            
            /*if(snake.x < 0 || snake.y < 0 || snake.y === canvas.height || snake.x === canvas.width) {
                snake.dead = true;
            }*/
            if(snake.x < 0) {
                snake.x = 500;
            } else if(snake.y < 0) {
                snake.y = 500;
            } else if(snake.x > 480) {
                snake.x = 0;
            } else if(snake.y > 480) {
                snake.y = 0;
            }
        },
    };
    
    /* var snake2 = {
        x: canvas.width- 60,
        y: canvas.height - 60,
        vx: -1,
        vy: 0,
        height: 20,
        width: 20,
        length: 2,
        tail: [],
        dead: false,
        move: function() {
            snake2.x += snake2.vx * scl;
            snake2.y += snake2.vy * scl;
        },
        draw: function() {
            c.fillStyle = "#bb8833";
            
            c.fillRect(snake2.x, snake2.y, scl, scl);
            
            for(var i = 0; i < snake2.tail.length; i++) {
                c.fillStyle = "#aa6633";
                c.fillRect(snake2.tail[i].x, snake2.tail[i].y, scl, scl);
            }
        },
        grow: function () {
            if(snake2.tail.length <= snake2.length) {
                snake2.tail.push({x: snake2.x, y: snake2.y, life: snake2.length-1});
            }
            
            for(var i = 0; i < snake2.tail.length; i++) {
                
                if(snake2.tail[i].life === 0) {
                    snake2.tail.splice(i, 1);
                }
                
                snake2.tail[i].life -= 1;
            }
        },
        collision: function() {
            for(var i = 0; i < food.foods.length; i++) {
                if(snake2.x === food.foods[i].x && snake2.y === food.foods[i].y) {
                    snake2.length += 100;
                    food.foods.splice(i, 1);
                    food.create();
                }
            }
            
            for(i = 0; i < snake2.tail.length; i++) {
                if(snake2.x === snake2.tail[i].x && snake2.y === snake2.tail[i].y) {
                    snake2.dead = true;
                }
            }
            
            for(i = 0; i < snake.tail.length; i++) {
                if(snake2.x === snake.tail[i].x && snake2.y === snake.tail[i].y) {
                    snake2.dead = true;
                }
            }
            
            if(snake2.x < 0 || snake2.y < 0 || snake2.y === canvas.height || snake2.x === canvas.width) {
                snake2.dead = true;
            }
            if(snake2.x < 0) {
                snake2.x = 500;
            } else if(snake2.y < 0) {
                snake2.y = 500;
            } else if(snake2.x > 480) {
                snake2.x = 0;
            } else if(snake2.y > 480) {
                snake2.y = 0;
            }
        },
    };
    */
    
    var AI = {
        x: canvas.width - 60,
        y: canvas.height - 60,
        vx: -1,
        vy: 0,
        height: 20,
        width: 20,
        length: 3,
        tail: [],
        dead: false,
        move: function() {
            AI.gotofood();
            AI.sense();
            
            AI.x += AI.vx * scl;
            AI.y += AI.vy * scl;
        },
        draw: function() {
            c.fillStyle = "#bb8833";
            
            c.fillRect(AI.x, AI.y, scl, scl);
            
            for(var i = 0; i < AI.tail.length; i++) {
                c.fillStyle = "#aa6633";
                c.fillRect(AI.tail[i].x, AI.tail[i].y, scl, scl);
            }
        },
        grow: function () {
            if(AI.tail.length <= AI.length) {
                AI.tail.push({x: AI.x, y: AI.y, life: AI.length-1});
            }
            
            for(var i = 0; i < AI.tail.length; i++) {
                
                if(AI.tail[i].life === 0) {
                    AI.tail.splice(i, 1);
                }
                
                AI.tail[i].life -= 1;
            }
        },
        collision: function() {
            for(var i = 0; i < food.foods.length; i++) {
                if(AI.x === food.foods[i].x && AI.y === food.foods[i].y) {
                    AI.length += 1;
                    food.foods.splice(i, 1);
                    food.create();
                }
            }
            
            for(i = 0; i < AI.tail.length; i++) {
                if(AI.x === AI.tail[i].x && AI.y === AI.tail[i].y) {
                    AI.dead = true;
                }
            }
            
            for(i = 0; i < snake.tail.length; i++) {
                if(AI.x === snake.tail[i].x && AI.y === snake.tail[i].y) {
                    AI.dead = true;
                }
            }
            
            if(AI.x < 0 || AI.y < 0 || AI.y === canvas.height || AI.x === canvas.width) {
                AI.dead = true;
            }
        },
        gotofood: function() {
            var distancetofood = 100000;
            for(var i = 0; i < food.foods.length; i++) {
                if(Math.abs(food.foods[i].x - this.x) + Math.abs(food.foods[i].y - this.y) < distancetofood) {
                    distancetofood = Math.abs(food.foods[i].x - this.x) + Math.abs(food.foods[i].y - this.y);
                }
            }
        },
        sense: function () {
            
            for(var i = 0; i < snake.tail.length; i++) {
                if(AI.x + (AI.vx * scl) === snake.tail[i].x && AI.y === snake.tail[i].y) {
                    AI.vx = 0;
                    AI.vy = Math.floor(Math.random()*2);
                    
                    if(AI.vy === 0) {
                        AI.vy = 1;
                    }
                    
                    if(AI.y + (AI.vy * scl) < 0 || AI.y + (AI.vy * scl) === 500) {
                        AI.vy *= -1;
                    }
                    
                    for(var j = 0; j < snake.tail.length; j++) {
                        if(AI.y + scl === snake.tail[j].y && AI.x === snake.tail[j].x) {
                            AI.vy = -1;
                        }
                    }
                    
                    if(AI.vy === 0) {
                        for(j = 0; j < snake.tail.length; j++) {
                            if(AI.y - scl === snake.tail[j].y && AI.x === snake.tail[j].x) {
                                AI.vy = 1;
                            }
                        }
                    }
                }
                
                if(AI.y + (AI.vy * scl) === snake.tail[i].y && AI.x === snake.tail[i].x) {
                    AI.vy = 0;
                    AI.vx = Math.floor(Math.random()*2);
                    
                    if(AI.vx === 0) {
                        AI.vx = 1;
                    }
                    
                    if(AI.x + (AI.vx * scl) < 0 || AI.x + (AI.vx * scl) === 500) {
                        AI.vx *= -1;
                    }
                    
                    for(j = 0; j < snake.tail.length; j++) {
                        if(AI.x + scl === snake.tail[j].x && AI.y === snake.tail[j].y) {
                            AI.vx = -1;
                        }
                    }
                    
                    if(AI.vy === 0) {
                        for(j = 0; j < snake.tail.length; j++) {
                            if(AI.x - scl === snake.tail[j].x && AI.y === snake.tail[j].y) {
                                AI.vx = 1;
                            }
                        }
                    }
                }
            }
            
            if(AI.x + (AI.vx * scl) < 0 || AI.x + (AI.vx * scl) === 500) {
                AI.vx = 0;
                AI.vy = Math.floor(Math.random() * 2);
                if(AI.vy === 0) {
                    AI.vy -= 1;
                }
                if(AI.y + (AI.vy * scl) < 0 || AI.y + (AI.vy * scl) === 500) {
                    AI.vy *= -1;
                }
            }
            
            if(AI.y + (AI.vy * scl) < 0 || AI.y + (AI.vy * scl) === 500 ) {
                AI.vy = 0;
                AI.vx = Math.floor(Math.random() * 2);
                if(AI.vx === 0) {
                    AI.vx -= 1;
                }
                if(AI.x + (AI.vx * scl) < 0 || AI.x + (AI.vx * scl) === 500) {
                    AI.vx *= -1;
                }
            }
            
        }
    };
    
    
    
    
    document.addEventListener("keydown", function(e) {
        switch (e.keyCode) {
            case 37:
                if(snake.vx !== 1) {
                    snake.vx = -1;
                }
                snake.vy = 0;
                break;
                
            case 38:
                snake.vx = 0;
                if(snake.vy !== 1) {
                    snake.vy = -1;
                }
                break;
                
            case 39:
                if(snake.vx !== -1) {
                    snake.vx = 1;
                }
                snake.vy = 0;
                break;
                
            case 40:
                snake.vx = 0;
                if(snake.vy !== -1) {
                    snake.vy = 1;
                }
                break;
            
            default:
        }
    });
    
    document.addEventListener("keydown", function(e) {
        switch (e.keyCode) {
            case 65:
                if(snake2.vx !== 1) {
                    snake2.vx = -1;
                }
                snake2.vy = 0;
                break;
                
            case 87:
                snake2.vx = 0;
                if(snake2.vy !== 1) {
                    snake2.vy = -1;
                }
                break;
                
            case 68:
                if(snake2.vx !== -1) {
                    snake2.vx = 1;
                }
                snake2.vy = 0;
                break;
                
            case 83:
                snake2.vx = 0;
                if(snake2.vy !== -1) {
                    snake2.vy = 1;
                }
                break;
            
            default:
        }
    });
    
    function draw() {
        c.fillStyle = "#555";
        c.fillRect(0, 0, canvas.width, canvas.height);
        
        snake.draw();
        snake2.draw();
        food.draw();
        //AI.draw();
    }
    
    setInterval(function() {
        draw();
        if(snake.dead === false) {
            snake.collision();
            snake.grow();
            snake.move();
            
        }
        //if(snake2.dead === false) {
        //    snake2.collision();
        //    snake2.grow();
        //    snake2.move();
        //}
        
        if(AI.dead === false) {
            AI.collision();
            AI.grow();
            AI.move();
        }
    }, time);
};