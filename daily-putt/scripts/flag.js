class Flag {
    constructor(pos) {
        this.pos = pos;
        this.lift = 0; // 0 to 1
        this.threshold = 75;
    }

    tick() {
        const dist = Vec2D.mag(Vec2D.dif(this.pos, Game.ball.pos));
        const dl = .02;
        const max = Game.winState ? 1 : .5;

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
        const flagHeight = 20;
        const wave = 3 * Math.sin(Date.now() / 700);

        ctx.fillStyle = `rgba(220, 80, 80, ${1 - alpha})`;

        ctx.beginPath();
        ctx.moveTo(poleX, poleY);
        ctx.lineTo(poleX + flagWidth, poleY + flagHeight / 2 + wave);
        ctx.lineTo(poleX, poleY + flagHeight);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = `rgba(170, 170, 170, ${1 - alpha})`;
        ctx.lineWidth = poleWidth;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(poleX, poleY);
        ctx.lineTo(poleX, poleY + poleHeight + 2);
        ctx.stroke();
    }
}