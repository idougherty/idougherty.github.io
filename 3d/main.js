let canvas = document.getElementById("canvas");
let c = canvas.getContext("2d");

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

window.onresize = resizeCanvas;
resizeCanvas();

function bezier3D(p1, p2, p3, p4, t) {
	const m1x = p1.x + (p2.x - p1.x) * t;
	const m1y = p1.y + (p2.y - p1.y) * t;
	const m1z = p1.z + (p2.z - p1.z) * t;

	const m2x = p2.x + (p3.x - p2.x) * t;
	const m2y = p2.y + (p3.y - p2.y) * t;
	const m2z = p2.z + (p3.z - p2.z) * t;

	const m3x = p3.x + (p4.x - p3.x) * t;
	const m3y = p3.y + (p4.y - p3.y) * t;
	const m3z = p3.z + (p4.z - p3.z) * t;

	const p1x = m1x + (m2x - m1x) * t;
	const p1y = m1y + (m2y - m1y) * t;
	const p1z = m1z + (m2z - m1z) * t;

	const p2x = m2x + (m3x - m2x) * t;
	const p2y = m2y + (m3y - m2y) * t;
	const p2z = m2z + (m3z - m2z) * t;

	const fx = p1x + (p2x - p1x) * t;
	const fy = p1y + (p2y - p1y) * t;
	const fz = p1z + (p2z - p1z) * t;

	return new Vec3D(fx, -fy, fz);
}

let e = new Environment();
let camera = new Camera(new Vec3D(-7, -2, 0), 0, Math.PI/2);

let vec = new Vec3D(.5, 1, -.5);
vec  = Vec3D.normalize(vec);
e.lights.push(new DirectionalLight(vec, {r: 105, g: 95, b: 85}));

let utahVerticies = [[  0.2000,  0.0000, 2.70000 ], [  0.2000, -0.1120, 2.70000 ],
					[  0.1120, -0.2000, 2.70000 ], [  0.0000, -0.2000, 2.70000 ],
					[  1.3375,  0.0000, 2.53125 ], [  1.3375, -0.7490, 2.53125 ],
					[  0.7490, -1.3375, 2.53125 ], [  0.0000, -1.3375, 2.53125 ],
					[  1.4375,  0.0000, 2.53125 ], [  1.4375, -0.8050, 2.53125 ],
					[  0.8050, -1.4375, 2.53125 ], [  0.0000, -1.4375, 2.53125 ],
					[  1.5000,  0.0000, 2.40000 ], [  1.5000, -0.8400, 2.40000 ],
					[  0.8400, -1.5000, 2.40000 ], [  0.0000, -1.5000, 2.40000 ],
					[  1.7500,  0.0000, 1.87500 ], [  1.7500, -0.9800, 1.87500 ],
					[  0.9800, -1.7500, 1.87500 ], [  0.0000, -1.7500, 1.87500 ],
					[  2.0000,  0.0000, 1.35000 ], [  2.0000, -1.1200, 1.35000 ],
					[  1.1200, -2.0000, 1.35000 ], [  0.0000, -2.0000, 1.35000 ],
					[  2.0000,  0.0000, 0.90000 ], [  2.0000, -1.1200, 0.90000 ],
					[  1.1200, -2.0000, 0.90000 ], [  0.0000, -2.0000, 0.90000 ],
					[ -2.0000,  0.0000, 0.90000 ], [  2.0000,  0.0000, 0.45000 ],
					[  2.0000, -1.1200, 0.45000 ], [  1.1200, -2.0000, 0.45000 ],
					[  0.0000, -2.0000, 0.45000 ], [  1.5000,  0.0000, 0.22500 ],
					[  1.5000, -0.8400, 0.22500 ], [  0.8400, -1.5000, 0.22500 ],
					[  0.0000, -1.5000, 0.22500 ], [  1.5000,  0.0000, 0.15000 ],
					[  1.5000, -0.8400, 0.15000 ], [  0.8400, -1.5000, 0.15000 ],
					[  0.0000, -1.5000, 0.15000 ], [ -1.6000,  0.0000, 2.02500 ],
					[ -1.6000, -0.3000, 2.02500 ], [ -1.5000, -0.3000, 2.25000 ],
					[ -1.5000,  0.0000, 2.25000 ], [ -2.3000,  0.0000, 2.02500 ],
					[ -2.3000, -0.3000, 2.02500 ], [ -2.5000, -0.3000, 2.25000 ],
					[ -2.5000,  0.0000, 2.25000 ], [ -2.7000,  0.0000, 2.02500 ],
					[ -2.7000, -0.3000, 2.02500 ], [ -3.0000, -0.3000, 2.25000 ],
					[ -3.0000,  0.0000, 2.25000 ], [ -2.7000,  0.0000, 1.80000 ],
					[ -2.7000, -0.3000, 1.80000 ], [ -3.0000, -0.3000, 1.80000 ],
					[ -3.0000,  0.0000, 1.80000 ], [ -2.7000,  0.0000, 1.57500 ],
					[ -2.7000, -0.3000, 1.57500 ], [ -3.0000, -0.3000, 1.35000 ],
					[ -3.0000,  0.0000, 1.35000 ], [ -2.5000,  0.0000, 1.12500 ],
					[ -2.5000, -0.3000, 1.12500 ], [ -2.6500, -0.3000, 0.93750 ],
					[ -2.6500,  0.0000, 0.93750 ], [ -2.0000, -0.3000, 0.90000 ],
					[ -1.9000, -0.3000, 0.60000 ], [ -1.9000,  0.0000, 0.60000 ],
					[  1.7000,  0.0000, 1.42500 ], [  1.7000, -0.6600, 1.42500 ],
					[  1.7000, -0.6600, 0.60000 ], [  1.7000,  0.0000, 0.60000 ],
					[  2.6000,  0.0000, 1.42500 ], [  2.6000, -0.6600, 1.42500 ],
					[  3.1000, -0.6600, 0.82500 ], [  3.1000,  0.0000, 0.82500 ],
					[  2.3000,  0.0000, 2.10000 ], [  2.3000, -0.2500, 2.10000 ],
					[  2.4000, -0.2500, 2.02500 ], [  2.4000,  0.0000, 2.02500 ],
					[  2.7000,  0.0000, 2.40000 ], [  2.7000, -0.2500, 2.40000 ],
					[  3.3000, -0.2500, 2.40000 ], [  3.3000,  0.0000, 2.40000 ],
					[  2.8000,  0.0000, 2.47500 ], [  2.8000, -0.2500, 2.47500 ],
					[  3.5250, -0.2500, 2.49375 ], [  3.5250,  0.0000, 2.49375 ],
					[  2.9000,  0.0000, 2.47500 ], [  2.9000, -0.1500, 2.47500 ],
					[  3.4500, -0.1500, 2.51250 ], [  3.4500,  0.0000, 2.51250 ],
					[  2.8000,  0.0000, 2.40000 ], [  2.8000, -0.1500, 2.40000 ],
					[  3.2000, -0.1500, 2.40000 ], [  3.2000,  0.0000, 2.40000 ],
					[  0.0000,  0.0000, 3.25000 ], [  0.8000,  0.0000, 3.15000 ],
					[  0.8000, -0.4500, 3.15000 ], [  0.4500, -0.8000, 3.15000 ],
					[  0.0000, -0.8000, 3.15000 ], [  0.0000,  0.0000, 2.85000 ],
					[  1.4000,  0.0000, 2.40000 ], [  1.4000, -0.7840, 2.40000 ],
					[  0.7840, -1.4000, 2.40000 ], [  0.0000, -1.4000, 2.40000 ],
					[  0.4000,  0.0000, 2.55000 ], [  0.4000, -0.2240, 2.55000 ],
					[  0.2240, -0.4000, 2.55000 ], [  0.0000, -0.4000, 2.55000 ],
					[  1.3000,  0.0000, 2.55000 ], [  1.3000, -0.7280, 2.55000 ],
					[  0.7280, -1.3000, 2.55000 ], [  0.0000, -1.3000, 2.55000 ],
					[  1.3000,  0.0000, 2.40000 ], [  1.3000, -0.7280, 2.40000 ],
					[  0.7280, -1.3000, 2.40000 ], [  0.0000, -1.3000, 2.40000 ], 
					[  0.0000,  0.0000, 0.00000 ], [  1.4250, -0.7980, 0.00000 ],
					[  1.5000,  0.0000, 0.07500 ], [  1.4250,  0.0000, 0.00000 ],
					[  0.7980, -1.4250, 0.00000 ], [  0.0000, -1.5000, 0.07500 ],
					[  0.0000, -1.4250, 0.00000 ], [  1.5000, -0.8400, 0.07500 ],
					[  0.8400, -1.5000, 0.07500 ]];

const parts =  	[[ 	102, 103, 104, 105, 4,   5,   6,   7,
					8,   9,   10,  11,  12,  13,  14,  15 ],
				[  	12,  13,  14,  15,  16,  17,  18,  19,
					20,  21,  22,  23,  24,  25,  26,  27 ],
				[   24,  25,  26,  27,  29,  30,  31,  32,
					33,  34,  35,  36,  37,  38,  39,  40 ],
				[  	96,  96,  96,  96,  97,  98,  99,  100,
					101, 101, 101, 101, 0,   1,   2,   3 ],
				[ 	118, 118, 118, 118, 124, 122, 119, 121,
					123, 126, 125, 120, 40,  39,  38,  37 ],
				[   0,   1,   2,   3,   106, 107, 108, 109,
					110, 111, 112, 113, 114, 115, 116, 117 ],
				[  	41,  42,  43,  44,  45,  46,  47,  48,
					49,  50,  51,  52,  53,  54,  55,  56 ],
				[  	53,  54,  55,  56,  57,  58,  59,  60,
					61,  62,  63,  64,  28,  65,  66,  67 ],
				[  	68,  69,  70,  71,  72,  73,  74,  75,
					76,  77,  78,  79,  80,  81,  82,  83 ],
				[  	80,  81,  82,  83,  84,  85,  86,  87,
					88,  89,  90,  91,  92,  93,  94,  95 ]];

const subdivisions = 5;

for(const [idx, part] of parts.entries()) {
	let ref = 0;

	if(idx <= 5) {
		ref = 3;
	} else {
		ref = 1;
	}

	while(ref >= 0) {
		const sx = (ref == 1 || ref == 3) ? -1 : 1;
		const sz = (ref == 2 || ref == 3) ? -1 : 1;

		let columns = [];
		
		//vertical subdivision
		for(let i = 0; i < 4; i++) {
			const idx1 = part[i];
			const idx2 = part[i + 4];
			const idx3 = part[i + 8];
			const idx4 = part[i + 12];

			let points = [];

			for(let j = 0; j <= subdivisions; j++) {
				const p1 = new Vec3D(utahVerticies[idx1][1], -utahVerticies[idx1][2], utahVerticies[idx1][0]);
				const p2 = new Vec3D(utahVerticies[idx2][1], -utahVerticies[idx2][2], utahVerticies[idx2][0]);
				const p3 = new Vec3D(utahVerticies[idx3][1], -utahVerticies[idx3][2], utahVerticies[idx3][0]);
				const p4 = new Vec3D(utahVerticies[idx4][1], -utahVerticies[idx4][2], utahVerticies[idx4][0]);

				points.push(bezier3D(p1, p2, p3, p4, j / subdivisions))
			}


			for(let [idx, point] of points.entries()) {
				points[idx] = new Vec3D(point.x * sx, point.y, point.z * sz);
			}

			columns.push(points);
		}
		
		//horizontal subdivision
		let patches = [];

		for(let i = 0; i < columns[0].length; i++) {
			let row = [];

			for(let j = 0; j <= subdivisions; j++) {
				row.push(bezier3D(columns[0][i], columns[1][i], columns[2][i], columns[3][i], j / subdivisions));
			}

			patches.push(row);
		}
		

		for(let i = 0; i < patches.length - 1; i++) {
			for(let j = 0; j < patches[0].length - 1; j++) {
				let points = [patches[i][j], patches[i][j + 1], patches[i + 1][j + 1], patches[i + 1][j]];

				for(let x = points.length - 1; x > 0; x--) {
					for(let y = x - 1; y >= 0; y--) {
						if(points[x].x == points[y].x && points[x].y == points[y].y && points[x].z == points[y].z) {
							points.splice(x, 1);
						}
					}
				}

				let red = 180;
				let green = 180;
				let blue = 180;

				switch(idx) {
					case 0:
					case 3:
					case 4:
					case 6:
					case 7:
					case 9:
						red = 80;
						green = 80;
						blue = 120;
						break;
				}

				e.planes.push(new Plane(points, {r: red, g: green, b: blue}));
			}
		}

		ref--;
	}
}

rotatePoint = function(angle, x, y) {
	const sin = Math.sin(angle);
	const cos = Math.cos(angle);
	
	const nx = x*cos - y*sin;
	const ny = y*cos + x*sin;
	
	return [nx, ny];
};

function cameraTransform(timer, d) {
	yaw = .01 * timer;
	pitch = Math.PI / 16 * Math.sin(timer/100);
	roll = 0;//Math.PI / 16 * Math.sin(timer/200);

	const p1 = rotatePoint(yaw, 5, 0);
	const p2 = rotatePoint(pitch, -5, 0);
	// const p3 = this.rotatePoint(roll, p1[0], p2[1]);

	camera.pos.x = p1[0] * d;
	camera.pos.y = -p2[1] * d - 2;
	camera.pos.z = p1[1] * d;

	camera.pitch = -pitch;
	camera.yaw = yaw + Math.PI/2;
	camera.roll = roll;
}

let timer = 0;
let cameraLock = true;

function anim() {
	c.clearRect(0, 0, canvas.width, canvas.height);
	c.fillStyle = "black";
	c.fillRect(0, 0, canvas.width, canvas.height);
	
	if(cameraLock) {
		cameraTransform(timer, 1.5);
	}

	timer += 2;
	camera.move();
	camera.renderEnvironment(e);

	window.requestAnimationFrame(anim);
}
anim();

document.addEventListener("keydown", function(e) {
	let disableLock = true;

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
			disableLock = false;
	}

	if(cameraLock && disableLock) {
		cameraLock = false;
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

	if(cameraLock) {
		cameraLock = false;
	}
});

document.addEventListener("mouseup", function(e) {
	document.exitPointerLock();
	camera.mouse.down = false;
});