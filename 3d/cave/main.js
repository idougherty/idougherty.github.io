let canvas = document.getElementById("paper");
let c = canvas.getContext("2d");

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

window.onresize = resizeCanvas;
resizeCanvas();

let cave = new Cave(100, 27);
let mesh = cave.createMesh();

const scale = .6;

let e = new Environment();
let spawnPos = new Vec3D(cave.start.x * scale, -1, cave.start.y * scale);
// let spawnPos = new Vec3D(0, 0, 0);
let camera = new Camera(spawnPos);

let vec = new Vec3D(.2, 1, -.3);
vec  = Vec3D.normalize(vec);
e.lights.push(new DirectionalLight(vec, {r: 255, g: 255, b: 255}));
e.lights.push(new AmbientLight({r: 30, g: 30, b: 30}));

for(const line of mesh) {
    const p1 = new Vec3D(line.p1.x * scale, 0, line.p1.y * scale);
    const p2 = new Vec3D(line.p1.x * scale, scale * -7, line.p1.y * scale);
    const p3 = new Vec3D(line.p2.x * scale, 0, line.p2.y * scale);
	const p4 = new Vec3D(line.p2.x * scale, scale * -7, line.p2.y * scale);
	
	const r = 70;
	const g = 70;
	const b = 70;

	const plane = new Plane([p1, p3, p4, p2], {r: r, g: g, b: b});
    e.planes.push(plane);
    
	// break;
}

const p1 = new Vec3D(0, .01, 0);
const p2 = new Vec3D(0, .01, 100 * scale);
const p3 = new Vec3D(100 * scale, .01, 0);
const p4 = new Vec3D(100 * scale, .01, 100 * scale);
const floor = new Plane([p1, p3, p4, p2], {r: 100, g: 100, b: 100})
e.planes.push(floor);

function anim() {
	c.fillStyle = "black";
	c.fillRect(0, 0, canvas.width, canvas.height);

	camera.move();
    camera.renderEnvironment(e);

	window.requestAnimationFrame(anim);
}
anim();

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
		camera.pitch += (e.movementY)/400;
		camera.yaw -= (e.movementX)/400;
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