var whileKeyDownX = null;
var whileKeyDownY = null;
var runGravity = null;
var countX = 0;
var countY = 0;
var gravity = 0.5;

var player = {
  x: 60,
  y: 10,
  height: 20,
  width: 20
};

var box = {
  x: 50,
  y: 200,
  height: 40,
  width: 40
};

var box2 = {
  x: 150,
  y: 200,
  height: 40,
  width: 40
};

var box3 = {
  x: 10,
  y: 240,
  height: 40,
  width: 220
};

function gravityFun() {
	player.y += gravity;
  $("#player").css({top: "+=" + gravity});
  if(((player.y + player.height >= box.y) && (player.y + player.height <= box.y + box.height)) && ((player.x + player.width >= box.x) && (player.x <= box.x + box.width))) {
  	gravity = 0;
  	$("#player").css({top: box.y - player.height});
  	player.y = box.y - player.height;
  } else if(((player.y + player.height >= box2.y) && (player.y + player.height <= box2.y + box2.height)) && ((player.x + player.width >= box2.x) && (player.x <= box2.x + box2.width))) {
    gravity = 0;
  	$("#player").css({top: box2.y - player.height});
  	player.y = box2.y - player.height;
  } else if(((player.y + player.height >= box3.y) && (player.y + player.height <= box3.y + box3.height)) && ((player.x + player.width >= box3.x) && (player.x <= box3.x + box3.width))) {
    gravity = 0;
  	$("#player").css({top: box3.y - player.height});
  	player.y = box3.y - player.height;
  } else {
  	gravity += 0.1;
  }
}

runGravity = setInterval(gravityFun, 10);

$(document).keydown(function(e) {
	switch(e.which) {
  	case 37:
    	if(countX === 0) {
      	countX = 1;
      	whileKeyDownX = setInterval(function() {
      	    if(((player.x - 1 <= box.x + box.width) && (player.x + player.width >= box.x)) && ((player.y + player.height - 1 >= box.y) && (player.y <= box.y + box.height)) || ((player.x - 1 <= box2.x + box2.width) && (player.x + player.width >= box2.x)) && ((player.y + player.height - 1 >= box2.y) && (player.y <= box2.y + box2.height)) || ((player.x - 1 <= box3.x + box3.width) && (player.x + player.width >= box3.x)) && ((player.y + player.height - 1 >= box3.y) && (player.y <= box3.y + box3.height))) {
      	    } else {
      	        $("#player").css({left: "-=1"});
                player.x -= 1;
      	    }
        }, 8);
      }
      break;
  	case 38:
      if(gravity === 0) {
      	gravity = -4;
      }
      break;
  	case 39:
    	if(countX === 0) {
      	countX = 1;
      	whileKeyDownX = setInterval(function() {
      	    if(((player.x + player.width + 1 >= box.x) && (player.x <= box.x + box.width)) && ((player.y + player.height - 1 >= box.y) && (player.y <= box.y + box.height)) || ((player.x + player.width + 1 >= box2.x) && (player.x <= box2.x + box2.width)) && ((player.y + player.height - 1 >= box2.y) && (player.y <= box2.y + box2.height)) || ((player.x + player.width + 1 >= box3.x) && (player.x <= box3.x + box3.width)) && ((player.y + player.height - 1 >= box3.y) && (player.y <= box3.y + box3.height))) {
      	    } else {
      	        $("#player").css({left: "+=1"});
                player.x += 1;
      	    }
        }, 8);
      }
      break;
    default:
  }
});

$(document).keyup(function(e) {
	if(e.which == 37 || e.which == 39) {
  	clearInterval(whileKeyDownX);
    countX = 0;
  } else if(e.which == 38 || e.which == 40) {
  	clearInterval(whileKeyDownY);
    countY = 0;
  }
});