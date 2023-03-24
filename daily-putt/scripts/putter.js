class Putter extends PhysObject {
    constructor(pos) {
        const SIZE = 300;

        const shape = [
            new Vec2D(0, 0), 
            new Vec2D(0, SIZE), 
            new Vec2D(SIZE, SIZE),
            new Vec2D(SIZE, 0),
        ];

        super(pos, shape, wall);

        for(const point of this.shape) {
            point.y += SIZE/2 - 8;
        }

        this.meshShape = [
            new Vec2D(0, 0), 
            new Vec2D(0, 10), 
            new Vec2D(5, 15),
            new Vec2D(18, 15),
            new Vec2D(30, 6),
            new Vec2D(30, 0),
        ];
        
        const center = PhysObject.findCOM(this.meshShape);
        this.meshShape.forEach((p) => p.sub(center));

        this.mesh = [...this.meshShape];

        this.masks = ["putter-ball"];
        this.locked = false;

        this.func = (A, B) => {
            if(A.locked)
                A.endSwing();
        }
    }

    draw(ctx) {

        for(let i = 0; i < this.mesh.length; i++) {
            this.mesh[i] = Vec2D.rotate(new Vec2D(0, 0), this.meshShape[i], this.angle);
            this.mesh[i].add(this.pos);
        }

        const height = 8;

        ctx.fillStyle = "#2224";

        ctx.beginPath();
        for(const point of this.mesh) {
            ctx.lineTo(point.x, point.y + 3);
        }
        ctx.closePath();

        ctx.fill();

        ctx.fillStyle = "#888";

        for(let i = 0; i < height; i += 2) {
            ctx.beginPath();
            for(const point of this.mesh) {
                ctx.lineTo(point.x, point.y + (this.locked ? 0 - i : -5 - i));
            }
            ctx.closePath();
    
            ctx.fill();
        }

        ctx.fillStyle = "#aaa";

        ctx.beginPath();
        for(const point of this.mesh) {
            ctx.lineTo(point.x, point.y + (this.locked ? -height : -height - 5));
        }
        ctx.closePath();

        ctx.fill();

        const poleWidth = 6.5;
        const poleHeight = 60;
        const offset = Vec2D.rotate(new Vec2D(0, 0), new Vec2D(-9, 0), this.angle);
        const poleX = this.pos.x + offset.x;
        const poleY = this.pos.y - poleHeight + offset.y + (this.locked ? -height : -height - 5);

        ctx.lineWidth = poleWidth;
        ctx.lineCap = "round";

        ctx.strokeStyle = "#888";

        ctx.beginPath();
        ctx.moveTo(poleX, poleY + poleHeight * .25);
        ctx.lineTo(poleX, poleY + poleHeight);
        ctx.stroke();

        ctx.strokeStyle = "#555";

        ctx.beginPath();
        ctx.moveTo(poleX, poleY);
        ctx.lineTo(poleX, poleY + poleHeight * .25);
        ctx.stroke();
    } 

    startSwing() {
        const {ball, mouse} = Game;

        if(ball.vel.x != 0 && ball.vel.y != 0 || Game.winState)
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

    tick() {
        const {ball, mouse} = Game;

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