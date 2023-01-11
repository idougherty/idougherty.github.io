function clip(v1, v2, n, o) {
    let points = [];
    const d1 = n.dot(v1) - o;
    const d2 = n.dot(v2) - o;

    if(d1 >= 0) points.push(v1);

    if(d2 >= 0) points.push(v2);

    if(d1 * d2 < 0) {
        let e = Vec2D.dif(v1, v2);
        const u = d1 / (d1 - d2);
        e = e.mult(u);
        e.add(v1);

        points.push(e);
    }

    return points;
}

function debugLine(p1, p2, ctx, color = "red") {
    ctx.strokeStyle = color;
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}

function insertionSort(arr, lambda = (x) => x) {
    let val, j, i;
    for(i = 1; i < arr.length; i++) {
        val = arr[i];
        j = i - 1;

        while(j >= 0 && lambda(arr[j]) > lambda(val)) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = val;
    }
}

function polygonSupport(points, d) {
    let furthest = null;
    let dot = -Infinity;

    for(const point of points) {
        const proj = point.dot(d);
        if(proj > dot) {
            furthest = point;
            dot = proj;
        }
    }

    return furthest;
}

function minkowskiDifSupport(s1, s2, d) {
    return Vec2D.dif(polygonSupport(s2.points, d.mult(-1)), polygonSupport(s1.points, d));
}

function mean(arr) {
    let sum = 0;
    for(const el of arr) {
        sum += el;
    }
    return sum / arr.length;
}

function variance(arr) {
    let variance = 0;
    const mean = mean(arr);
    for(const el of arr) {
        const dif = el - mean;
        variance += dif * dif;
    }
    return variance / arr.length;
}

function calculateMassAndMoi(obj) {
    if(obj.material.density == Infinity)
        return [Infinity, Infinity];

    let mass = 0;
    // let center = new Vec2D(0, 0);
    let moi = 0;

    let prev = obj.shape.length - 1;
    for(let cur = 0; cur < obj.shape.length; cur++) {
        const a = obj.shape[prev];
        const b = obj.shape[cur];

        const areaStep = Math.abs(Vec2D.cross(a, b) / 2);
        const massStep = areaStep * obj.material.density;
        // const centerStep = a.addRet(b).div(3);
        const moiStep = massStep / 6 * (a.dot(a) + b.dot(b) + a.dot(b));

        mass += massStep
        // center.add(centerStep);
        moi += moiStep;
    }

    return [mass, moi];
}

const wood = {
    density: 1,
    restitution: .45,
    sFriction: .3,
    dFriction: .2,
};

const rubber = {
    density: 2.5,
    restitution: .95,
    sFriction: .6,
    dFriction: .4,
};

const wall = {
    density: Infinity,
    restitution: .5,
    sFriction: .24,
    dFriction: .16,
};

class Vec2D {
    static rotate(pivot, point, rad) {
        const dx = (point.x - pivot.x);
        const dy = (point.y - pivot.y);

        const sin = Math.sin(rad);
        const cos = Math.cos(rad);

        const nx = dx * cos - dy * sin; 
        const ny = dx * sin + dy * cos;

        return new Vec2D(nx, ny);
    }

    static mag(vec) {
        return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
    }
    
    static distance(v1, v2) {
        return Vec2D.mag(Vec2D.dif(v1, v2));
    }

    static normalize(vec) {
        if(vec.x == 0 && vec.y == 0) return new Vec2D(0, 0);
        const mag = Vec2D.mag(vec);
        return new Vec2D(vec.x / mag, vec.y / mag);
    }

    static dif(v1, v2) {
        return new Vec2D(v2.x - v1.x, v2.y - v1.y);
    }

    static tripleProd(v1, v2, v3) {
        const k = v1.x * v2.y - v1.y * v2.x;
        const nx = -v3.y * k;
        const ny = v3.x * k;
        return new Vec2D(nx, ny, 0);
    }

    static cross(A, B) {
        if(A.x == undefined) {
            // scalar x vector
            return new Vec2D(-A * B.y, A * B.x);
        } else if(B.x == undefined) {
            // vector x scalar
            return new Vec2D(B * A.y, -B * A.x);
        } else {
            // vector x vector
            return A.x * B.y - A.y * B.x;
        }
    }

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        this.x += other.x;
        this.y += other.y;
    }

    sub(other) {
        this.x -= other.x;
        this.y -= other.y;
    }

    scale(num) {
        this.x *= num;
        this.y *= num;
    }
    
    addRet(other) {
        return new Vec2D(this.x + other.x, this.y + other.y);
    }

    subRet(other) {
        return new Vec2D(this.x - other.x, this.y - other.y);
    }

    mult(num) {
        return new Vec2D(this.x * num, this.y * num);
    }

    div(num) {
        return new Vec2D(this.x / num, this.y / num);
    }

    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
}

class AABB {

    static findAABB(obj) {
        let b = new Vec2D(Infinity, Infinity);
        let e = new Vec2D(-Infinity, -Infinity);

        for(const point of obj.points) {
            b.x = Math.min(point.x, b.x);
            b.y = Math.min(point.y, b.y);

            e.x = Math.max(point.x, e.x);
            e.y = Math.max(point.y, e.y);
        }

        return new AABB(b, e);
    }

    constructor(b, e) {
        this.b = b;
        this.e = e;
    }

    update(obj) {
        this.b.add(new Vec2D(Infinity, Infinity));
        this.e.add(new Vec2D(-Infinity, -Infinity));

        for(const point of obj.points) {
            this.b.x = Math.min(point.x, this.b.x);
            this.b.y = Math.min(point.y, this.b.y);

            this.e.x = Math.max(point.x, this.e.x);
            this.e.y = Math.max(point.y, this.e.y);
        }
    }

    draw(ctx) {
        ctx.strokeStyle = this.color;
        ctx.strokeRect(this.b.x, this.b.y, this.e.x - this.b.x, this.e.y - this.b.y);
    }
}

class PhysObject {

    static findCOM(points) {
        let COM = new Vec2D(0, 0);
        
        for(const point of points) {
            COM.add(point);
        }

        COM.x /= points.length;
        COM.y /= points.length;

        return COM;
    }

    constructor(pos, points, material = wood) {
        this.force = new Vec2D(0, 0);
        this.acc = new Vec2D(0, 0);
        this.vel = new Vec2D(0, 0);
        this.pos = pos;

        this.torque = 0;
        this.rotAcc = 0;
        this.rotVel = 0;
        this.angle = 0;

        this.masks = [];

        const center = PhysObject.findCOM(points);
        points.forEach((p) => p.sub(center));
        this.shape = points;
        this.points = [];
        for(let i = 0; i < points.length; i++) {
            this.points[i] = Vec2D.rotate(new Vec2D(0, 0), this.shape[i], this.angle);
            this.points[i].add(this.pos);
        }

        this.material = material;
        const [mass, moi] = calculateMassAndMoi(this);

        this.mass = mass;
        this.moi = moi;
        
        this.AABB = AABB.findAABB(this);
        this.func = null;
    }

    // a force consists of a position vector and a direction vector
    applyForce(force) {
        const r = new Vec2D(force.pos.x - this.pos.x, force.pos.y - this.pos.y);

        this.force.add(force.dir);
        this.torque += r.x * force.dir.y - r.y * force.dir.x;
    }

    stepForces(dt) {
        this.acc = this.force.div(this.mass);
        
        if(this.mass == 0)
            this.acc = new Vec2D(0, 0);
        
        this.vel.add(this.acc.mult(dt));
        
        this.pos.add(this.vel.mult(dt));
        
        this.rotAcc = this.torque / this.moi;

        if(this.moi == 0)
            this.rotAcc = 0;
        
        this.rotVel += this.rotAcc * dt;

        this.angle += this.rotVel * dt;

        this.force = new Vec2D(0, 0);
        this.torque = 0;
    }

    update() {
        for(let i = 0; i < this.points.length; i++) {
            this.points[i] = Vec2D.rotate(new Vec2D(0, 0), this.shape[i], this.angle);
            this.points[i].add(this.pos);
        }

        this.AABB.update(this);
    }

    draw(ctx) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        for(const point of this.points) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();

        ctx.stroke();
    }
}

class PhysEnv {
    constructor(iterations = 1) {
        this.objects = [];
        this.intervals = [];
        this.sweepX = true;

        this.iterations = iterations;
    }

    addObject(obj) {
        let start = [obj.AABB.b, this.objects.length];
        let end = [obj.AABB.e, this.objects.length];
        
        this.intervals.push(start, end);
        this.objects.push(obj);
    }

    removeObject(obj) {
        let idx = -1;
        
        for(let i = 0; i < this.objects.length; i++) {
            if(obj == this.objects[i]) {
                idx = i;
                this.objects.splice(i, 1);
                break;
            }
        }

        for(let i = this.intervals.length - 1; i >= 0; i--) {
            if(idx == this.intervals[i][1]) {
                this.intervals.splice(i, 1);
            } else if(this.intervals[i][1] > idx) {
                this.intervals[i][1]--;
            }
        }
    }

    clearObjects() {
        this.objects = [];
        this.intervals = [];
    }

    sweepAndPrune() {
        let overlaps = [];
        let activeObjects = {};

        if(this.sweepX) {
            insertionSort(this.intervals, (x) => x[0].x);
        } else {
            insertionSort(this.intervals, (x) => x[0].y);
        }

        for(let i = this.intervals.length - 1; i >= 0; i--) {
            const node = this.intervals[i];
            if(activeObjects[node[1]] != null) {
                delete activeObjects[node[1]];
            } else {
                for(const key in activeObjects) {
                    if((this.objects[node[1]].mass == Infinity &&
                        this.objects[activeObjects[key]].mass == Infinity) || 
                       (this.objects[node[1]].mass == 0 &&
                        this.objects[activeObjects[key]].mass == 0))
                        continue;
                    overlaps.push([this.objects[node[1]], this.objects[activeObjects[key]]]);
                }

                activeObjects[node[1]] = node[1];
            }
        }

        // for(const node of this.intervals) {
        //     if(activeObjects[node[1]] != null) {
        //         delete activeObjects[node[1]];
        //     } else {
        //         for(const key in activeObjects) {
        //             overlaps.push([this.objects[node[1]], this.objects[activeObjects[key]]]);
        //         }

        //         activeObjects[node[1]] = node[1];
        //     }
        // }

        return overlaps;
    }

    update(dt) {
        this.stepForces(dt);
        for(let i = 0; i < this.iterations; i++) {
            this.detectCollisions();
        }
    }

    stepForces(dt) {
        for(const obj of this.objects) {
            obj.stepForces(dt);
            obj.update();
        }
    }

    detectCollisions() {
        let simplex = [];
        let possibleCollisions = this.sweepAndPrune();
        for(let [s1, s2] of possibleCollisions) {
            if((simplex = this.GJK(s1, s2))) {
                if(s1.func) s1.func(s1, s2);
                if(s2.func) s2.func(s2, s1);
                
                if(s1.mass == 0 || s2.mass == 0)
                    continue;

                let masked = false;

                for(let i = 0; i < s1.masks.length; i++) {
                    for(let j = 0; j < s2.masks.length; j++) {
                        if(s1.masks[i] == s2.masks[j]) {
                            masked = true;
                            
                            i = s1.masks.length;
                            j = s2.masks.length;
                        }
                    }
                }

                if(masked)
                    continue;

                let [normal, depth] = this.EPA(s1, s2, simplex);
                
                let contacts = this.findContacts(s1, s2, normal);

                if(contacts == null)
                    continue;

                for(const contact of contacts)
                    this.applyImpulses(s1, s2, normal, contact);

                this.resolveIntersections(s1, s2, normal, depth);

                s1.update();
                s2.update();
            }
        }
    }

    resolveIntersections(s1, s2, normal, depth) {
        const slop = .1;
        const percent = .85;
        const correction = Math.max(depth - slop, 0) * percent;
        const totalMass = s1.mass + s2.mass;
        if(s1.mass == Infinity && s2.mass == Infinity) {
            return;
        } else if(s1.mass == Infinity) {
            s2.pos.x += normal.x * correction;
            s2.pos.y += normal.y * correction;
        } else if(s2.mass == Infinity) {
            s1.pos.x -= normal.x * correction;
            s1.pos.y -= normal.y * correction;
        } else {
            s1.pos.x -= normal.x * correction * s2.mass / totalMass;
            s1.pos.y -= normal.y * correction * s2.mass / totalMass;
            
            s2.pos.x += normal.x * correction * s1.mass / totalMass;
            s2.pos.y += normal.y * correction * s1.mass / totalMass;
        }
    }

    applyImpulses(s1, s2, normal, contact) {
        const r1 = Vec2D.dif(s1.pos, contact);
        const v1 = s1.vel.addRet(Vec2D.cross(s1.rotVel, r1));

        const r2 = Vec2D.dif(s2.pos, contact);
        const v2 = s2.vel.addRet(Vec2D.cross(s2.rotVel, r2));

        const abVel = Vec2D.dif(v1, v2);
        const contactVel = abVel.dot(normal);

        if(contactVel >= 0)
            return;

        const armA = Vec2D.cross(r1, normal);
        const armB = Vec2D.cross(r2, normal);

        const rest = Math.min(s1.material.restitution, s2.material.restitution);

        const m = 1 / s1.mass + 1 / s2.mass + armA * armA / s1.moi + armB * armB / s2.moi; 
        const j = (-(rest + 1) * contactVel) / m;
        const impulse = normal.mult(j);

        s1.vel.sub(impulse.div(s1.mass));
        s2.vel.add(impulse.div(s2.mass));
        
        const r1CrossI = Vec2D.cross(r1, impulse);
        const r2CrossI = Vec2D.cross(r2, impulse);

        s1.rotVel -= r1CrossI / s1.moi;
        s2.rotVel += r2CrossI / s2.moi;

        const tangent = Vec2D.normalize(abVel.subRet(normal.mult(contactVel)));
        const jt = -abVel.dot(tangent) / m;

        const mu = Math.sqrt(s1.material.sFriction * s1.material.sFriction + s2.material.sFriction * s2.material.sFriction);

        if(Math.abs(jt) < j * mu) {
            var impulset = tangent.mult(jt);
        } else {
            const dFriction = Math.sqrt(s1.material.dFriction * s1.material.dFriction + s2.material.dFriction * s2.material.dFriction);
            var impulset = tangent.mult(-j * dFriction);
        }

        if(!isFinite(impulset.x) || !isFinite(impulset.y))
            return;

        s1.vel.sub(impulset.div(s1.mass));
        s2.vel.add(impulset.div(s2.mass));

        const r1CrossIt = Vec2D.cross(r1, impulset);
        const r2CrossIt = Vec2D.cross(r2, impulset);

        s1.rotVel -= r1CrossIt / s1.moi;
        s2.rotVel += r2CrossIt / s2.moi;
    }

    findContacts(s1, s2, normal) {
        const [p1, e1] = this.findCollisionEdge(s1, normal);
        const [p2, e2] = this.findCollisionEdge(s2, normal.mult(-1));

        const e1Dif = Vec2D.dif(e1[1], e1[0]);
        const e2Dif = Vec2D.dif(e2[1], e2[0]);

        let ref, pRef, eRef, inc, pInc, eInc;
        if(Math.abs(e1Dif.dot(normal)) <= Math.abs(e2Dif.dot(normal))) {
            pRef = p1;
            eRef = e1;
            ref = e1Dif;

            pInc = p2;
            eInc = e2;
            inc = e2Dif;
        } else {
            pRef = p2;
            eRef = e2;
            ref = e2Dif;

            pInc = p1;
            eInc = e1;
            inc = e1Dif;
        }

        const refV = Vec2D.normalize(ref).mult(-1);
        const o1 = refV.dot(eRef[0]);

        let cp = clip(eInc[0], eInc[1], refV, o1);

        if(cp.length < 2) return;

        const o2 = refV.dot(eRef[1]);
        
        cp = clip(cp[0], cp[1], refV.mult(-1), -o2);
        
        if(cp.length < 2) return;

        let refNorm = Vec2D.cross(ref, -1);
        
        const max = refNorm.dot(pRef);

        if(refNorm.dot(cp[1]) - max < 0)
            cp.splice(1, 1);

        if(refNorm.dot(cp[0]) - max < 0)
            cp.splice(0, 1);
    
        return cp;
    }

    findCollisionEdge(s, normal) {
        let v = null;
        let idx = null;
        let dot = -Infinity;
    
        for(const [i, point] of s.points.entries()) {
            const proj = point.dot(normal);
            if(proj > dot) {
                v = point;
                idx = i;
                dot = proj;
            }
        }
    
        const v0 = s.points[(idx - 1 + s.points.length) % s.points.length];
        const v1 = s.points[(idx + 1) % s.points.length];

        const leftEdge = Vec2D.dif(v, v0);
        const rightEdge = Vec2D.dif(v, v1);

        if(Vec2D.normalize(rightEdge).dot(normal) <= Vec2D.normalize(leftEdge).dot(normal)) {
            return [v, [v0, v], leftEdge];
        } else {
            return [v, [v, v1], rightEdge];
        }
    }

    GJK(s1, s2) {
        let d = Vec2D.normalize(Vec2D.dif(s1.pos, s2.pos));
        let simplex = [minkowskiDifSupport(s1, s2, d)];
        d = Vec2D.dif(simplex[0], new Vec2D(0, 0));

        while(true) {
            d = Vec2D.normalize(d);
            const A = minkowskiDifSupport(s1, s2, d);
            if(A.dot(d) < 0)
                return false;
            simplex.push(A);
            if(this.handleSimplex(simplex, d))
                return simplex;
        }
    }

    handleSimplex(simplex, d) {
        if(simplex.length == 2)
            return this.lineCase(simplex, d);
        return this.triangleCase(simplex, d);
    }

    lineCase(simplex, d) {
        let [B, A] = simplex;
        let AB = Vec2D.dif(A, B);
        let AO = Vec2D.dif(A, new Vec2D(0, 0));
        let ABperp = Vec2D.tripleProd(AB, AO, AB);
        d.x = ABperp.x;
        d.y = ABperp.y;
        return false;
    }

    triangleCase(simplex, d) {
        let [C, B, A] = simplex;

        let AB = Vec2D.dif(A, B);
        let AC = Vec2D.dif(A, C);
        let AO = Vec2D.dif(A, new Vec2D(0, 0));

        let ABperp = Vec2D.tripleProd(AC, AB, AB);
        let ACperp = Vec2D.tripleProd(AB, AC, AC);

        if(ABperp.dot(AO) > 0) {

            simplex.splice(0, 1);

            d.x = ABperp.x;
            d.y = ABperp.y;

            return false;
        } else if(ACperp.dot(AO) > 0) {

            simplex.splice(1, 1);

            d.x = ACperp.x;
            d.y = ACperp.y;

            return false;
        }
        return true;
    }

    // expanding polytope algorithm
    EPA(s1, s2, simplex) {
        while(true) {
            let [edgeDist, edgeNorm, edgeIDX] = this.findClosestEdge(simplex);
            let sup = minkowskiDifSupport(s1, s2, edgeNorm);

            const d = sup.dot(edgeNorm);
            
            if(d - edgeDist <= 0.01) {
                return [edgeNorm, edgeDist];
            } else {
                simplex.splice(edgeIDX, 0, sup);
            }
        }
    }

    findClosestEdge(simplex) {
        let dist = Infinity;
        let normal, idx;

        for(let i = 0; i < simplex.length; i++) {
            const j = (i + 1) % simplex.length;

            const edge = Vec2D.dif(simplex[i], simplex[j]);
            const n = Vec2D.normalize(Vec2D.tripleProd(edge, simplex[i], edge));

            const d = n.dot(simplex[i]);

            if(d < dist) {
                dist = d;
                normal = n;
                idx = j;
            }
        }

        return [dist, normal, idx];
    }

    drawObjects(ctx) {
        for(const obj of this.objects) {
            obj.draw(ctx);
        }
    }
}