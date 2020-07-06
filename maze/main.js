let canvas = document.getElementById("canvas");
let c = canvas.getContext("2d");

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

window.onresize = resizeCanvas;
resizeCanvas();

function Point(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.imageX = 0;
	this.imageY = 0;
}

function Plane(points, color, middle) {
	this.points = points;
	this.color = color;
	this.middle = middle;
}

function Camera() {
    this.x = 0;
    this.y = 0;
	this.z = 2;

    this.fov = 600; //not really "fov" but serves the same function 

    this.pitch = 0;
    this.yaw = 0;
    this.roll = 0;

    this.speed = .1;

    this.keydown = {
        up: false,
        down: false,
        left: false,
        right: false,
        w: false,
        a: false,
        s: false,
        d: false,
        space: false,
		shift: false,
    };

	this.mouse = {
		down: false,
		x: 0,
		y: 0,
	};

    this.move = function() {
		// if(this.keydown.up && !this.keydown.down) {
		// 	this.pitch += .05;
		// } else if(this.keydown.down && !this.keydown.up) {
		// 	this.pitch -= .05;
		// }

		// if(this.keydown.left && !this.keydown.right) {
		// 	this.yaw -= .05;
		// } else if(this.keydown.right && !this.keydown.left) {
		// 	this.yaw += .05;
		// }

		if(this.yaw <= -Math.PI) {
			this.yaw += Math.PI*2;
		} else if(this.yaw > Math.PI) {
			this.yaw -= Math.PI*2;
		}

		if(this.pitch < -Math.PI/2) {
			this.pitch = -Math.PI/2;
		} else if(this.pitch > Math.PI/2) {
			this.pitch = Math.PI/2;
		}

		if(this.keydown.w && !this.keydown.s) {
			this.z -= Math.cos(this.yaw) * Math.cos(this.pitch) * this.speed;
			this.x -= Math.sin(this.yaw) * Math.cos(this.pitch) * this.speed;
			this.y += Math.sin(this.pitch) * this.speed;
		} else if(this.keydown.s && !this.keydown.w) {
			this.z += Math.cos(this.yaw) * Math.cos(this.pitch) * this.speed;
			this.x += Math.sin(this.yaw) * Math.cos(this.pitch) * this.speed;
			this.y -= Math.sin(this.pitch) * this.speed;
		}

		if(this.keydown.a && !this.keydown.d) {
			this.z += Math.cos(this.yaw + Math.PI/2) * this.speed;
			this.x += Math.sin(this.yaw + Math.PI/2) * this.speed;
		} else if(this.keydown.d && !this.keydown.a) {
			this.z -= Math.cos(this.yaw + Math.PI/2) * this.speed;
			this.x -= Math.sin(this.yaw + Math.PI/2) * this.speed;
		}

		if(this.keydown.space && !this.keydown.shift) {
			this.y += this.speed;
		} else if(this.keydown.shift && !this.keydown.space) {
			this.y -= this.speed;
		}
	}

    this.rotatePoint = function(angle, x, y) {
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);
		
		const nx = x*cos - y*sin;
		const ny = y*cos + x*sin;
		
		return [nx, ny];
	};

	this.findZIntercept = function(p1, p2) {
		dydx = (p1.y - p2.y) / (p1.x - p2.x); 
		dydz = (p1.y - p2.y) / (p1.z - p2.z);

		const nz = 0.01;
		const ny = dydz * (nz - p1.z) + p1.y;
		const nx = (ny - p1.y) / dydx + p1.x;

		console.log(ny, nx);

		return new Point(nx, ny, nz);
	};

	this.alignToFrame = function (p) {
        let nx = this.x - p.x;
        let ny = this.y - p.y;
		let nz = this.z - p.z;
		
		const p1 = this.rotatePoint(this.yaw, nx, nz);
		const p2 = this.rotatePoint(this.pitch, p1[1], ny);
		const p3 = this.rotatePoint(this.roll, p1[0], p2[1]);

		nx = p3[0];
	    ny = p3[1];
		nz = p2[0];

		return new Point(nx, ny, nz);
	};

    this.renderPoint = function(p, p2) {
		let np = this.alignToFrame(p);
		
		const vis = (np.z > 0.01);

		if(!vis) {
			const np2 = this.alignToFrame(p2);
			np = this.findZIntercept(np, np2);
		}

		let size = Math.abs(this.fov / np.z);
		
		imageX = np.x * size + canvas.width/2;
		imageY = np.y * size + canvas.height/2;

		return {x: imageX, y: imageY, vis: vis};
	};
	
	this.renderPlane = function(p) {
		c.beginPath();

		let visible = false;

		for(let i = 0; i < p.points.length; i++) {
			const prevIDX = i <= 0 ? p.points.length - 1 : i - 1;
			const image = this.renderPoint(p.points[i], p.points[prevIDX]);
			
			c.lineTo(image.x, image.y);
			if(image.vis == true) {
				visible = true; 
			} else {
				const nextIDX = i >= p.points.length - 1 ? 0 : i + 1;
				const image2 = this.renderPoint(p.points[i], p.points[nextIDX]);
				c.lineTo(image2.x, image2.y);
			}
		}

		c.closePath();

		if(!visible) return;

		c.fillStyle = p.color;
		c.fill();

	}
}

function Environment() {
	// this.points = [];
	this.planes = [];

	this.findCenter = function(points) {
		x = 0;
		y = 0;
		z = 0;
		
		for(point of points) {
			x += point.x / points.length;
			y += point.y / points.length;
			z += point.z / points.length;
		}

		return new Point(x, y, z);
	};

	this.findDistance = function(p1, p2) {
		let nx = p1.x - p2.x;
        let ny = p1.y - p2.y;
		let nz = p1.z - p2.z;
		
		const hDist = Math.sqrt(nx*nx + nz*nz);
		const totalDist = Math.sqrt(hDist*hDist + ny*ny);

		return totalDist;
	}
    
    this.setup = function() {
		let points = [];
		points.push( new Point(-1, -1, -1) );
		points.push( new Point(-1, -1, 1) );
		points.push( new Point(-1, 1, 1) );
		points.push( new Point(-1, 1, -1) );
		let middle = this.findCenter(points);
		this.planes.push(new Plane(points, "red", middle));

		points = [];
		points.push( new Point(1, -1, -1) );
		points.push( new Point(1, -1, 1) );
		points.push( new Point(1, 1, 1) );
		points.push( new Point(1, 1, -1) );
		middle = this.findCenter(points);
		this.planes.push(new Plane(points, "orange", middle));

		points = [];
		points.push( new Point(-1, -1, -1) );
		points.push( new Point(-1, -1, 1) );
		points.push( new Point(1, -1, 1) );
		points.push( new Point(1, -1, -1) );
		middle = this.findCenter(points);
		this.planes.push(new Plane(points, "white", middle));

		points = [];
		points.push( new Point(-1, 1, -1) );
		points.push( new Point(-1, 1, 1) );
		points.push( new Point(1, 1, 1) );
		points.push( new Point(1, 1, -1) );
		middle = this.findCenter(points);
		this.planes.push(new Plane(points, "yellow", middle));

		points = [];
		points.push( new Point(-1, -1, 1) );
		points.push( new Point(-1, 1, 1) );
		points.push( new Point(1, 1, 1) );
		points.push( new Point(1, -1, 1) );
		middle = this.findCenter(points);
		this.planes.push(new Plane(points, "green", middle));

		
		points = [];
		points.push( new Point(-1, -1, -1) );
		points.push( new Point(-1, 1, -1) );
		points.push( new Point(1, 1, -1) );
		points.push( new Point(1, -1, -1) );
		middle = this.findCenter(points);
		this.planes.push(new Plane(points, "blue", middle));

    };

    this.draw = function () {
        c.fillStyle = "black";
        c.fillRect(0, 0, canvas.width, canvas.height);

		this.planes.sort(function(a, b) {
			const aDist = environment.findDistance(a.middle, camera);
			const bDist = environment.findDistance(b.middle, camera);

			// const acolor = Math.min(80 / (aDist/2), 50);
			// const bcolor = Math.min(80 / (bDist/2), 50);

			// a.color = "hsl(0, "+acolor+"%, "+acolor+"%)";
			// b.color = "hsl(0, "+bcolor+"%, "+bcolor+"%)";

			return bDist - aDist;
		});

        for(plane of this.planes) {
            camera.renderPlane(plane);
        }
    };

    this.update = function() {
        camera.move();
		this.draw();
    };
}

let environment = new Environment();
environment.setup();

let camera = new Camera();

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

setInterval(function() {
    environment.update();
}, 20);