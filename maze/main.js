let canvas = document.getElementById("canvas");
let c = canvas.getContext("2d");

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

window.onresize = resizeCanvas;
resizeCanvas();

function Node(val, key = function (k) {return k}) {
	this.key = key;
	this.val = val;
	this.left = null;
	this.right = null;

	this.insert = function(node) {
		if(node.key > this.key) {
			if(this.right) {
				this.right.insert(node);
			} else {
				this.right = node;
			}
		} else {
			if(this.left) {
				this.left.insert(node);
			} else {
				this.left = node;
			}
		}
	};

	this.toString = function() {
		return this.val;
	};

	this.iter = function*() {
		if(this.left) {
			yield* this.left.iter();
		}

		yield this.val;

		if(this.right) {
			yield* this.right.iter();
		}
	}
}

function SortedBinaryTree() {
	this.root = null;

	this.insert = function(key, val) {
		let node = new Node(key, val);

		if(!this.root) {
			this.root = node;
			return;
		}
		
		if(key > this.root.key) {
			if(this.root.right) {
				this.root.right.insert(node);
			} else {
				this.root.right = node;
			}
		} else {
			if(this.root.left) {
				this.root.left.insert(node);
			} else {
				this.root.left = node;
			}
		}
	};

	this.iter = function*() {
		yield* this.root.iter();
	}
}

function Point(x, y, z, nx, ny, nz) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.nx = nx;
	this.ny = ny;
	this.nz = nz;
	this.visible = true;
	this.imageX = 0;
	this.imageY = 0;
	this.camDist = 0;
}

function Plane(points, color) {
	this.points = points;
	this.color = color;
	this.zIndex = 0;
}

function Camera() {
    this.x = 0;
    this.y = 0;
	this.z = 3;

	this.fov = 600; //not really "fov" but serves the same function 

    this.pitch = 0;
    this.yaw = 3.14;
    this.roll = 0;

	this.speed = .1;
	this.focalPlane = .001;

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
		if(this.keydown.up && !this.keydown.down) {
			this.pitch += .05;
		} else if(this.keydown.down && !this.keydown.up) {
			this.pitch -= .05;
		}

		if(this.keydown.left && !this.keydown.right) {
			this.yaw -= .05;
		} else if(this.keydown.right && !this.keydown.left) {
			this.yaw += .05;
		}

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
			this.z += Math.cos(this.yaw) * Math.cos(this.pitch) * this.speed;
			this.x += Math.sin(this.yaw) * Math.cos(this.pitch) * this.speed;
			this.y -= Math.sin(this.pitch) * this.speed;
		} else if(this.keydown.s && !this.keydown.w) {
			this.z -= Math.cos(this.yaw) * Math.cos(this.pitch) * this.speed;
			this.x -= Math.sin(this.yaw) * Math.cos(this.pitch) * this.speed;
			this.y += Math.sin(this.pitch) * this.speed;
		}

		if(this.keydown.a && !this.keydown.d) {
			this.z -= Math.cos(this.yaw + Math.PI/2) * this.speed;
			this.x -= Math.sin(this.yaw + Math.PI/2) * this.speed;
		} else if(this.keydown.d && !this.keydown.a) {
			this.z += Math.cos(this.yaw + Math.PI/2) * this.speed;
			this.x += Math.sin(this.yaw + Math.PI/2) * this.speed;
		}

		if(this.keydown.space && !this.keydown.shift) {
			this.y -= this.speed;
		} else if(this.keydown.shift && !this.keydown.space) {
			this.y += this.speed;
		}
	}

    this.rotatePoint = function(angle, x, y) {
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);
		
		const nx = x*cos - y*sin;
		const ny = y*cos + x*sin;
		
		return [nx, ny];
	};

	this.alignToFrame = function(p) {
        let nx = p.x - this.x;
        let ny = p.y - this.y;
		let nz = p.z - this.z;
		
		const p1 = this.rotatePoint(this.yaw, nx, nz);
		const p2 = this.rotatePoint(this.pitch, p1[1], ny);
		const p3 = this.rotatePoint(this.roll, p1[0], p2[1]);

		nx = p3[0];
	    ny = p3[1];
		nz = p2[0];
		
		p.nx = nx;
		p.ny = ny;
		p.nz = nz;
		p.visible = nz > this.focalPlane;
	};

	this.projectToPlane = function(p) {
		let size = this.fov / p.nz;

		p.imageX = p.nx * size + canvas.width/2;
		p.imageY = p.ny * size + canvas.height/2;
	}

	this.findZIntercept = function(p1, p2) {
		dxdz = (p1.nx - p2.nx) / (p1.nz - p2.nz); 
		dydz = (p1.ny - p2.ny) / (p1.nz - p2.nz);

		const nz = this.focalPlane;
		let nx = (nz - p1.nz) * dxdz + p1.nx;
		let ny = (nz - p1.nz) * dydz + p1.ny;

		return new Point(0, 0, 0, nx, ny, nz);
	};

    this.clipPlane = function(i, points) {
		const prevPoint = i <= 0 ? points[points.length - 1] : points[i - 1];
		const nextPoint = i >= points.length - 1 ? points[0] : points[i + 1];
		const curPoint = points[i];

		let p1 = this.findZIntercept(e.points[curPoint], e.points[prevPoint]);
		let p2 = this.findZIntercept(e.points[curPoint], e.points[nextPoint]);
		this.projectToPlane(p1);
		this.projectToPlane(p2);
		
		c.lineTo(p1.imageX, p1.imageY);
		c.lineTo(p2.imageX, p2.imageY);
	};

	this.renderPlane = function(p) {
		c.beginPath();

		let visible = false;

		for(let i = 0; i < p.points.length; i++) {
			const pointIDX = p.points[i];
			let point = e.points[pointIDX];
			
			if(point.visible) {
				visible = true;
				c.lineTo(point.imageX, point.imageY);
			} else {
				this.clipPlane(i, p.points);
			}
		}

		c.closePath();

		if(!visible) return;

		c.fillStyle = p.color;
		c.fill();

	}
}

function Environment() {
	this.points = [];
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
		this.points.push( new Point(10, 1, 1) );
		this.points.push( new Point(-1, 1, 1) );
		this.points.push( new Point(10, -1, 1) );
		this.points.push( new Point(-1, -1, 1) );
		this.points.push( new Point(10, 1, -1) );
		this.points.push( new Point(-1, 1, -1) );
		this.points.push( new Point(10, -1, -1) );
		this.points.push( new Point(-1, -1, -1) );

		let points = [0, 2, 3, 1];
		this.planes.push(new Plane(points, "red"));

		points = [4, 6, 7, 5];
		this.planes.push(new Plane(points, "orange"));

		points = [2, 6, 7, 3];
		this.planes.push(new Plane(points, "white"));

		points = [0, 1, 5, 4];
		this.planes.push(new Plane(points, "yellow"));

		points = [0, 4, 6, 2];
		this.planes.push(new Plane(points, "green"));
		
		points = [3, 1, 5, 7];
		this.planes.push(new Plane(points, "blue"));
	};
	
	this.calculatePoints = function() {
		for(point of this.points) {
			camera.alignToFrame(point);
			camera.projectToPlane(point);
		}
	}

    this.draw = function () {
		c.clearRect(0, 0, canvas.width, canvas.height);
        c.fillStyle = "black";
		c.fillRect(0, 0, canvas.width, canvas.height);
		
		this.calculatePoints();

		for(point of e.points) {
			point.camDist = this.findDistance(point, camera);
		}

        for(plane of e.planes) {
			let farthest = plane.points[0];
			for(let i = 1; i < plane.points.length; i++) {
				const IDX = plane.points[i]; 

				if(e.points[IDX].camDist > e.points[farthest].camDist) {
					farthest = IDX;
				}
			}
			plane.farthest = farthest;
		}
		
		this.planes.sort(function(a, b) {
			return e.points[b.farthest].camDist - e.points[a.farthest].camDist;
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

let e = new Environment();
e.setup();

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

// c.globalCompositeOperation = "source-over";
setInterval(function() {
    e.update();
}, 20);