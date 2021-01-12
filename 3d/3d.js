function BSTNode(val, key = function (k) {return k}) {
	this.key = key;
	this.val = val;
	this.left = null;
	this.right = null;

	this.insert = function(node) {
		const planes = Plane.planePrecedesPlane(this.val, node.val);

		if(planes[0]) {
			const n = new BSTNode(planes[0]);

			if(this.right) {
				this.right.insert(n);
			} else {
				this.right = n;
			}
		}

		if(planes[1]) {
			const n = new BSTNode(planes[1]);

			if(this.left) {
				this.left.insert(n);
			} else {
				this.left = n;
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

	this.add = function(key, val) {
		let node = new BSTNode(key, val);

		if(this.root == null) {
			this.root = node;
			return;
		}
		
		this.root.insert(node);
	};

	this.iter = function*() {
		if(!this.root) return;
		yield* this.root.iter();
	}
}

class Point3D {
	constructor(x, y, z, nx = null, ny = null, nz = null) {
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

	static findDistance(p1, p2) {
		let nx = p1.x - p2.x;
        let ny = p1.y - p2.y;
		let nz = p1.z - p2.z;
		
		const hDist = Math.sqrt(nx*nx + nz*nz);
		const totalDist = Math.sqrt(hDist*hDist + ny*ny);

		return totalDist;
	}
}

class Plane {
	constructor(points, color) {
		this.points = points;
		this.baseColor = color;
		this.color = null;
		this.normal = {
			i: null,
			j: null,
			k: null,
		};
	}
	
	updateNormalVector() {
		const a = [this.points[0].x - this.points[1].x, this.points[0].y - this.points[1].y, this.points[0].z - this.points[1].z];
		const b = [this.points[0].x - this.points[2].x, this.points[0].y - this.points[2].y, this.points[0].z - this.points[2].z];

		this.normal.i = a[1] * b[2] - a[2] * b[1];
		this.normal.j = a[0] * b[2] - a[2] * b[0];
		this.normal.k = a[0] * b[1] - a[1] * b[0];
		this.normal.d = this.points[0].x * this.normal.i - this.points[0].y * this.normal.j + this.points[0].z * this.normal.k;

		// if(this.normal.d == 0) {
		// 	console.log("!");
		// }
	}

	
	static findCenter(plane) {
		let x = 0;
		let y = 0;
		let z = 0;
		
		for(const point of plane.points) {
			x += point.x / plane.points.length;
			y += point.y / plane.points.length;
			z += point.z / plane.points.length;
		}

		return new Point3D(x, y, z);
	}

	static calculateShading(plane, camera) {
		const p = Plane.findCenter(plane);
		const d = Point3D.findDistance(p, camera);

		const fade = 1 - (d / 10);

		let r = plane.baseColor.r * fade;
		let g = plane.baseColor.g * fade;
		let b = plane.baseColor.b * fade;

		if(plane.normal.d == 0) {
			r = 255;
			g = 0;
			b = 0;
			// console.log(r);
		}

		return {r: r, g: g, b: b};
	}

	static findLinePlaneIntercept(plane, p1, p2) {
		let dx = p2.x - p1.x;
		let dy = p2.y - p1.y;
		let dz = p2.z - p1.z;

		const num = p1.x * plane.normal.i - p1.y * plane.normal.j + p1.z * plane.normal.k;
		const den = dx * plane.normal.i - dy * plane.normal.j + dz * plane.normal.k;

		let t = (plane.normal.d - num) / den;

		t = t < .00001 ? 0 : t;

		const x = p1.x + dx * t;
		const y = p1.y + dy * t;
		const z = p1.z + dz * t;

		// if(plane.normal.d == -Infinity) {
		// 	console.log()
		// }

		const point = new Point3D(x, y, z);

		return point;
	}

	static pointPrecedesPlane(point, plane) {
		const a = [point.x - plane.points[0].x, point.y - plane.points[0].y, point.z - plane.points[0].z];
		const b = [camera.x - plane.points[0].x, camera.y - plane.points[0].y, camera.z - plane.points[0].z];

		const w = plane.normal.i * a[0] - plane.normal.j * a[1] + plane.normal.k * a[2];
		const v = plane.normal.i * b[0] - plane.normal.j * b[1] + plane.normal.k * b[2];
		
		if(w == 0) return null;
		return w > 0 == v > 0;
	}

	static planePrecedesPlane(p1, p2) {
		let front_points = [];
		let back_points = [];

		let front_point_counter = 0;
		let back_point_counter = 0;

		let front_plane = null;
		let back_plane = null;

		let first_side = null;
		let last_side = null;

		for(let i = 0; i < p2.points.length; i++) {
			const res = this.pointPrecedesPlane(p2.points[i], p1);
			
			if(i == 0) first_side = res; 
			if(res == null) {
				front_points.push(p2.points[i]);
				back_points.push(p2.points[i]);
				continue;
			}

			if(res != last_side && last_side != null) {
				const last_idx = (i - 1) % p2.points.length; 
				const new_point = this.findLinePlaneIntercept(p1, p2.points[i], p2.points[last_idx]);
				front_points.push(new_point);
				back_points.push(new_point);
			}
			
			if(res) {
				front_points.push(p2.points[i]);
				front_point_counter++;
			} else {
				back_points.push(p2.points[i]);
				back_point_counter++;
			}

			last_side = res;
		}
		
		if(last_side != first_side && last_side != null && first_side != null) {
			const last_idx = p2.points.length - 1; 
			const new_point = this.findLinePlaneIntercept(p1, p2.points[0], p2.points[last_idx]);
			front_points.push(new_point);
			back_points.push(new_point);
		}

		// if(front_point_counter == 0 && back_point_counter == 0) {
		// 	console.log("!")
		// }  
		if(back_point_counter == 0) {
			front_plane = p2;
		} else if(front_point_counter == 0) {
			back_plane = p2;
		} else {
			front_plane = new Plane(front_points, p2.baseColor);
			front_plane.updateNormalVector();
			back_plane = new Plane(back_points, p2.baseColor);
			back_plane.updateNormalVector();
		}
		// 
		// if(front_point_counter > back_point_counter) {
		// 	front_plane = p2;
		// } else {
		// 	back_plane = p2;
		// }
		return [front_plane, back_plane];
	}
}

function Camera(x, y, z, pitch = 0, yaw = 0, roll = 0) {
    this.x = x;
    this.y = y;
	this.z = z;

	this.fov = 600; //not really "fov" but serves the same function 

    this.pitch = pitch;
    this.yaw = yaw;
    this.roll = roll;

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

		return new Point3D(0, 0, 0, nx, ny, nz);
	};

    this.clipPlane = function(curPoint, prevPoint, nextPoint) {
		let p1 = this.findZIntercept(curPoint, prevPoint);
		let p2 = this.findZIntercept(curPoint, nextPoint);
		this.projectToPlane(p1);
		this.projectToPlane(p2);
		
		c.lineTo(p1.imageX, p1.imageY);
		c.lineTo(p2.imageX, p2.imageY);
	};

	this.renderPlane = function(p) {
		c.beginPath();

		let visible = false;

		for(let i = 0; i < p.points.length; i++) {
			let point = p.points[i];
			
			if(point.visible) {
				visible = true;
				c.lineTo(point.imageX, point.imageY);
			} else {
				const prevPoint = i <= 0 ? p.points[p.points.length - 1] : p.points[i - 1];
				const nextPoint = i >= p.points.length - 1 ? p.points[0] : p.points[i + 1];
				const curPoint = p.points[i];
				this.clipPlane(curPoint, prevPoint, nextPoint);
			}
		}

		c.closePath();

		if(!visible) return;

		c.fillStyle = "rgb("+p.color.r+", "+p.color.g+", "+p.color.b+")";
		c.fill();
		c.strokeStyle = "rgb("+p.color.r+", "+p.color.g+", "+p.color.b+")";
		c.stroke();
	}

	this.renderEnvironment = function (env) {
		for(const plane of env.planes) {
			for(const point of plane.points) {
				camera.alignToFrame(point);
				camera.projectToPlane(point);
			}
		}

		let bst = new SortedBinaryTree();
		for(const plane of env.planes) {
			plane.updateNormalVector();
			bst.add(plane);
		}

        for(let plane of bst.iter()) {
			for(const point of plane.points) {
				if(point.nx == null) {
					this.alignToFrame(point);
					this.projectToPlane(point);
				}
			}

			plane.color = Plane.calculateShading(plane, this);
			this.renderPlane(plane);
		}
	}
}

function Environment() {
	this.points = [];
	this.planes = [];
    
    this.setup = function() {
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
							[  0.0000,  0.0000, 3.15000 ], [  0.8000,  0.0000, 3.15000 ],
							[  0.8000, -0.4500, 3.15000 ], [  0.4500, -0.8000, 3.15000 ],
							[  0.0000, -0.8000, 3.15000 ], [  0.0000,  0.0000, 2.85000 ],
							[  1.4000,  0.0000, 2.40000 ], [  1.4000, -0.7840, 2.40000 ],
							[  0.7840, -1.4000, 2.40000 ], [  0.0000, -1.4000, 2.40000 ],
							[  0.4000,  0.0000, 2.55000 ], [  0.4000, -0.2240, 2.55000 ],
							[  0.2240, -0.4000, 2.55000 ], [  0.0000, -0.4000, 2.55000 ],
							[  1.3000,  0.0000, 2.55000 ], [  1.3000, -0.7280, 2.55000 ],
							[  0.7280, -1.3000, 2.55000 ], [  0.0000, -1.3000, 2.55000 ],
							[  1.3000,  0.0000, 2.40000 ], [  1.3000, -0.7280, 2.40000 ],
							[  0.7280, -1.3000, 2.40000 ], [  0.0000, -1.3000, 2.40000 ]];
		
		for(const point of utahVerticies) {
			this.points.push(new Point3D(point[1], -point[2], point[0]));
		}

		const parts =  	[[ 	102, 103, 104, 105,   4,   5,   6,   7,
							8,   9,  10,  11,  12,  13,  14,  15 ],
						[  	12,  13,  14,  15,  16,  17,  18,  19,
							20,  21,  22,  23,  24,  25,  26,  27 ],
						[   24,  25,  26,  27,  29,  30,  31,  32,
							33,  34,  35,  36,  37,  38,  39,  40 ],
						[  	96,  96,  96,  96,  97,  98,  99,  100,
							101, 101, 101, 101,  0,   1,   2,   3 ],
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

		for(const [idx, part] of parts.entries()) {
			let ref = 0;

			if(idx <= 4) {
				ref = 3;
			} else {
				ref = 1;
			}

			while(ref >= 0) {
				const sx = (ref == 1 || ref == 3) ? -1 : 1;
				const sz = (ref == 2 || ref == 3) ? -1 : 1;

				for(let i = 0; i < part.length - 5; i++) {
					if((i+1) % 4 == 0) i++;
	
					const idx1 = part[i];
					const idx2 = part[i + 1];
					const idx3 = part[i + 4];
					const idx4 = part[i + 5];
	
					let points = [this.points[idx1], this.points[idx3], this.points[idx4], this.points[idx2]];

					for(let [idx, point] of points.entries()) {
						points[idx] = new Point3D(point.x * sx, point.y, point.z * sz);
					}
	
					const red = 0;
					const green = 255;
					const blue = 255;
					this.planes.push(new Plane(points, {r: red, g: green, b: blue}));
				}

				ref--;
			}
		}
	};
}