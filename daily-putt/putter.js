class Putter extends PhysObject {
    constructor(pos) {
        const shape = [
            new Vec2D(0, 0), 
            new Vec2D(0, 6), 
            new Vec2D(4, 10),
            new Vec2D(20, 10),
            new Vec2D(30, 4),
            new Vec2D(30, 0),
        ];

        super(pos, shape, wall);

        this.masks = ["putter-ball"];
        this.locked = false;

        this.func = (A, B) => {
            if(A.locked) {
                A.locked = false;
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = "#2224";

        ctx.beginPath();
        for(const point of this.points) {
            ctx.lineTo(point.x, point.y + 3);
        }
        ctx.closePath();

        ctx.fill();

        ctx.fillStyle = "#ddd";

        ctx.beginPath();
        for(const point of this.points) {
            ctx.lineTo(point.x, point.y + (this.locked ? 0 : -5));
        }
        ctx.closePath();

        ctx.fill();
    } 

    startSwing(ball, mouse) {
        this.locked = true;
        this.angle = Math.atan2(ball.pos.y - this.pos.y, ball.pos.x - this.pos.x) + Math.PI/2;
        this.pos = mouse.pos.mult(1); 
        this.vel.scale(0);
    }

    endSwing() {
        this.locked = false;
    }

    tick(ball, mouse) {
        this.vel.scale(.1);

        if(!this.locked) {
            this.angle = Math.atan2(ball.pos.y - this.pos.y, ball.pos.x - this.pos.x) + Math.PI/2;
            this.vel.add(Vec2D.dif(this.pos, mouse.pos).mult(30));
        } else {
            const lineToBall = Vec2D.dif(ball.pos, this.pos);
            const lineToMouse = Vec2D.dif(this.pos, mouse.pos);
            const scalar = lineToBall.dot(lineToMouse) / lineToBall.dot(lineToBall);
            const target = lineToBall.mult(scalar).addRet(this.pos);

            this.vel.add(Vec2D.dif(this.pos, target).mult(30));
        }
    }
}