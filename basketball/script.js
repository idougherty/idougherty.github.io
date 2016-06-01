window.onload = function() {
    var canvas = document.getElementById("paper");
    var c = canvas.getContext("2d");
    
    var pane = "startscreen";
    var gravity = 0.4;
    
    var basket1 = {
        x: 20,
        y: 150,
        width: 80,
        height: 20,
        draw: function () {
            c.drawImage(document.getElementById("net"), basket1.x, basket1.y, 80, 80);
        },
        collision: function () {
            if((this.x + this.width > ball.x && this.x < ball.x + ball.width && this.y + this.height > ball.y && this.y < ball.y + ball.height) && (ball.vy > 0 || ball.possession === "player2")) {
                
                ball.reset();
                player1.reset();
                player2.reset();
                ball.possession = "player1";
                
                player2.score += 1;
            }
        }
    };
    
    var basket2 = {
        x: canvas.width - 100,
        y: 150,
        width: 80,
        height: 20,
        draw: function () {
            c.drawImage(document.getElementById("net"), basket2.x, basket2.y, 80, 80);
        },
        collision: function () {
            if((this.x + this.width > ball.x && this.x < ball.x + ball.width && this.y + this.height > ball.y && this.y < ball.y + ball.height) && (ball.vy > 0 || ball.possession === "player1")) {
                
                ball.reset();
                player1.reset();
                player2.reset();
                ball.possession = "player2";
                
                player1.score += 1;
            }
        }
    };
    
    var ball = {
        x: canvas.width/2 - 10,
        y: 300,
        vx: 0,
        vy: -5,
        width: 20,
        height: 20,
        possession: "nope",
        draw: function () {
            c.fillStyle = "rgba(250, 130, 55, 1)";
            
            if(ball.y + ball.width < 0) {
                c.beginPath();
                c.moveTo(ball.x + ball.width/2, 15);
                c.lineTo(ball.x, 35);
                c.lineTo(ball.x + ball.width, 35);
                c.lineTo(ball.x + ball.width/2, 15);
                c.lineTo(ball.x, 35);
                
                c.fillStyle = "#ee3";
                c.strokeStyle = "#777";
                c.lineWidth = 10;
                c.stroke();
                c.fill();
            }
            
            c.fillRect(this.x, this.y, this.width, this.height);
        },
        reset: function () {
            this.vx = 0;
            this.vy = -5;
            this.width = 20;
            this.height = 20;
            this.possession = "nope";
        },
        gravity: function () {
            ball.y += ball.vy;
            
            ball.x += ball.vx;
            ball.vx *= 0.98;
        },
        collision: function () {
            if(ball.y + ball.height > canvas.height - 20) {
                ball.vy *= -2/3;
                ball.vx *= 1/2;
                ball.y = canvas.height - ball.height - 20;
            }
            
            ball.vy += 0.7;//gravity;
            
            if(ball.x < 20) {
                ball.vx *= -2/3;
                ball.x = 20;
            }
            
            if(ball.x + ball.width > canvas.width - 20) {
                ball.vx *= -2/3;
                ball.x = canvas.width - ball.width - 20;
            }
        },
    };
    
    var player1 = {
        x: 40,
        y: canvas.height - 100,
        height: 70,
        width: 35,
        vx: 0,
        vy: 0,
        charge: 0,
        onground: true,
        possessionable: true,
        score: 0,
        keydown: {
            w: false,
            a: false,
            s: false,
            d: false,
        },
        keytoggle: {
            w: null,
            a: null,
            s: null,
            d: null,
        },
        reset: function () {
            this.x = 40;
            this.y = canvas.height - 100;
            this.height = 70;
            this.width = 35;
            this.vx = 0;
            this.vy = 0;
            this.charge = 0;
            this.onground = true;
            this.possessionable = true;
        },
        draw: function () {
            c.fillStyle = "rgba(50, 255, 255, 1)";
            
            c.fillRect(this.x, this.y, this.width, this.height);
        },
        collision: function () {
            if(player1.y + player1.height > canvas.height - 20) {
                player1.vy = 0;
                player1.y = canvas.height - player1.height - 20;
                player1.onground = true;
            }
            
            if(player1.x < 20) {
                player1.vx = 0;
                player1.x = 20;
            }
            
            if(player1.x + player2.width > canvas.width - 20) {
                player1.vx = 0;
                player1.x = canvas.width - 20 - player1.width;
            }
            
            if(this.x + this.width > ball.x && this.x < ball.x + ball.width && this.y + this.height > ball.y && this.y < ball.y + ball.height && this.possessionable) {
                
                if(ball.possession === "player2") {
                    player2.possessionable = false;
                    player2.charge = 0;
                    setTimeout(function () {player2.possessionable = true;}, 1000);
                }
                
                ball.possession = "player1";
            }
        },
        gravity: function () {
            player1.y += player1.vy;
            player1.vy += gravity;
            
            player1.x += player1.vx;
            player1.vx *= 0.7;
        },
        possession: function () {
            ball.x = player1.x;
            ball.y = player1.y + 30;
            
            if(player1.vx > 0) {
                ball.x += 20;
            } else {
                ball.x += -5;
            }
        },
        shoot: function () {
            ball.possession = "nope";
            ball.vx = player1.charge - 2;
            ball.vy = (-1/2 * player1.charge) - 18;
            player1.possessionable = false;
            
            setTimeout(function () {player1.possessionable = true}, 1000);
            
            if(player1.vx < 0) {
                ball.vx *= -1;
            }
             
            ball.vx += player1.vx/3;
        },
    };
    
    
    var player2 = {
        x: canvas.width - 75,
        y: canvas.height - 100,
        height: 70,
        width: 35,
        vx: 0,
        vy: 0,
        charge: 0,
        onground: true,
        possessionable: true,
        score: 0,
        keydown: {
            up: false,
            left: false,
            down: false,
            right: false,
        },
        keytoggle: {
            up: null,
            left: null,
            down: null,
            right: null,
        },
        reset: function () {
            this.x = canvas.width - 75;
            this.y = canvas.height - 100;
            this.height = 70;
            this.width = 35;
            this.vx = 0;
            this.vy = 0;
            this.charge = 0;
            this.onground = true;
            this.possessionable = true;
        },
        draw: function () {
            c.fillStyle = "rgba(255, 50, 50, 1)";
            
            c.fillRect(this.x, this.y, this.width, this.height);
        },
        collision: function () {
            if(player2.y + player2.height > canvas.height - 20) {
                player2.vy = 0;
                player2.y = canvas.height - player2.height - 20;
                player2.onground = true;
            }
            
            if(player2.x < 20) {
                player2.vx = 0;
                player2.x = 20;
            }
            
            if(player2.x + player2.width > canvas.width - 20) {
                player2.vx = 0;
                player2.x = canvas.width - 20 - player2.width;
            }
            
            if(this.x + this.width > ball.x && this.x < ball.x + ball.width && this.y + this.height > ball.y && this.y < ball.y + ball.height && this.possessionable) {
                
                if(ball.possession === "player1") {
                    player1.possessionable = false;
                    player1.charge = 0;
                    setTimeout(function () {player1.possessionable = true;}, 1000);
                }
                
                ball.possession = "player2";
            }
        },
        gravity: function () {
            player2.y += player2.vy;
            player2.vy += gravity;
            
            player2.x += player2.vx;
            player2.vx *= 0.7;
        },
        possession: function () {
            ball.x = player2.x;
            ball.y = player2.y + 30;
            
            if(player2.vx > 0) {
                ball.x += 20;
            } else {
                ball.x += -5;
            }
        },
        shoot: function () {
            ball.possession = "nope";
            ball.vx = player2.charge - 2;
            ball.vy = (-1/2 * player2.charge) - 18;
            player2.possessionable = false;
            
            setTimeout(function () {player2.possessionable = true}, 1000);
            
            if(player2.vx < 0) {
                ball.vx *= -1;
            }
             
            ball.vx += player2.vx/3;
        },
    };
    
    document.addEventListener("keydown", function(e) {
        switch (e.keyCode) {
            case 87:
                if(player1.keydown.w === false) {
                    player1.keydown.w = true;
                    
                    player1.keytoggle.w = setInterval(function() {
                        if(player1.onground === true) {
                            player1.onground = false;
                            player1.vy = -17;
                        }
                    }, 30);
                }
                break;
                
            case 65:
                if(player1.keydown.a === false) {
                    player1.keydown.a = true;
                    
                    player1.keytoggle.a = setInterval(function() {
                        if(player1.x > 20) {
                            player1.vx = -10;
                        } else {
                            player1.vx = 0;
                        }
                    }, 30);
                }
                break;
                
            case 32:
                if(player1.keydown.s === false && ball.possession === "player1") {
                    player1.keydown.s = true;
                    player1.charge = 5;
                    
                    player1.keytoggle.s = setInterval(function() {
                        if(player1.charge < 17 && ball.possession === "player1") {
                            player1.charge += 0.3;
                        }
                    }, 30);
                }
                break;
                
            case 68:
                if(player1.keydown.d === false) {
                    player1.keydown.d = true;
                    
                    player1.keytoggle.d = setInterval(function() {
                        if(player1.x + player1.width < canvas.width - 20) {
                            player1.vx = 10;
                        } else {
                            player1.vx = 0;
                        }
                    }, 30);
                }
                break;
            
            case 38:
                if(player2.keydown.up === false) {
                    player2.keydown.up = true;
                    
                    player2.keytoggle.up = setInterval(function() {
                        if(player2.onground === true) {
                            player2.onground = false;
                            player2.vy = -17;
                        }
                    }, 30);
                }
                break;
                
            case 37:
                if(player2.keydown.left === false) {
                    player2.keydown.left = true;
                    
                    player2.keytoggle.left = setInterval(function() {
                        if(player2.x > 20) {
                            player2.vx = -10;
                        } else {
                            player2.vx = 0;
                        }
                    }, 30);
                }
                break;
                
            case 16:
                if(player2.keydown.down === false && ball.possession === "player2") {
                    player2.keydown.down = true;
                    player2.charge = 5;
                    
                    player2.keytoggle.down = setInterval(function() {
                        if(player2.charge < 17 && ball.possession === "player2") {
                            player2.charge += 0.3;
                        }
                    }, 30);
                }
                break;
                
            case 39:
                if(player2.keydown.right === false) {
                    player2.keydown.right = true;
                    
                    player2.keytoggle.right = setInterval(function() {
                        if(player2.x + player2.width < canvas.width - 20) {
                            player2.vx = 10;
                        } else {
                            player2.vx = 0;
                        }
                    }, 30);
                }
                break;
            
            default:
            
        }
    });
    
    document.addEventListener("keyup", function(e) {
        switch (e.keyCode) {
            case 87:
                clearInterval(player1.keytoggle.w);
                player1.keydown.w = false;
                player1.keytoggle.w = null;
                break;
                
            case 65:
                clearInterval(player1.keytoggle.a);
                player1.keydown.a = false;
                player1.keytoggle.a = null;
                break;
                
            case 32:
                if(player1.keytoggle.s !== null) {
                    player1.shoot();
                    player1.charge = 0;
                }
                
                clearInterval(player1.keytoggle.s);
                player1.keydown.s = false;
                player1.keytoggle.s = null;
                break;
                
            case 68:
                clearInterval(player1.keytoggle.d);
                player1.keydown.d = false;
                player1.keytoggle.d = null;
                break;
            
            case 38:
                clearInterval(player2.keytoggle.up);
                player2.keydown.up = false;
                player2.keytoggle.up = null;
                break;
                
            case 37:
                clearInterval(player2.keytoggle.left);
                player2.keydown.left = false;
                player2.keytoggle.left = null;
                break;
                
            case 16:
                if(player2.keytoggle.down !== null) {
                    player2.shoot();
                    player2.charge = 0;
                }
                
                clearInterval(player2.keytoggle.down);
                player2.keydown.down = false;
                player2.keytoggle.down = null;
                break;
                
            case 39:
                clearInterval(player2.keytoggle.right);
                player2.keydown.right = false;
                player2.keytoggle.right = null;
                break;
            
            default:
            
        }
    });
    
    function drawGame() {
        c.fillStyle = "rgba(255, 255, 255, 1)";
        c.fillRect(0, 0, canvas.width, canvas.height);
        
        c.font = "300px Impact";
        c.fillStyle = "#ddd";
        c.textAlign = "center";
        c.fillText(player1.score, 300, 360);
        c.fillText(player2.score, canvas.width - 300, 360);
        
        c.fillStyle = "#";
        c.fillRect(0, canvas.height - 20, canvas.width, 20);
        
        c.fillStyle = "#ddd";
        c.fillRect(0, 0, 20, canvas.height);
        c.fillRect(canvas.width - 20, 0, 20, canvas.height);
        
        player1.draw();
        c.fillStyle = "rgba(25, 125, 175, 1)";
        c.fillRect(player1.x + 10, player1.y + 10, player1.width - 20, player1.charge * 3);
        player2.draw();
        c.fillStyle = "rgba(175, 25, 25, 1)";
        c.fillRect(player2.x + 10, player2.y + 10, player2.width - 20, player2.charge * 3);
        
        ball.draw();
        basket1.draw();
        basket2.draw();
        
    }
    
    function runGame() {
        drawGame();
        
        player1.gravity();
        player1.collision();
        player2.gravity();
        player2.collision();
         
        if(ball.possession === "player1") {
            player1.possession();
            ball.vy = 0;
        } else if(ball.possession === "player2") {
            player2.possession();
            ball.vy = 0;
        } else {
            ball.gravity();
            ball.collision();
        }
        
        basket1.collision();
        basket2.collision();
    }
    
    function start() {
        document.getElementById("startBTN").style.visibility = "hidden";
        document.getElementById("instructionsBTN").style.visibility = "hidden";
        document.getElementById("optionsBTN").style.visibility = "hidden";
        
        pane = "game";
        player1.reset();
        player2.reset();
        ball.reset();
    }
    
    function instructions() {
        gravity = 1;
    }
    
    function options() {
        gravity = 0.4;
    }
    
    document.getElementById("startBTN").onclick = function () {
        document.getElementById("startBTN").style.visibility = "hidden";
        document.getElementById("instructionsBTN").style.visibility = "hidden";
        document.getElementById("optionsBTN").style.visibility = "hidden";
        
        pane = "game";
        player1.reset();
        player2.reset();
        ball.reset();
    };
    
    document.getElementById("instructionsBTN").onclick = function () {
        pane = "instructions";
    };
    
    document.getElementById("instructionsBTN").onclick = function () {
        pane = "options";
    };
    
    setInterval(function() {
        
        switch (pane) {
            case 'game':
                runGame();
                break;
            
            case 'startscreen':
                start();
                break;
                
            case 'instructions':
                instructions();
                break;
                
            case 'options':
                options();
                break;
            default:
        }
        
    }, 30);
};