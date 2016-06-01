var run;

var ball = {
    x: 1000/2 - 10,
    y: 300,
    vx: 0,
    vy: -5,
    width: 20,
    height: 20,
    possession: "nope",
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
        if(ball.y + ball.height > 500 - 20) {
            ball.vy *= -2/3;
            ball.vx *= 1/2;
            ball.y = 500 - ball.height - 20;
        }
        
        ball.vy += 0.7;
        
        if(ball.x < 20) {
            ball.vx *= -2/3;
            ball.x = 20;
        }
        
        if(ball.x + ball.width > 1000 - 20) {
            ball.vx *= -2/3;
            ball.x = 1000 - ball.width - 20;
        }
    },
};

var player1 = {
    x: 40,
    y: 500 - 100,
    height: 70,
    width: 35,
    vx: 0,
    vy: 0,
    color: "rgba(255, 50, 50, 1)",
    charge: 0,
    onground: true,
    possessionable: true,
    score: 0,
    connected: false,
    to: false,
    keydown: {
        w: false,
        a: false,
        s: false,
        d: false,
    },
    moveLeft: function () {
        if(player1.x > 20) {
            player1.vx = -10;
        } else {
            player1.vx = 0;
        }
    },
    moveRight: function () {
        if(player1.x + player1.width < 1000 - 20) {
            player1.vx = 10;
        } else {
            player1.vx = 0;
        }
    },
    charging: function () {
        if(player1.charge < 17 && ball.possession === "player1") {
            player1.charge += 0.3;
        }
    },
    jump: function () {
        if(player1.onground === true) {
            player1.onground = false;
            player1.vy = -17;
        }
    },
    reset: function () {
        this.x = 40;
        this.y = 500 - 100;
        this.height = 70;
        this.width = 35;
        this.vx = 0;
        this.vy = 0;
        this.charge = 0;
        this.onground = true;
        this.possessionable = true;
    },
    collision: function () {
        if(player1.y + player1.height > 500 - 20) {
            player1.vy = 0;
            player1.y = 500 - player1.height - 20;
            player1.onground = true;
        }
        
        if(player1.x < 20) {
            player1.vx = 0;
            player1.x = 20;
        }
        
        if(player1.x + player2.width > 1000 - 20) {
            player1.vx = 0;
            player1.x = 1000 - 20 - player1.width;
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
        player1.vy += 0.4;
        
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
        
        setTimeout(function () {player1.possessionable = true;}, 1000);
        
        if(player1.vx < 0) {
            ball.vx *= -1;
        }
         
        ball.vx += player1.vx/3;
    },
};


var player2 = {
    x: 1000 - 75,
    y: 500 - 100,
    height: 70,
    width: 35,
    vx: 0,
    vy: 0,
    charge: 0,
    onground: true,
    possessionable: true,
    connected: false,
    to: false,
    score: 0,
    color: "rgba(50, 255, 255, 1)",
    keydown: {
        w: false,
        a: false,
        s: false,
        d: false,
    },
    moveLeft: function () {
        if(player2.x > 20) {
            player2.vx = -10;
        } else {
            player2.vx = 0;
        }
    },
    moveRight: function () {
        if(player2.x + player2.width < 1000 - 20) {
            player2.vx = 10;
        } else {
            player2.vx = 0;
        }
    },
    charging: function () {
        if(player2.charge < 17 && ball.possession === "player2") {
            player2.charge += 0.3;
        }
    },
    jump: function () {
        if(player2.onground === true) {
            player2.onground = false;
            player2.vy = -17;
        }
    },
    reset: function () {
        this.x = 1000 - 75;
        this.y = 500 - 100;
        this.height = 70;
        this.width = 35;
        this.vx = 0;
        this.vy = 0;
        this.charge = 0;
        this.onground = true;
        this.possessionable = true;
    },
    collision: function () {
        if(player2.y + player2.height > 500 - 20) {
            player2.vy = 0;
            player2.y = 500 - player2.height - 20;
            player2.onground = true;
        }
        
        if(player2.x < 20) {
            player2.vx = 0;
            player2.x = 20;
        }
        
        if(player2.x + player2.width > 1000 - 20) {
            player2.vx = 0;
            player2.x = 1000 - 20 - player2.width;
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
        player2.vy += 0.4;
        
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
        
        setTimeout(function () {player2.possessionable = true;}, 1000);
        
        if(player2.vx < 0) {
            ball.vx *= -1;
        }
         
        ball.vx += player2.vx/3;
    },
};

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require("socket.io").listen(server),
    connections = [];
    
server.listen(process.env.PORT || 3000);
console.log("Server started up!");

app.get('/', function(req,res){
   res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection',function(socket){
    connections.push(socket);
    console.log("Connected: %s sockets connected", connections.length);
    
    if(connections.length === 1) {
        run = setInterval(runGame, 30);
        var playerType = "player1";
        player1.connected = true;
        player1.to = socket.id;
        player1.possessionable = true;
    } else if(connections.length === 2) {
        if(player2.connected === false) {
            var playerType = "player2";
            player2.connected = true;
            player2.to = socket.id;
            player2.possessionable = true;
        } else if(player1.connected === false) {
            var playerType = "player1";
            player1.connected = true;
            player1.to = socket.id;player1.possessionable = true;
        } else {
            var playerType = "spectator";
        }
    } else if (connections.length > 2) {
        var playerType = "spectator";
    }
    
    io.sockets.emit('player connected', playerType);
    
    socket.on('disconnect', function(data){
        connections.splice(connections.indexOf(socket), 1);
        console.log("Disconnected: %s sockets connected", connections.length);
        
        if(player1.to === socket.id) {
            player1.connected = false;
        }
        
        if(player2.to === socket.id) {
            player2.connected = false;
        }
        
        if(connections.length === 0) {
            player1.score = 0;
            player2.score = 0;
            clearInterval(run);
            player1.connected = false;
            player2.connected = false;
            player1.to = false;
            player2.to = false;
            ball.reset();
            player1.reset();
            player2.reset();
        }
    });
    
    socket.on("keydown specator", function(data) {
        ball.vx = Math.random() * 10 - 5;
        ball.vy = Math.random() * -20;
    });
    
    socket.on('keydown player1', function(data) {
        switch (data) {
            case 87:
                if(player1.keydown.w === false) {
                    player1.keydown.w = true;
                }
                break;
                
            case 65:
                if(player1.keydown.a === false) {
                    player1.keydown.a = true;
                }
                break;
                
            case 32:
                if(player1.keydown.s === false && ball.possession === "player1") {
                    player1.keydown.s = true;
                    player1.charge = 5;
                }
                break;
                
            case 68:
                if(player1.keydown.d === false) {
                    player1.keydown.d = true;
                }
                break;
            
            default:
        }
    });
    
    socket.on('keydown player2', function(data) {
        switch(data) {
            case 87:
                if(player2.keydown.w === false) {
                    player2.keydown.w = true;
                }
                break;
                
            case 65:
                if(player2.keydown.a === false) {
                    player2.keydown.a = true;
                }
                break;
                
            case 32:
                if(player2.keydown.s === false && ball.possession === "player2") {
                    player2.keydown.s = true;
                    player2.charge = 5;
                }
                break;
                
            case 68:
                if(player2.keydown.d === false) {
                    player2.keydown.d = true;
                }
                break;
            
            default:
        }
    });
    
    socket.on("keyup player1", function(data) {
        switch (data) {
            case 87:
                player1.keydown.w = false;
                break;
                
            case 65:
                player1.keydown.a = false;
                break;
                
            case 32:
                if(ball.possession === "player1") {
                    player1.shoot();
                    player1.charge = 0;
                }
                
                player1.keydown.s = false;
                break;
                
            case 68:
                player1.keydown.d = false;
                break;
            
            default:
                
        }
    });
    
    socket.on("keyup player2", function(data) {
        switch (data) {
            case 87:
                player2.keydown.w = false;
                break;
                
            case 65:
                player2.keydown.a = false;
                break;
                
            case 32:
                if(ball.possession === "player2") {
                    player2.shoot();
                    player2.charge = 0;
                }
                
                player2.keydown.s = false;
                break;
                
            case 68:
                player2.keydown.d = false;
                break;
            
            default:
                
        }
    });
});

var basket1 = {
    x: 20,
    y: 150,
    width: 80,
    height: 20,
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
    x: 1000 - 100,
    y: 150,
    width: 80,
    height: 20,
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

function runGame() {
    
    if(player1.connected === false) {
        player1.color = "#777";
        player1.possessionable = false;
    } else {
        player1.color = "rgba(50, 255, 255, 1)";
    }
    
    if(player2.connected === false) {
        player2.color = "#777";
        player2.possessionable = false;
    } else {
        player2.color = "rgba(255, 50, 50, 1)";
    }
    
    var data = {
        ball: ball,
        player1: player1,
        player2: player2,
    };
    
    
    io.sockets.emit("draw", data);
    
    if(player1.keydown.w) {
        player1.jump();
    }
    
    if(player1.keydown.a) {
        player1.moveLeft();
    }
    
    if(player1.keydown.s) {
        player1.charging();
    }
    
    if(player1.keydown.d) {
        player1.moveRight();
    }
    
    if(player2.keydown.w) {
        player2.jump();
    }
    
    if(player2.keydown.a) {
        player2.moveLeft();
    }
    
    if(player2.keydown.s) {
        player2.charging();
    }
    
    if(player2.keydown.d) {
        player2.moveRight();
    }
    
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