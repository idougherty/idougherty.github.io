let SPLASH_HEIGHT;
let ANIM_LEFT;
let C_HEIGHT;
let C_WIDTH;
let C_SCALE;

function resizeCanvas() {
    const w = visualViewport.width;
    const h = visualViewport.height;

	canvas.width = w;
    canvas.height = h;

    if(w < 768) {
		C_SCALE = 2;
        ANIM_LEFT = .5;
    } else {
        C_SCALE = w / (w + h) * 3.5;
        ANIM_LEFT = .75;
    }
    
	SPLASH_HEIGHT = document.getElementsByClassName("splash-container")[0].clientHeight / C_SCALE; 
    C_HEIGHT = document.getElementsByClassName("content-container")[0].clientHeight / C_SCALE;
    C_WIDTH = canvas.width / C_SCALE;

    ctx.scale(C_SCALE, C_SCALE);
    ctx.globalCompositeOperation = "lighter";
	ctx.lineJoin = "round";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


const lorenz = {
    center: new Vec3(.13, .13, 25.87),
    trail: 1000,
    scale: .8,
    idx: 0,
    particles: [[], [], []],
    leaders:   [new Vec3(-4.7834, -6.4119, 19.2778), 
                new Vec3(-4.8834, -6.4119, 19.2778), 
                new Vec3(-4.9834, -6.4119, 19.2778)],

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
    center: new Vec3(1, 0, 5.2),
    trail: 1000,
    scale: 10,
    idx: 0,
    particles: [[], [], [], [], []],
    leaders:   [new Vec3(0.0589, 0.0318, 0.3323),
                new Vec3(0.0689, 0.0318, 0.3323),
                new Vec3(0.0789, 0.0318, 0.3323),
                new Vec3(0.0889, 0.0318, 0.3323),
                new Vec3(0.0989, 0.0318, 0.3323),],

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
    center: new Vec3(1, -26, 5.2),
    trail: 1000,
    scale: 1,
    idx: 0,
    particles: [[], [], [], [], [],],
    leaders:   [new Vec3(0.04, 1.95, 3.19),
                new Vec3(0.14, 2.45, 3.29),
                new Vec3(0.24, 2.95, 3.39),
                new Vec3(0.34, 3.45, 3.49),
                new Vec3(0.44, 3.95, 3.59),],

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
    center: new Vec3(0, 0, 0),
    trail: 800,
    scale: 1.5,
    idx: 0,
    particles: [[], [], [],],
    leaders:   [new Vec3(-2.58, 5.13, -0.65),
                new Vec3(-2.58, 5.15, -0.65),
                new Vec3(-2.58, 5.17, -0.65),],

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
    const dif = Vec3.dif(cam.pos, vec);

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

    return new Vec3(W.i, W.j, W.k);
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
    pos: new Vec3(0, 0, -50),
    dir: new Vec3(0, 0, 1),
    f_plane: 1000,
    pitch: 0,
    yaw: 0,
    roll: 0,
    UP: new Vec3(0, 1, 0),
    FWD: new Vec3(1, 0, 0),
    DIR: new Vec3(0, 0, 1),
}

function drawAttractor(dt) {
	updateCamera(camera, curTime);

    for(const [idx, leader] of attractor.leaders.entries()) {
        attractor.func(leader, dt);
        
        let particle = new Vec3(leader.x * attractor.scale, leader.y * attractor.scale, leader.z * attractor.scale);
        
        attractor.particles[idx][attractor.idx] = particle;
    }
        
    for(const particles of attractor.particles) {
        let prev = null;
        let cur = null;
        let lastHue = null;

        for(let i = attractor.idx; i > attractor.idx - attractor.trail; i--) {
            const idx = (i + attractor.trail) % attractor.trail;
            const particle = particles[idx]; 

            if(particle == null)
                break;

            if(particle == 0)
                continue;

            cur = project(camera, particle);
    
            const offsetX = C_WIDTH * ANIM_LEFT;
            const offsetY = canvas.height / C_SCALE / 3 - scrollTop / C_HEIGHT * 100;

            cur.x *= C_SCALE;
            cur.y *= C_SCALE;

            cur.x += offsetX;
            cur.y += offsetY;

            if(prev && cur) {
                const interp = 1 - ((attractor.idx - i) / particles.length);
                const h = .015 * curTime + 140 * interp;

                if(lastHue == null) {
                    ctx.beginPath();
                    ctx.moveTo(prev.x, prev.y);
                    lastHue = h;
                }

                ctx.lineTo(cur.x, cur.y);
                
                if(lastHue != null && Math.abs(h - lastHue) > 5) {

                    ctx.strokeStyle = "hsl("+Math.floor(h)+", 100%, 60%)";
                    ctx.lineWidth = 3.5 * interp * interp + .5;

                    ctx.stroke();
                    lastHue = null;
                }
            }
    
            prev = cur;
        }
        ctx.stroke();
    }
    
    if((attractor.idx += 1) >= attractor.trail)
        attractor.idx = 0;
}

function drawBackground() {
    let x = C_WIDTH * ANIM_LEFT;
    let y = canvas.height / C_SCALE / 3 - scrollTop / C_HEIGHT * 100;

    const grd = ctx.createRadialGradient(x, y, 30, x, y, 300);
    grd.addColorStop(0, "#222");
    grd.addColorStop(1, "#111");

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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

let scrollTop;
function anim() {
	scrollTop = (document.documentElement || document.body.parentNode || document.body).scrollTop;

	let ms = getDT();
    let dt = Math.min(ms, 20) / 1500;

    ctx.globalCompositeOperation = "source-over";
    drawBackground();
    ctx.globalCompositeOperation = "lighter";
	drawAttractor(dt);

	window.requestAnimationFrame(anim);
}

let canvas, ctx;

window.addEventListener('resize', resizeCanvas);

window.addEventListener("load", () => {
    canvas = document.getElementById("bg-anim");
    ctx = canvas.getContext("2d", {alpha: false});

    resizeCanvas();
    anim();
})
