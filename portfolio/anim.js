
class Vec3D {
    static mag(vec) {
        return Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
    }

    static normalize(vec) {
        if(vec.x == 0 && vec.y == 0 && vec.z == 0) return new Vec3D(0, 0, 0);
        const mag = Vec3D.mag(vec);
        return new Vec3D(vec.x / mag, vec.y / mag, vecz / mag);
    }

    static dif(v1, v2) {
        return new Vec3D(v2.x - v1.x, v2.y - v1.y, v2.z - v1.z);
    }

    static cross(v1, v2) {
        const i = v1.y * v2.z - v1.z * v2.y;
        const j = v1.x * v2.z - v1.z * v2.x;
        const k = v1.x * v2.y - v1.y * v2.x;
        return new Vec3D(i, -j, k);
    }

    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    extend(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
    }

    subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
    }

    scale(num) {
        this.x *= num;
        this.y *= num;
        this.z *= num;
    }
    
    sum(other) {
        return new Vec3D(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    dif(other) {
        return new Vec3D(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    mult(num) {
        return new Vec3D(this.x * num, this.y * num, this.z * num);
    }

    div(num) {
        return new Vec3D(this.x / num, this.y / num, this.z / num);
    }

    dot(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }
}

let canvas = document.getElementById("bg-anim");
let ctx = canvas.getContext("2d", {alpha: false});
    
let SPLASH_HEIGHT;
let ANIM_LEFT = .75;
let C_HEIGHT;
let C_WIDTH;
let C_SCALE = 1.5;
let parallax = 1.5;
let SCREEN_TYPE;

const MAX_DIST = 100;
let MAX_POINTS = 150;

function resizeCanvas() {
    const w = visualViewport.width;
    const h = visualViewport.height;

	canvas.width = w;
    canvas.height = h;

    if(w < 768) {
		C_SCALE = 1.65;
        ANIM_LEFT = .5;
    } else {
        C_SCALE = (w / (w + h)) * 3;
        ANIM_LEFT = .75;
    }
    
	SPLASH_HEIGHT = document.getElementsByClassName("splash-container")[0].clientHeight / C_SCALE; 
    C_HEIGHT = document.getElementsByClassName("content-container")[0].clientHeight / C_SCALE;
    C_WIDTH = canvas.width / C_SCALE;

    ctx.scale(C_SCALE, C_SCALE);
    ctx.globalCompositeOperation = "lighter";
	ctx.lineCap = "butt";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const lorenz = {
    center: new Vec3D(.13, .13, 25.87),
    trail: 1000,
    scale: .8,
    particles: [[], [], []],
    leaders:   [new Vec3D(-4.7834, -6.4119, 19.2778), 
                new Vec3D(-4.8834, -6.4119, 19.2778), 
                new Vec3D(-4.9834, -6.4119, 19.2778)],

    func: (v, dt) => {
        const P = 10;
        const R = 28;
        const B = 8/3;
    
        const dx = P * (v.y - v.x) * dt;
        const dy = (R * v.x - v.y - v.x * v.z) * dt;
        const dz = (v.x * v.y - B * v.z) * dt;    
    
        v.x += dx * .5;
        v.y += dy * .5;
        v.z += dz * .5;
    },
};

const aizawa = {
    center: new Vec3D(1, 0, 5.2),
    trail: 1000,
    scale: 10,
    particles: [[], [], [], [], []],
    leaders:   [new Vec3D(0.0589, 0.0318, 0.3323),
                new Vec3D(0.0689, 0.0318, 0.3323),
                new Vec3D(0.0789, 0.0318, 0.3323),
                new Vec3D(0.0889, 0.0318, 0.3323),
                new Vec3D(0.0989, 0.0318, 0.3323),],

    func: (v, dt) => {
        const e = .25;
        const a = .95;
        const c = .6;
        const d = 3.5;
        const b = .7;
        const f = .1;
    
        const dx = (v.z - b) * v.x - d * v.y;
        const dy = d * v.x + (v.z - b) * v.y;
        const dz = c + a * v.z - v.z * v.z * v.z / 3 - 
                    (v.x * v.x + v.y * v.y) * (1 + e * v.z)
                    + f * v.z * v.x * v.x * v.x;
    
        v.x += dx * dt;
        v.y += dy * dt;
        v.z += dz * dt;
    },
};

const rossler = {
    center: new Vec3D(1, -26, 5.2),
    trail: 1000,
    scale: 1,
    particles: [[], [], [], [], [],],
    leaders:   [new Vec3D(0.04, 1.95, 3.19),
                new Vec3D(0.14, 2.45, 3.29),
                new Vec3D(0.24, 2.95, 3.39),
                new Vec3D(0.34, 3.45, 3.49),
                new Vec3D(0.44, 3.95, 3.59),],

    func: (v, dt) => {
        const a = .2;
        const b = .2;
        const c = 5.7;
    
        const dx = v.z + a * v.x;
        const dy = b + -v.y * (v.z - c);
        const dz = -(-v.y + v.x);
    
        v.x += dx * dt * 2;
        v.y -= dy * dt * 2;
        v.z += dz * dt * 2;
    },
};

const lorenzMod2 = {
    center: new Vec3D(0, 0, 0),
    trail: 1000,
    scale: 1.5,
    particles: [[], [], [],],
    leaders:   [new Vec3D(-2.58, 5.13, -0.65),
                new Vec3D(-2.58, 5.15, -0.65),
                new Vec3D(-2.58, 5.17, -0.65),],

    func: (v, dt) => {
        const a = .9;
        const b = 5;
        const c = 9.9;
        const d = 1;
    
        const dx = -a * v.x + v.y * v.y - v.z * v.z + a * c;
        const dy = v.x * (v.y - b * v.z) + d;
        const dz = -v.z + v.x * (b * v.y + v.z);
    
        v.x += dx * dt * .34;
        v.y += dy * dt * .34;
        v.z += dz * dt * .34;
    },
};

function project(cam, vec) {
    const dif = Vec3D.dif(cam.pos, vec);

    const rotY = qRotate(dif, cam.UP, cam.yaw);
    const rotP = qRotate(rotY, cam.FWD, cam.pitch);
    const rotR = qRotate(rotP, cam.DIR, cam.roll);

    if(rotR.z < 0) return;

    let x = rotR.x * cam.f_plane / rotR.z;
    let y = rotR.y * cam.f_plane / rotR.z;
    
    return {x: x, y: y};
}

function qMult(A, B) {
    let C = {
        w: A.w * B.w - A.i * B.i - A.j * B.j - A.k * B.k,
        i: A.w * B.i + A.i * B.w + A.j * B.k - A.k * B.j,
        j: A.w * B.j - A.i * B.k + A.j * B.w + A.k * B.i,
        k: A.w * B.k + A.i * B.j - A.j * B.i + A.k * B.w,
    };
    
    return C;
}

function qRotate(vec, axis, angle) {
    let V = {
        w: 0,
        i: vec.x,
        j: vec.y,
        k: vec.z,
    };

    const cosA = Math.cos(angle/2);
    const sinA = Math.sin(angle/2);

    let R = {
        w: cosA,
        i: axis.x * sinA,
        j: axis.y * sinA,
        k: axis.z * sinA,
    };

    let R1 = {
        w: R.w,
        i: -R.i,
        j: -R.j,
        k: -R.k,
    };

    let W = qMult(qMult(R, V), R1);

    return new Vec3D(W.i, W.j, W.k);
}

function updateCamera(cam, curTime) {
    cam.yaw = curTime * .00005;
    cam.pitch = .2 * Math.cos(curTime * .000019);
    cam.roll = .2 * Math.cos(curTime * .00002);

    const dist = 200;

    cam.pos.x = -Math.sin(-camera.yaw) * Math.cos(camera.pitch) * dist + attractor.center.x;
    cam.pos.z = -Math.cos(-camera.yaw) * Math.cos(camera.pitch) * dist + attractor.center.z;
    cam.pos.y = Math.sin(-camera.pitch) * dist + attractor.center.y;
}

let camera = {
    pos: new Vec3D(0, 0, -50),
    dir: new Vec3D(0, 0, 1),
    f_plane: 1000,
    pitch: 0,
    yaw: 0,
    roll: 0,
    UP: new Vec3D(0, 1, 0),
    FWD: new Vec3D(1, 0, 0),
    DIR: new Vec3D(0, 0, 1),
}

function attractorAnim(dt) {
	updateCamera(camera, curTime);

    for(const [idx, leader] of attractor.leaders.entries()) {
        attractor.func(leader, dt);
        attractor.particles[idx].push(new Vec3D(leader.x * attractor.scale, leader.y * attractor.scale, leader.z * attractor.scale));

        if(attractor.particles[idx].length > attractor.trail)
            attractor.particles[idx].splice(0, 1);
    }

    for(const particles of attractor.particles) {
        let prev = null;
        let cur = null;

        for(const [idx, particle] of particles.entries()) {
            cur = project(camera, particle);
    
            const offsetX = C_WIDTH * ANIM_LEFT;
            const offsetY = SPLASH_HEIGHT / 2 - scrollTop / C_HEIGHT * 100;

            cur.x *= C_SCALE;
            cur.y *= C_SCALE;

            cur.x += offsetX;
            cur.y += offsetY;

            if(prev && cur) {
                const interp = idx / particles.length;
                const h = .015 * curTime + 140 * interp;
                ctx.strokeStyle = "hsl("+Math.floor(h)+", 100%, 60%)";
                ctx.lineWidth = 3.5 * interp * interp + .5;

                if(ctx.lineWidth > .5) {
                    ctx.beginPath();
                    ctx.moveTo(prev.x, prev.y);
                    ctx.lineTo(cur.x, cur.y);
                    ctx.stroke();
                }
            }
    
            prev = cur;

            if(cur.x < bounds.left) bounds.left = cur.x;
            if(cur.x > bounds.right) bounds.right = cur.x;
            if(cur.y < bounds.top) bounds.top = cur.y;
            if(cur.y > bounds.bottom) bounds.bottom = cur.y;
        }
    }
}

let lastTime = 0;
let curTime = new Date().getTime();
function getDT() {
    lastTime = curTime;
    curTime = new Date().getTime();
    return curTime - lastTime;
} 

let attractors = [aizawa, lorenz, lorenzMod2];
let attractor = attractors[Math.floor(Math.random() * attractors.length)];

let dt = 0;
let scrollTop;
let bounds;
function anim() {
	dt = getDT();
	scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

    if(bounds)
        ctx.clearRect(bounds.left - 10, bounds.top - 10, bounds.right - bounds.left + 20, bounds.bottom - bounds.top + 20);
    
    bounds = {
        left: Infinity,
        right: -Infinity,
        top: Infinity,
        bottom: -Infinity,
    };

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#121212";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter";

	attractorAnim(Math.min(dt, 20) / 1500);

	window.requestAnimationFrame(anim);
}
anim();
