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
        this.masks = ["putter-ball"];

        this.strokes = 0;

        this.func = (A, B) => {
            if(A.masks.length == 0)
                A.strokes++;
        };
    }

    tick() {
        // Apply gravity
        const GRAVITY_STRENGTH = 150;

        const normal = getNormal(this.pos.x, this.pos.y);

        this.applyForce({
            pos: this.pos,
            dir: new Vec2D(normal[0], normal[1]).mult(GRAVITY_STRENGTH * this.mass),
        });

        // Apply friction
        ball.vel.scale(.98);

        if(mouse.down && ball.masks.length > 0)
            ball.masks = [];
        else if(!mouse.down && ball.masks.length == 0)
            ball.masks = ["putter-ball"];

        if(Vec2D.mag(ball.vel) < 25 && Vec2D.mag(ball.force) / ball.mass < 60) {
            ball.force.x = 0;
            ball.force.y = 0;
            ball.vel.x = 0;
            ball.vel.y = 0;
        } else if(ball.masks.length == 0) {
            ball.masks = ["putter-ball"]
        }
    }
}