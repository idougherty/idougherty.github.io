let canvas = document.getElementById("paper");
let ctx = canvas.getContext("2d");
ctx.lineCap = "butt";

const lorenz = {
    center: new Vec3D(.13, .13, 25.87),
    trail: 1000,
    scale: 1.5,
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
    scale: 15,
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
    scale: 1.5,
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
    scale: 2.5,
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

// currently unstable
// const dequanLi = {
//     center: new Vec3D(0, 0, 0),
//     trail: 10000,
//     scale: .3,
//     particles: [[], [], [],],
//     leaders:   [new Vec3D(1.5, 3.2, 0.4),
//                 new Vec3D(3.0, 5.2, 1.4),
//                 new Vec3D(4.5, 7.2, 2.4),],

//     func: (v, dt) => {
//         const a = 40;
//         const c = 11.0/6.0;
//         const d = 0.16;
//         const e = 0.65;
//         const k = 55;
//         const f = 20;
    
//         const dx = a * (v.y - v.x) + d * v.x * v.z;
//         const dy = k * v.x + f * v.y - v.x * v.z;
//         const dz = c * v.z + v.x * v.y - e * v.x * v.x;
    
//         v.x += dx * dt * .03;
//         v.y += dy * dt * .03;
//         v.z += dz * dt * .03;
//     },
// };

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
    cam.yaw = 6 * Math.cos(curTime * .13);
    cam.pitch = .2 * Math.cos(curTime * .19);
    cam.roll = .2 * Math.cos(curTime * .2);

    const dist = 200;

    cam.pos.x = -Math.sin(-camera.yaw) * Math.cos(camera.pitch) * dist + anim.center.x;
    cam.pos.z = -Math.cos(-camera.yaw) * Math.cos(camera.pitch) * dist + anim.center.z;
    cam.pos.y = Math.sin(-camera.pitch) * dist + anim.center.y;
}

let anim = lorenzMod2;

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

function getTime() {
    let d = new Date();
    let t = d.getTime();
    return t / 1000;
}

let lastTime = getTime();
let curTime = lastTime;

setInterval(() => {
    lastTime = curTime;
    curTime = getTime();
    const dt = Math.min(.015, curTime - lastTime);

    updateCamera(camera, curTime);

    for(const [idx, leader] of anim.leaders.entries()) {
        anim.func(leader, dt);
        anim.particles[idx].push(new Vec3D(leader.x * anim.scale, leader.y * anim.scale, leader.z * anim.scale));

        if(anim.particles[idx].length > anim.trail)
            anim.particles[idx].splice(0, 1);
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#121212";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter";

    for(const particles of anim.particles) {
        let prev = null;
        let cur = null;

        for(const [idx, particle] of particles.entries()) {
            cur = project(camera, particle);
    
            if(prev && cur) {
                const interp = idx / particles.length;
                const h = 25 * curTime + 140 * interp;
                ctx.strokeStyle = "hsl("+Math.floor(h)+", 100%, 60%)";
                ctx.lineWidth = 3.5 * interp * interp + .5;
                
                if(ctx.lineWidth > .5) {
                    ctx.beginPath();
                    ctx.moveTo(prev.x + canvas.width/2, prev.y + canvas.height/2);
                    ctx.lineTo(cur.x + canvas.width/2, cur.y + canvas.height/2);
                    ctx.stroke();
                }
            }
    
            prev = cur;
        }
    }
}, 15);