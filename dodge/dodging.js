window.onload = function() {
  var canvas = document.getElementById("paper");
  var c = canvas.getContext("2d");
  var keyDownX;
  var keyDownY;
  var keyAlreadyDownX = 0;
  var keyAlreadyDownY = 0;
  var gapPosTop = Math.floor((Math.random() * canvas.width * 2 / 5) + (canvas.width / 2));
  var gapPosLeft = Math.floor((Math.random() * canvas.height * 2 / 5) + (canvas.height / 2));
  var speed = 1;
  var score = 0;
  
  var player = {
    x: canvas.width / 2 - 10,
    y: canvas.height / 2 - 10,
    width: 20,
    height: 20
    alive: true;
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
		  }
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
		  }
	  }
  };
  
  document.body.addEventListener('keydown', function(e) {
    switch(e.which) {
      case 37:
        if((keyAlreadyDownX === 0)) {
          keyAlreadyDownX = 1;
          keyDownX = setInterval(function() {
			  if(player.x >= 0) {
				player.x -= 4;
			  }
          }, 30);
        }
        break;
      case 38:
        if((keyAlreadyDownY === 0)) {
          keyAlreadyDownY = 1;
          keyDownY = setInterval(function() {
			  if(player.y >= 0) {
				  player.y -= 4;  
			  }
          }, 30);
        }
        break;
      case 39:
        if((keyAlreadyDownX === 0)) {
          keyAlreadyDownX = 1;
          keyDownX = setInterval(function() {
			  if(player.x + player.width <= canvas.width) {
				player.x += 4;
			  }
          }, 30);
        }
        break;
      case 40:
        if((keyAlreadyDownY === 0)) {
          keyAlreadyDownY = 1;
          keyDownY = setInterval(function() {
			  if(player.y + player.width <= canvas.height) {
				  player.y += 4;  
			  }
          }, 30);
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
	
	if(crusher.top.left.y <= canvas.height) {
		crusher.top.left.y += speed;
		crusher.top.right.y += speed;
		crusher.left.top.x += speed;
		crusher.left.bottom.x += speed;
	} else {
		gapPosTop = Math.floor((Math.random() * canvas.width * 2 / 5) + (canvas.width / 2));
		gapPosLeft = Math.floor((Math.random() * canvas.height * 2 / 5) + (canvas.height / 2));
		
		crusher.top.left.width = gapPosTop;
		crusher.top.right.x = gapPosTop + 60;
		crusher.top.right.width = canvas.width - (gapPosTop + 60);
		
		crusher.left.top.height = gapPosLeft;
		crusher.left.bottom.y = gapPosLeft + 60;
		crusher.left.bottom.height = canvas.width - (gapPosLeft + 60);
		
		crusher.top.left.y = 0;
		crusher.top.right.y = 0;
		crusher.left.top.x = 0;
		crusher.left.bottom.x = 0;
		
		if(speed <= 4) {
			speed += 0.5;
		} else if(speed <= 5){
			speed += 0.1;
		}
		
		if(player.alive = true){
		    score++;
		    ctx.font = "15px Arial";
            ctx.fillText("Score: " + score,10,10);
		}
	}
	
	if((player.x + player.width >= crusher.top.left.x) && (player.x <= crusher.top.left.x + crusher.top.left.width) && (player.y + player.width >= crusher.top.left.y) && (player.y <= crusher.top.left.y + crusher.top.left.height)) {
	    alert("alert");
	} else if((player.x + player.width >= crusher.top.right.x) && (player.x <= crusher.top.right.x + crusher.top.right.width) && (player.y + player.width >= crusher.top.right.y) && (player.y <= crusher.top.right.y + crusher.top.right.height)) {
	    alert("alert");
    } else if((player.x + player.width >= crusher.left.top.x) && (player.x <= crusher.left.top.x + crusher.left.top.width) && (player.y + player.width >= crusher.left.top.y) && (player.y <= crusher.left.top.y + crusher.left.top.height)) {
        alert("alert");
    } else if((player.x + player.width >= crusher.left.bottom.x) && (player.x <= crusher.left.bottom.x + crusher.left.bottom.width) && (player.y + player.width >= crusher.left.bottom.y) && (player.y <= crusher.left.bottom.y + crusher.left.bottom.height)) {
        alert("alert");
    }
    
	c.fillStyle = "#ff6666";
	c.fillRect(crusher.top.left.x, crusher.top.left.y, crusher.top.left.width, crusher.top.left.height);
	c.fillRect(crusher.top.right.x, crusher.top.right.y, crusher.top.right.width, crusher.top.right.height);
	c.fillRect(crusher.left.top.x, crusher.left.top.y, crusher.left.top.width, crusher.left.top.height);
	c.fillRect(crusher.left.bottom.x, crusher.left.bottom.y, crusher.left.bottom.width, crusher.left.bottom.height);
	
	if(player.alive === true) {
        c.fillStyle = "#00aaaa";
        c.fillRect(player.x, player.y, player.width, player.height);
	}
  }, 30);
};