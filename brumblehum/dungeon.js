window.onload = function() {
  var canvas = document.getElementById("paper");
  var c = canvas.getContext("2d");
  var whileKeyDownX = null;
  var runGravity = null;
  var countX = 0;
  var gravity = 0.5;
	var i;
	var willRunInto = 0;
  
  var player = {
    x: 60,
    y: 20,
    height: 20,
    width: 20
  };

  var collisionBoxes = [{x: 50, y: 100, height: 40, width: 40}, {x: 150, y: 100, height: 40, width: 40}, {x: 10, y: 140, height: 40, width: 220}];
  
  function checkCollision() {
    for(var i = 0; i < collisionBoxes.length; i++) {
      if(((player.y + player.height >= collisionBoxes[i].y) && (player.y + player.height <= collisionBoxes[i].y + collisionBoxes[i].height)) && ((player.x + player.width - 2 >= collisionBoxes[i].x) && (player.x + 2 <= collisionBoxes[i].x + collisionBoxes[i].width))) {
        gravity = 0;
    	  player.y = collisionBoxes[i].y - player.height;
      } else {
    	  gravity += 0.1;
      }
    }
  }
  
  function gravityFun() {
  	player.y += gravity;
  	checkCollision();
  }

  runGravity = setInterval(gravityFun, 10);
  
  $(document).keydown(function(e) {
	  switch(e.which) {
  	  case 37:
      	if(countX === 0) {
        	countX = 1;
        	whileKeyDownX = setInterval(function() {
            for(i = 0; i < collisionBoxes.length; i++) {
              if(((player.x - 1 <= collisionBoxes[i].x + collisionBoxes[i].width) && (player.x + player.width <= collisionBoxes[i].x)) && ((player.y + player.height >= collisionBoxes[i].y) && (player.y <= collisionBoxes[i].y + collisionBoxes[i].height))) {
                willRunInto = 1;
              }
            }
            if(willRunInto !== 1) {
              player.x -= 1;
        	  }
        	  willRunInto = 0;
          }, 20);
      	}
        break;
    	case 38:
        if(gravity === 0) {
        	gravity = -6;
        }
        break;
    	case 39:
      	if(countX === 0) {
        	countX = 1;
        	whileKeyDownX = setInterval(function() {
            for(i = 0; i < collisionBoxes.length; i++) {
              if(((player.x + player.width + 1 >= collisionBoxes[i].x) && (player.x <= collisionBoxes[i].x + collisionBoxes[i].width)) && ((player.y + player.height - 1 >= collisionBoxes[i].y) && (player.y <= collisionBoxes[i].y + collisionBoxes[i].height))) {
        	      willRunInto = 1;
        	    }
            }
            if(willRunInto !== 1) {
              player.x += 1;
            }
            willRunInto = 0;
        	}, 20);
        }
        break;
      default:
	  }
  });

  $(document).keyup(function(e) {
	  if(e.which == 37 || e.which == 39) {
      countX = 0;
  	  clearInterval(whileKeyDownX);
    }
  });
  
  setInterval(function() {
    c.fillStyle = "rgba(255, 255, 255, 0.3)";
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "#aa00aa";
    for(i = 0; i < collisionBoxes.length; i++) {
      c.fillRect(collisionBoxes[i].x, collisionBoxes[i].y, collisionBoxes[i].width, collisionBoxes[i].height);
    }
    
    c.fillStyle = "#00aaaa";
    c.fillRect(player.x, player.y, player.width, player.height);
  }, 30);
};
//player still link: http://makepixelart.com/peoplepods/files/images/2100034.original.png