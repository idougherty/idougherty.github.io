class Putter extends PhysObject {
    constructor(pos) {
        const shape = [
            new Vec2D(0, 0), 
            new Vec2D(0, 10), 
            new Vec2D(5, 15),
            new Vec2D(18, 15),
            new Vec2D(30, 6),
            new Vec2D(30, 0),
        ];

        super(pos, shape, wall);

        this.masks = ["putter-ball"];
        this.locked = false;

        this.func = (A, B) => {
            if(A.locked)
                A.endSwing();
        }
    }

    draw(ctx) {
        const height = 6;

        ctx.fillStyle = "#2224";

        ctx.beginPath();
        for(const point of this.points) {
            ctx.lineTo(point.x, point.y + 3);
        }
        ctx.closePath();

        ctx.fill();

        ctx.fillStyle = "#888";

        for(let i = 0; i < height; i += 2) {
            ctx.beginPath();
            for(const point of this.points) {
                ctx.lineTo(point.x, point.y + (this.locked ? 0 - i : -5 - i));
            }
            ctx.closePath();
    
            ctx.fill();
        }

        ctx.fillStyle = "#aaa";

        ctx.beginPath();
        for(const point of this.points) {
            ctx.lineTo(point.x, point.y + (this.locked ? -height : -height - 5));
        }
        ctx.closePath();

        ctx.fill();
    } 

    startSwing(ball, mouse) {
        if(ball.vel.x != 0 && ball.vel.y != 0)
            return;
            
        this.locked = true;
        this.angle = Math.atan2(ball.pos.y - this.pos.y, ball.pos.x - this.pos.x) + Math.PI/2;
        this.pos = mouse.pos.mult(1); 
        this.vel.scale(0);
        this.masks = [];
    }

    endSwing() {
        this.locked = false;
        this.masks = ["putter-ball"];
    }

    tick(ball, mouse) {
        this.vel.scale(.1);

        if(!this.locked) {
            this.angle = Math.atan2(ball.pos.y - this.pos.y, ball.pos.x - this.pos.x) + Math.PI/2;
            this.vel.add(Vec2D.dif(this.pos, mouse.pos).mult(15));
        } else {
            const lineToBall = Vec2D.dif(ball.pos, this.pos);
            const lineToMouse = Vec2D.dif(this.pos, mouse.pos);
            const scalar = lineToBall.dot(lineToMouse) / lineToBall.dot(lineToBall);
            const target = lineToBall.mult(scalar).addRet(this.pos);

            this.vel.add(Vec2D.dif(this.pos, target).mult(15));
        }
    }
}