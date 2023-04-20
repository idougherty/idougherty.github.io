class Ball extends PhysObject {
    constructor(pos) {
        const ball_material = {
            density: 1,
            restitution: 0,
            sFriction: .24,
            dFriction: .16,
        };

        let shape = [];
        for(let a = 0; a < Math.PI * 2; a += Math.PI * 2 / 8) {
            shape.push(new Vec2D(Math.cos(a), Math.sin(a)).mult(5));
        }

        super(pos, shape, ball_material);
        this.moi = Infinity;
        this.masks = ["ball-putter"];

        this.strokes = 0;
        this.lastPos = this.pos;

        this.func = (A, B) => {
            if(B.locked) {
                const scale = 17*Math.pow(Vec2D.mag(B.vel)/8, .8);
                console.log(Vec2D.mag(B.vel), scale);
                A.vel = Vec2D.normalize(B.vel).mult(scale);
                B.endSwing();
                A.strokes++;
            }
        };
    }

    draw(ctx) {
        ctx.fillStyle = "#2224";

        ctx.beginPath();
        for(const point of this.points) {
            ctx.lineTo(point.x, point.y + 3);
        }
        ctx.closePath();

        ctx.fill();

        ctx.fillStyle = "white";

        ctx.beginPath();
        for(const point of this.points) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();

        ctx.fill();
    } 

    tick() {
        // Apply gravity
        const GRAVITY_STRENGTH = 90;

        const normal = getNormal(this.pos.x, this.pos.y);
        const height = sampleHeight(this.pos.x, this.pos.y);

        const { hole } = Game;

        let friction = .97;

        if(height <= WATER_LEVEL) {
            this.force.x = 0;
            this.force.y = 0;
            this.vel.x = 0;
            this.vel.y = 0;
            this.pos = this.lastPos.mult(1);
            // this.strokes++; EXTRA STROKE FOR WATER HAZARD
        } else if(height <= SAND_LEVEL) {
            friction = .95;
        }

        if(Vec2D.mag(Vec2D.dif(Game.hole, this.pos)) <= HOLE_RADIUS) {
            if(this.vel.x == 0 && this.vel.y == 0 && !Game.winState) 
                Game.onWin();
            
            friction = .75;

            this.applyForce({
                pos: this.pos,
                dir: Vec2D.dif(this.pos, hole).mult(400 * this.mass),
            });
        }

        this.applyForce({
            pos: this.pos,
            dir: new Vec2D(normal[0], normal[1]).mult(GRAVITY_STRENGTH * this.mass),
        });

        // Apply friction
        this.vel.scale(friction);

        if(Vec2D.mag(this.vel) < 25 && Vec2D.mag(this.force) / this.mass < 60) {
            this.force.x = 0;
            this.force.y = 0;
            this.vel.x = 0;
            this.vel.y = 0;
            this.lastPos = this.pos.mult(1);
        }
    }
}