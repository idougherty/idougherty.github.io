let canvas = document.getElementById("canvas");
let c = canvas.getContext("2d");

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

window.onresize = resizeCanvas;
resizeCanvas();

let e = new Environment();
let camera = new Camera(-7, -2, 0, 0, Math.PI/2);
e.setup();

setInterval(function() {
	c.clearRect(0, 0, canvas.width, canvas.height);
	c.fillStyle = "black";
	c.fillRect(0, 0, canvas.width, canvas.height);

	camera.move();
	camera.renderEnvironment(e);
}, 20);

document.addEventListener("keydown", function(e) {
	switch(e.keyCode) {
		case 37:
			camera.keydown.left = true;
			break;
		case 38:
			camera.keydown.up = true;
			break;
		case 39:
			camera.keydown.right = true;
			break;
		case 40:
			camera.keydown.down = true;
			break;
		case 65:
			camera.keydown.a = true;
			break;
		case 87:
			camera.keydown.w = true;
			break;
		case 68:
			camera.keydown.d = true;
			break;
		case 83:
			camera.keydown.s = true;
			break;
		case 32:
			camera.keydown.space = true;
			break;
		case 16:
			camera.keydown.shift = true;
			break;
		default:
	}
});

document.addEventListener("keyup", function(e) {
	switch(e.keyCode) {
		case 37:
			camera.keydown.left = false;
			break;
		case 38:
			camera.keydown.up = false;
			break;
		case 39:
			camera.keydown.right = false;
			break;
		case 40:
			camera.keydown.down = false;
			break;
		case 65:
			camera.keydown.a = false;
			break;
		case 87:
			camera.keydown.w = false;
			break;
		case 68:
			camera.keydown.d = false;
			break;
		case 83:
			camera.keydown.s = false;
			break;
		case 32:
			camera.keydown.space = false;
			break;
		case 16:
			camera.keydown.shift = false;
			break;
		default:
	}
});

document.addEventListener("mousemove", function(e) {
	if(camera.mouse.down) {
		camera.pitch -= (e.movementY)/400;
		camera.yaw += (e.movementX)/400;
	}
});

document.addEventListener("mousedown", function(e) {
	canvas.requestPointerLock()
	camera.mouse.down = true;
});

document.addEventListener("mouseup", function(e) {
	document.exitPointerLock();
	camera.mouse.down = false;
});