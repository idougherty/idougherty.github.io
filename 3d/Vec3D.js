
class Vec3D {
    static mag(vec) {
        return Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
    }

    static normalize(vec) {
        if(vec.x == 0 && vec.y == 0 && vec.z == 0) return new Vec3D(0, 0, 0);
        const mag = Vec3D.mag(vec);
        return new Vec3D(vec.x / mag, vec.y / mag, vec.z / mag);
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

    static qMult(A, B) {
        let C = {
            w: A.w * B.w - A.i * B.i - A.j * B.j - A.k * B.k,
            i: A.w * B.i + A.i * B.w + A.j * B.k - A.k * B.j,
            j: A.w * B.j - A.i * B.k + A.j * B.w + A.k * B.i,
            k: A.w * B.k + A.i * B.j - A.j * B.i + A.k * B.w,
        };
        
        return C;
    }

    static qRotate(vec, axis, angle) {
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
    
        let W = Vec3D.qMult(Vec3D.qMult(R, V), R1);
    
        return new Vec3D(W.i, W.j, W.k);
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