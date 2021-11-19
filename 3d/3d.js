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

class Plane {
	constructor(points, color = null) {
		this.points = points;
		this.baseColor = color;
		this.color = null;

		this.normal = {
			i: null,
			j: null,
			k: null,
			d: null,
		};
	}
	
	updateNormalVector() {
		const a = [this.points[0].x - this.points[1].x, this.points[0].y - this.points[1].y, this.points[0].z - this.points[1].z];
		const b = [this.points[0].x - this.points[2].x, this.points[0].y - this.points[2].y, this.points[0].z - this.points[2].z];

		const i = a[1] * b[2] - a[2] * b[1];
		const j = a[0] * b[2] - a[2] * b[0];
		const k = a[0] * b[1] - a[1] * b[0];

		const normal = Vec3D.normalize(new Vec3D(i, j, k));

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

		return new Vec3D(x, y, z);
	}

	static calculateShading(plane, camera, lights) {
		let r = 0;
		let g = 0;
		let b = 0;

		for(const light of lights) {
			const rf = light.color.r / 255 * plane.baseColor.r / 255;
			const gf = light.color.g / 255 * plane.baseColor.g / 255;
			const bf = light.color.b / 255 * plane.baseColor.b / 255;

			if(light instanceof DirectionalLight) {
				let middle = this.findCenter(plane); 

				let a = new Vec3D(middle.x - camera.pos.x, middle.y - camera.pos.y, middle.z - camera.pos.z);
				a = Vec3D.normalize(a);

				const v = plane.normal.i * a.x - plane.normal.j * a.y + plane.normal.k * a.z;

				const ndotl =  (plane.normal.i * light.vec.x - plane.normal.j * light.vec.y + plane.normal.k * light.vec.z);

				//base shading
				r += plane.baseColor.r * Math.max(ndotl * rf * Math.sign(v), 0);
				g += plane.baseColor.g * Math.max(ndotl * gf * Math.sign(v), 0);
				b += plane.baseColor.b * Math.max(ndotl * bf * Math.sign(v), 0);
				
				const n = [ndotl * plane.normal.i, ndotl * plane.normal.j, ndotl * plane.normal.k];

				let h = new Vec3D(2 * n[0] - light.vec.x, 2 * n[1] - light.vec.y, 2 * n[2] - light.vec.z);
				h = Vec3D.normalize(h);

				const ndoth = (a.x * h.x - a.y * h.y + a.z * h.z);
				const m = 3;
				
				//specular highlights
				r += Math.max(Math.pow(ndoth, m) * 60, 0);
				g += Math.max(Math.pow(ndoth, m) * 60, 0);
				b += Math.max(Math.pow(ndoth, m) * 60, 0);
			} if(light instanceof AmbientLight) {
				r += plane.baseColor.r * rf;
				g += plane.baseColor.g * gf;
				b += plane.baseColor.b * bf;
			}
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

		if(t < .00001 || (t >= .99999 && t <= 1.00001)) return;

		let nx = dx * t;
		let ny = dy * t;
		let nz = dz * t;

		const x = p1.x + nx;
		const y = p1.y + ny;
		const z = p1.z + nz;

		const point = new Vec3D(x, y, z);

		return point;
	}

	static pointPrecedesPlane(point, plane) {
		const a = [point.x - plane.points[0].x, point.y - plane.points[0].y, point.z - plane.points[0].z];
		const b = [camera.pos.x - plane.points[0].x, camera.pos.y - plane.points[0].y, camera.pos.z - plane.points[0].z];

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
			front_plane.normal = p2.normal;

			back_plane = new Plane(back_points);
			back_plane.color = p2.color;
			back_plane.side = p2.side;
			back_plane.normal = p2.normal;
		}

		return [front_plane, back_plane];
	}
}

function Camera(pos, pitch = 0, yaw = 0, roll = 0) {
    this.pos = pos;

    this.UP = new Vec3D(0, 1, 0);
    this.FWD = new Vec3D(1, 0, 0);
    this.DIR = new Vec3D(0, 0, 1);

	this.f_plane = 800; //not really "fov" but serves the same function 
	this.nearClippingDist = .01;

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
			this.pitch -= .05;
		} else if(this.keydown.down && !this.keydown.up) {
			this.pitch += .05;
		}

		if(this.keydown.left && !this.keydown.right) {
			this.yaw += .05;
		} else if(this.keydown.right && !this.keydown.left) {
			this.yaw -= .05;
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
			this.pos.z += Math.cos(this.yaw) * Math.cos(this.pitch) * this.speed;
			this.pos.x -= Math.sin(this.yaw) * Math.cos(this.pitch) * this.speed;
			this.pos.y += Math.sin(this.pitch) * this.speed;
		} else if(this.keydown.s && !this.keydown.w) {
			this.pos.z -= Math.cos(this.yaw) * Math.cos(this.pitch) * this.speed;
			this.pos.x += Math.sin(this.yaw) * Math.cos(this.pitch) * this.speed;
			this.pos.y -= Math.sin(this.pitch) * this.speed;
		}

		if(this.keydown.a && !this.keydown.d) {
			this.pos.z += Math.cos(this.yaw + Math.PI/2) * this.speed;
			this.pos.x -= Math.sin(this.yaw + Math.PI/2) * this.speed;
		} else if(this.keydown.d && !this.keydown.a) {
			this.pos.z -= Math.cos(this.yaw + Math.PI/2) * this.speed;
			this.pos.x += Math.sin(this.yaw + Math.PI/2) * this.speed;
		}

		if(this.keydown.space && !this.keydown.shift) {
			this.pos.y -= this.speed;
		} else if(this.keydown.shift && !this.keydown.space) {
			this.pos.y += this.speed;
		}
	}

	this.project = function(vec) {
		const dif = Vec3D.dif(camera.pos, vec);
	
		const rotY = Vec3D.qRotate(dif, camera.UP, camera.yaw);
		const rotP = Vec3D.qRotate(rotY, camera.FWD, camera.pitch);
		const rotR = Vec3D.qRotate(rotP, camera.DIR, camera.roll);
	
		if(rotR.z < camera.nearClippingDist - .01) return null;
	
		let x = rotR.x * camera.f_plane / rotR.z + canvas.width / 2;
		let y = rotR.y * camera.f_plane / rotR.z + canvas.height / 2;

		return {x: x, y: y};
	}

    this.clipPath = function(curPoint, prevPoint, nextPoint) {
		let norm = new Vec3D(-Math.sin(camera.yaw) * Math.cos(camera.pitch),
							 Math.sin(camera.pitch),
							 Math.cos(camera.yaw) * Math.cos(camera.pitch)); 

		norm = Vec3D.normalize(norm);

		let pos = camera.pos.sum(norm.mult(camera.nearClippingDist));
		
		const plane = {
			normal: {
				i: norm.x,
				j: -norm.y,
				k: norm.z,
				d: pos.x * norm.x + pos.y * norm.y + pos.z * norm.z,
			}
		};
		
		let p1 = Plane.findLinePlaneIntercept(plane, curPoint, prevPoint);
		let p2 = Plane.findLinePlaneIntercept(plane, curPoint, nextPoint);

		if(p1) {
			let image = this.project(p1);

			if(image)
				c.lineTo(image.x, image.y);
		}

		if(p2) {
			let image = this.project(p2);
	
			if(image)
				c.lineTo(image.x, image.y);
		}
	};

	this.renderPlane = function(p) {
		let visible = false;
		
		c.beginPath();

		for(const [idx, point] of p.points.entries()) {
			const image = this.project(point);

			if(image) {
				visible = true;

				c.lineTo(image.x, image.y);
			} else {
				const prevPoint = idx <= 0 ? p.points[p.points.length - 1] : p.points[idx - 1];
				const nextPoint = idx >= p.points.length - 1 ? p.points[0] : p.points[idx + 1];

				this.clipPath(point, prevPoint, nextPoint);
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
		let bst = new SortedBinaryTree();
		for(let plane of env.planes) {
			plane.updateNormalVector();
			plane.color = Plane.calculateShading(plane, this, env.lights);

			bst.add(plane);
		}

        for(let plane of bst.iter()) {
			this.renderPlane(plane);
		}
	}
}

class DirectionalLight {
	constructor(vector, color) {
		this.vec = vector;
		this.color = color;
	}
}

class AmbientLight {
	constructor(color) {
		this.color = color;
	}
}

function Environment() {
	this.points = [];
	this.planes = [];
	this.lights = [];
	
    this.setup = function() {
	};
}