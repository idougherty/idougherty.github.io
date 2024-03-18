class Vec3 {
    static mag(vec) {
        return Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
    }

    static normalize(vec) {
        if(vec.x == 0 && vec.y == 0 && vec.z == 0) return new Vec3(0, 0, 0);
        const mag = Vec3.mag(vec);
        return new Vec3(vec.x / mag, vec.y / mag, vecz / mag);
    }

    static dif(v1, v2) {
        return new Vec3(v2.x - v1.x, v2.y - v1.y, v2.z - v1.z);
    }

    static cross(v1, v2) {
        const i = v1.y * v2.z - v1.z * v2.y;
        const j = v1.x * v2.z - v1.z * v2.x;
        const k = v1.x * v2.y - v1.y * v2.x;
        return new Vec3(i, -j, k);
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
        return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    dif(other) {
        return new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    mult(num) {
        return new Vec3(this.x * num, this.y * num, this.z * num);
    }

    div(num) {
        return new Vec3(this.x / num, this.y / num, this.z / num);
    }

    dot(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }
}