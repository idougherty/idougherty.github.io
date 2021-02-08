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

	this.add = function(val, key) {

		let node = new BSTNode(val, key);

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
		
		const d = Math.sqrt(nx*nx + nz*nz + ny*ny);

		return d;
	}

	static normalize(vector) {
		const d = Point3D.findDistance(vector, new Point3D(0, 0, 0));
		
		vector.x = vector.x / d;
		vector.y /= d;
		vector.z /= d;		

		return vector;
	}
}

class Plane {
	constructor(points, color = null) {
		this.points = points;
		this.baseColor = color;
		this.color = null;

		this.normal = {
			i: null,
			j: null,
			k: null,
			unit: null,
		};
	}
	
	updateNormalVector() {
		const a = [this.points[0].x - this.points[1].x, this.points[0].y - this.points[1].y, this.points[0].z - this.points[1].z];
		const b = [this.points[0].x - this.points[2].x, this.points[0].y - this.points[2].y, this.points[0].z - this.points[2].z];

		const i = a[1] * b[2] - a[2] * b[1];
		const j = a[0] * b[2] - a[2] * b[0];
		const k = a[0] * b[1] - a[1] * b[0];

		const normal = Point3D.normalize(new Point3D(i, j, k));

		this.normal.i = normal.x;
		this.normal.j = normal.y;
		this.normal.k = normal.z;

		this.normal.d = this.points[0].x * this.normal.i - this.points[0].y * this.normal.j + this.points[0].z * this.normal.k;
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

	static calculateShading(plane, camera, lights) {
		let r = plane.baseColor.r;
		let g = plane.baseColor.g;
		let b = plane.baseColor.b;

		for(const light of lights) {
			if(light instanceof DirectionalLight) {
				let middle = this.findCenter(plane); 

				let a = new Point3D(middle.x - camera.x, middle.y - camera.y, middle.z - camera.z);
				a = Point3D.normalize(a);

				const v = plane.normal.i * a.x - plane.normal.j * a.y + plane.normal.k * a.z;

				const ndotl =  (plane.normal.i * light.vec.x - plane.normal.j * light.vec.y + plane.normal.k * light.vec.z);

				//base shading
				r += ndotl * 80 * Math.sign(v);
				g += ndotl * 80 * Math.sign(v);
				b += ndotl * 80 * Math.sign(v);
				
				const n = [ndotl * plane.normal.i, ndotl * plane.normal.j, ndotl * plane.normal.k];

				let h = new Point3D(2 * n[0] - light.vec.x, 2 * n[1] - light.vec.y, 2 * n[2] - light.vec.z);
				h = Point3D.normalize(h);

				const ndoth = (a.x * h.x - a.y * h.y + a.z * h.z);
				const m = 5;
				
				//specular highlights
				r += Math.max(Math.pow(ndoth, m) * 50, 0);
				g += Math.max(Math.pow(ndoth, m) * 50, 0);
				b += Math.max(Math.pow(ndoth, m) * 50, 0);
			}
		}

		// if(plane.normal.d == 0) {
		// 	r = 255;
		// 	g = 0;
		// 	b = 0;
		// }

		return {r: r, g: g, b: b};
	}

	static findLinePlaneIntercept(plane, p1, p2) {
		let dx = p2.x - p1.x;
		let dy = p2.y - p1.y;
		let dz = p2.z - p1.z;

		const num = p1.x * plane.normal.i - p1.y * plane.normal.j + p1.z * plane.normal.k;
		const den = dx * plane.normal.i - dy * plane.normal.j + dz * plane.normal.k;

		let t = (plane.normal.d - num) / den;

		if(t < .00001 || (t >= .99999 && t <= 1.00001)) return;

		let nx = dx * t;
		let ny = dy * t;
		let nz = dz * t;

		const x = p1.x + nx;
		const y = p1.y + ny;
		const z = p1.z + nz;

		const point = new Point3D(x, y, z);

		return point;
	}

	static pointPrecedesPlane(point, plane) {
		const a = [point.x - plane.points[0].x, point.y - plane.points[0].y, point.z - plane.points[0].z];
		const b = [camera.x - plane.points[0].x, camera.y - plane.points[0].y, camera.z - plane.points[0].z];

		const w = plane.normal.i * a[0] - plane.normal.j * a[1] + plane.normal.k * a[2];
		const v = plane.normal.i * b[0] - plane.normal.j * b[1] + plane.normal.k * b[2];

		if(Math.abs(w) < .00001) return null;
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
				if(new_point) {
					front_points.push(new_point);
					back_points.push(new_point);
				}
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
	
			if(new_point) {
				front_points.push(new_point);
				back_points.push(new_point);
			}
		}

		if(back_point_counter == 0) {
			front_plane = p2;
		} else if(front_point_counter == 0) {
			back_plane = p2;
		} else {
			front_plane = new Plane(front_points);
			front_plane.color = p2.color;
			front_plane.side = p2.side;
			front_plane.updateNormalVector();

			back_plane = new Plane(back_points);
			back_plane.color = p2.color;
			back_plane.side = p2.side;
			back_plane.updateNormalVector();
		}

		return [front_plane, back_plane];
	}
}

function Camera(x, y, z, pitch = 0, yaw = 0, roll = 0) {
    this.x = x;
    this.y = y;
	this.z = z;

	this.fov = 800; //not really "fov" but serves the same function 

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

    this.clipPath = function(curPoint, prevPoint, nextPoint) {
		let p1 = this.findZIntercept(curPoint, prevPoint);
		let p2 = this.findZIntercept(curPoint, nextPoint);
		this.projectToPlane(p1);
		this.projectToPlane(p2);
		
		c.lineTo(p1.imageX, p1.imageY);
		c.lineTo(p2.imageX, p2.imageY);
	};

	this.renderPlane = function(p) {
		let visible = false;
		
		c.beginPath();

		for(let i = 0; i < p.points.length; i++) {
			let point = p.points[i];
			
			if(point.visible) {
				visible = true;
				c.lineTo(point.imageX, point.imageY);
			} else {
				const prevPoint = i <= 0 ? p.points[p.points.length - 1] : p.points[i - 1];
				const nextPoint = i >= p.points.length - 1 ? p.points[0] : p.points[i + 1];
				const curPoint = p.points[i];
				this.clipPath(curPoint, prevPoint, nextPoint);
			}
		}

		c.closePath();

		if(!visible) return;
		
		
		if(p.color != null) {
			let color = "rgb("+p.color.r+", "+p.color.g+", "+p.color.b+")";

			c.fillStyle = color;
			c.fill();
			c.strokeStyle = color;
			c.stroke();
		}
	}

	this.renderEnvironment = function (env) {
		for(const plane of env.planes) {
			for(const point of plane.points) {
				camera.alignToFrame(point);
				camera.projectToPlane(point);
			}
		}

		let bst = new SortedBinaryTree();
		for(let plane of env.planes) {
			plane.updateNormalVector();
			plane.color = Plane.calculateShading(plane, this, env.lights);

			bst.add(plane);
		}

        for(let plane of bst.iter()) {
			for(const point of plane.points) {
				if(point.nx == null) {
					this.alignToFrame(point);
					this.projectToPlane(point);
				}
			}

			this.renderPlane(plane);
		}
	}
}

class DirectionalLight {
	constructor(vector, color, intensity) {
		this.vec = vector;
		this.color = color;
		this.intensity = intensity;
	}
}

class Light {
	constructor(position, color, intensity) {
		this.pos = position;
		this.color = color;
		this.intensity = intensity;
	}
}

function Environment() {
	this.points = [];
	this.planes = [];
	this.lights = [];
	
    this.setup = function() {
	};
}