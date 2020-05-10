window.onload = function(){
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    var direction = "right";
    var tail = []; 
    var head = {
        x: 2,
        y: 2
    };
    var food = {
        x: Math.floor(Math.random()*window.innerWidth+1), 
        y: Math.floor(Math.random()*window.innerHeight+1)
    };
    var extensionTimer = 0;
    var i = null;
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(food.x - 5,food.y - 5,11,11);
    setInterval (function(){
        switch (direction) {
            case "up": 
                tail.push({
                    x: head.x,
                    y: head.y
                });
                head.y -= 1;
            break; 
            
            case "down": 
                tail.push({
                    x: head.x,
                    y: head.y
                });
                head.y += 1;
            break;
            
            case "left": 
                tail.push({
                    x: head.x,
                    y: head.y
                });
                head.x -= 1;
            break; 
            
            case "right": 
                tail.push({
                    x: head.x,
                    y: head.y
                });
                head.x += 1;
            break; 
            
            default: 
        }
        if (extensionTimer <= 0) {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(tail[0].x,tail[0].y,1,1);
            tail.splice(0, 1);
        }
        extensionTimer -= 1;
        ctx.fillStyle = "#000000";
        ctx.fillRect(head.x,head.y,1,1);
        for (i = 0; i < tail.length; i++) { 
            if (head.x === tail[i].x && head.y === tail[i].y) {
                alert("Game Over You Suck Lmao");
            }
        }
        if (head.x > window.innerWidth || head)
        if (head.x >= food.x - 5 && head.y >= food.y - 5 && head.x <= food.x + 5 && head.y <= food.y + 5) {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(food.x - 5,food.y - 5,11,11);
            food.x = Math.floor(Math.random()*window.innerWidth+1); 
            food.y = Math.floor(Math.random()*window.innerHeight+1);
            ctx.fillStyle = "#FF0000";
            ctx.fillRect(food.x - 5,food.y - 5,11,11);
            extensionTimer = 20;
        }
        
    }, 10);
    $(document).keydown(function(e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 40) {
                direction = "down";
            } else if (code == 38) {
                direction = "up";
            } else if (code == 37) {
                direction = "left";
            } else if (code == 39) {
                direction = "right";
            }
    });
};