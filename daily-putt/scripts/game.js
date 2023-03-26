class Game {
    static mouse = {
        pos: new Vec2D(canvas.width/2, canvas.height/2),
        down: false,
    }

    static running = false;
    static winState = false;
    static mode = null;
    static holes = 0;
    static score = 0;

    static async getScore(mode) {
        if(mode == "endless")
            return null;

        const day = this.getDay();

        let score = await fetchScore(mode);

        if(score) {
            localStorage.setItem(`${day}-${mode}`, score);
        } else {
            score = localStorage.getItem(`${day}-${mode}`);

            const user = getUser();
            if(user)
                submitScore(user, mode, score);
        }

        return score;
    }

    static saveScore() {
        const user = getUser();
        if(user)
            submitScore(user, this.mode, this.score);

        const day = this.getDay();
        localStorage.setItem(`${day}-${this.mode}`, this.score);
    }

    static getDay() {
        const offset = (new Date()).getTimezoneOffset() * 60 * 1000;
        return Math.floor((Date.now() - offset)/8.64e7);
    }

    static startMode(mode) {
        this.mode = mode;

        switch(mode) {
            case "daily-putt":
                this.holes = 0;
                break;
            case "daily-3-hole":
                this.holes = 3;
                break;
            case "endless":
                this.holes = Infinity;
                break;
            default:
                throw Error("bad");
        }

        const seed = this.getSeed(this.mode, this.holes);
        this.setup(seed);
        this.running = true;
        this.score = 0;

        gameloop();
    }

    static advanceHole() {
        Menu.hide("continue-btn");
        Menu.hide("continue-back-btn");
        
        this.holes--;

        if(this.holes <= 0) {
            this.stopGame();
        } else {
            const seed = this.getSeed(this.mode, this.holes);
            this.setup(seed);
        }
    }

    static stopGame() {
        this.running = false;

        if(this.holes <= 0) {
            this.saveScore();
            Menu.changeScreen(this.mode);
            google.accounts.id.prompt();
        } else {
            Menu.changeScreen("splash");
        }
    }

    static getSeed(mode, hole) {
        if(this.mode == "endless")
            return Date.now();

        const str = this.getDay() + hole * 1e5 + mode.length * 1e6 + ""

        const hash = str.split('').reduce((prevHash, currVal) =>
            (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);

        return hash;
    }

    static setup(seed) {
        const [teePos, holePos, backgroundImage] = generateTerrain(seed);
        this.backgroundImage = backgroundImage;

        this.physEnv = new PhysEnv(1);

        this.tee = new Vec2D(teePos[0], teePos[1]);
        this.hole = new Vec2D(holePos[0], holePos[1]);

        this.flag = new Flag(this.hole);

        this.ball = new Ball(this.tee);
        this.physEnv.addObject(this.ball);

        const pos = new Vec2D(canvas.width, canvas.height);
        this.putter = new Putter(pos);
        this.physEnv.addObject(this.putter);

        this.tick = Date.now() / 16;

        this.particles = new ParticleHandler(this.hole, 0, 0);

        this.winState = false;
    }

    static onWin() {
        let emitter = () => {
            const pos = new Vec2D(this.ball.pos.x, this.ball.pos.y);
            const theta = Math.random() * 2 * Math.PI;
            const mag = Math.random() * 1;
            const vel = new Vec2D(mag*Math.cos(theta), mag*Math.sin(theta) - 3);
            const acc = new Vec2D(0, .01);
            const lifespan = Math.random()*150 + 100;

            return new Particle(pos, vel, acc, lifespan);
        }

        this.particles.registerEmitter(emitter, 100, 4);

        this.winState = true;
        this.score += this.ball.strokes;

        if(this.mode == "endless") {
            Menu.unhide("continue-back-btn");
        } else {
            Menu.unhide("continue-btn");
        }
    }

    static update() {
        this.ball.tick();
        this.putter.tick();
        this.flag.tick();
        this.particles.tick();

        this.physEnv.update(0.016);
    }

    static draw(ctx) {
        //draw background
        ctx.putImageData(this.backgroundImage, 0, 0);

        this.drawGuide(ctx);
        this.ball.draw(ctx);
        this.flag.draw(ctx);
        this.putter.draw(ctx);
        this.particles.draw(ctx);
        this.drawHUD(ctx);
    }

    static drawGuide(ctx) {
        if(!this.putter.locked)
            return;
    
        const d = Vec2D.normalize(Vec2D.dif(this.ball.pos, this.putter.pos));
        const endPoint = d.mult(-100).addRet(this.ball.pos);
    
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#FFFC";
        ctx.setLineDash([0, 30]);
    
        ctx.beginPath();
        ctx.moveTo(this.ball.pos.x, this.ball.pos.y);
        ctx.lineTo(endPoint.x, endPoint.y);
    
        ctx.globalCompositeOperation = "exclusion";
        ctx.stroke();
    
        ctx.strokeStyle = "#FFF";
        ctx.globalCompositeOperation = "saturation";
        ctx.stroke();
    
        ctx.strokeStyle = "#444";
        ctx.globalCompositeOperation = "lighter";
        ctx.stroke();
        
        ctx.globalCompositeOperation = "source-over";
        ctx.setLineDash([]);
    }
    
    static drawHUD(ctx) {
        ctx.fillStyle = "white";
        ctx.font = "30px Coda";
        ctx.textBaseline = "bottom";
        ctx.textAlign = "center";
    
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 5;
    
        ctx.fillText(`Strokes: ${this.ball.strokes}`, canvas.width/2, canvas.height - 10);
    
        ctx.shadowBlur = 0;
    }
}