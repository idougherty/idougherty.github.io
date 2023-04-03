class Game {
    static mouse = {
        pos: new Vec2D(canvas.width/2, canvas.height/2),
        down: false,
    }

    static running = false;
    static winState = false;
    static mode = null;
    static curHole = 0;
    static numHoles = 0;
    static score = 0;

    static async getScore(mode) {
        if(mode == "endless")
            return null;

        const storageString = this.getModeString(mode);
        let score = await fetchScore(mode);

        if(score) {
            localStorage.setItem(storageString, score);
        } else {
            score = localStorage.getItem(storageString);

            const user = getUser();
            if(user && score)
                submitScore(user, mode, score);
        }

        return score;
    }

    static async saveScore() {
        const user = getUser();
        if(user)
            await submitScore(user, this.mode, this.score);

        const storageString = this.getModeString(this.mode);
        const lastScore = localStorage.getItem(storageString);
        
        if(!lastScore || lastScore > this.score)
            localStorage.setItem(storageString, this.score);
    }

    static getDay() {
        const offset = (new Date()).getTimezoneOffset() * 60 * 1000;
        return Math.floor((Date.now() - offset)/8.64e7);
    }

    static getWeek() {
        // 1/1/1970 was a Thursday
        return Math.floor((this.getDay() + 4) / 7);
    }

    static getModeString(mode) {
        const date = mode == "weekly-9-hole" ? this.getWeek() : this.getDay();
        return `${date}-${mode}`;
    }

    static startMode(mode) {
        this.mode = mode;

        switch(mode) {
            case "daily-putt":
                this.numHoles = 1;
                break;
            case "daily-3-hole":
                this.numHoles = 3;
                break;
            case "weekly-9-hole":
                this.numHoles = 9;
                break;
            case "endless":
                this.numHoles = Infinity;
                break;
            default:
                throw Error("bad");
        }

        this.score = 0;
        this.curHole = 1;
        const seed = this.getSeed(this.mode, this.curHole);
        this.setup(seed);
        this.running = true;

        gameloop();
    }

    static advanceHole() {
        Menu.hide("continue-btn");
        Menu.hide("continue-back-btn");
        
        this.curHole++;

        if(this.curHole > this.numHoles) {
            this.stopGame();
        } else {
            const seed = this.getSeed(this.mode, this.curHole);
            this.setup(seed);
        }
    }

    static async stopGame() {
        this.running = false;

        if(this.curHole > this.numHoles) {
            await this.saveScore();
            Menu.changeScreen(this.mode);
        } else {
            Menu.changeScreen("splash");
        }
    }

    static getSeed(mode, hole) {
        if(mode == "endless")
            return Date.now();

        const date = mode == "weekly-9-hole" ? this.getWeek() : this.getDay();
        const str = date + (hole-1) * 1e5 + mode.length * 1e6 + ""

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
        this.ball.strokes = 0;

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
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 5;
    
        ctx.font = "40px Coda";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        ctx.fillText(modeToText(this.mode), canvas.width/2, 20);
        
        ctx.font = "35px Coda";
        ctx.textBaseline = "bottom";
        ctx.textAlign = "left";
        ctx.fillText(`Strokes: ${this.ball.strokes + this.score}`, 40, canvas.height - 10);

        ctx.textAlign = "right";
        const totalHoles = this.mode == "endless" ? "∞" : this.numHoles;
        ctx.fillText(`Hole: ${this.curHole}/${totalHoles}`, canvas.width - 40, canvas.height - 10);
    
        ctx.shadowBlur = 0;
    }
}

function modeToText(mode) {
    switch(mode) {
        case "weekly-9-hole":
            return "Weekly 9-Hole";
        case "daily-putt":
            return "Daily Putt";
        case "daily-3-hole":
            return "Daily 3-Hole";
        case "endless":
            return "Endless";
        default:
            return mode;
    }
}