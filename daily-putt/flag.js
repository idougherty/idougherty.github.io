class Flag {
    constructor(pos) {
        this.pos = pos;
        this.lift = 0; // 0 to 1
        this.threshold = 75;
    }

    tick(ball) {
        const dist = Vec2D.mag(Vec2D.dif(this.pos, ball.pos));
        const dl = .02;
        const max = ball.inHole ? 1 : .5;

        if(dist < this.threshold) {
            this.lift = this.lift + dl >= max ? max : this.lift + dl;
        } else {
            this.lift = this.lift - dl <= 0 ? 0 : this.lift - dl;
        }
    }

    draw(ctx) {
        const alpha = this.lift  * this.lift * (3 - 2 * this.lift);
        const poleWidth = 5;
        const poleHeight = 45;
        const poleX = this.pos.x;
        const poleY = this.pos.y - poleHeight - alpha * 50;
        const flagWidth = 25;
        const flagHeight = 15;

        ctx.fillStyle = `rgba(250, 70, 70, ${1 - alpha})`;

        ctx.beginPath();
        ctx.moveTo(poleX, poleY);
        ctx.lineTo(poleX + flagWidth, poleY + flagHeight / 2 + Math.sin(Date.now()/700)*3);
        ctx.lineTo(poleX, poleY + flagHeight);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = `rgba(185, 170, 130, ${1 - alpha})`;
        ctx.lineWidth = poleWidth;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(poleX, poleY);
        ctx.lineTo(poleX, poleY + poleHeight + 2);
        ctx.stroke();
    }
}