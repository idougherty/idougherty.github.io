class Game {
    static mouse = {
        pos: new Vec2D(canvas.width/2, canvas.height/2),
        down: false,
    }

    static setup(seed) {
        const [teePos, holePos, backgroundImage] = generateTerrain(seed);
        ctx.putImageData(backgroundImage, 0, 0);

        this.physEnv = new PhysEnv(1);

        const tee = new Vec2D(teePos[0], teePos[1]);
        const hole = new Vec2D(holePos[0], holePos[1]);

        this.flag = new Flag(hole);

        this.ball = new Ball(tee);
        this.physEnv.addObject(this.ball);

        const pos = new Vec2D(canvas.width, canvas.height);
        this.putter = new Putter(pos);
        this.physEnv.addObject(this.putter);

        this.tick = Date.now() / 16;

        this.emitter = new Emitter(hole, 0, 0);
    }

    static step() {
        this.ball.tick();
        this.putter.tick(this.ball, this.mouse);
        this.flag.tick(this.ball);
        this.emitter.tick();

        if(this.ball.inHole && this.emitter.period == 0) {
            emitter.period = 5;
            emitter.duration = 100;
        }

        this.physEnv.update(0.016);
    }

    static draw(ctx) {
        //draw background
        ctx.putImageData(this.backgroundImage, 0, 0);

        drawGuide(ctx, this.ball, this.putter);
        this.ball.draw(ctx);
        this.flag.draw(ctx);
        this.putter.draw(ctx);
        this.emitter.draw(ctx);
        drawHUD(ctx);
    }

    static update(ctx) {
        const now = Date.now() / 16;
        console.log(this);

        while(this.tick < now) {
            Game.step();
            Game.tick++;
        }

        Game.draw(ctx);
        window.requestAnimationFrame(Game.update);
    }
}