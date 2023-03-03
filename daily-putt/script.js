const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const [teePos, holePos, backgroundImage] = generateTerrain();
ctx.putImageData(backgroundImage, 0, 0);

const physEnv = new PhysEnv(1);

const tee = new Vec2D(teePos[0], teePos[1]);
const hole = new Vec2D(holePos[0], holePos[1]);

const flag = new Flag(hole);

const ball = new Ball(tee);
physEnv.addObject(ball);

const pos = new Vec2D(canvas.width, canvas.height);
const putter = new Putter(pos);
physEnv.addObject(putter);

let tick = Date.now() / 16;

let emitter = new Emitter(hole, 0, 0);

function gameLoop() {
    const now = Date.now() / 16;

    while(tick < now) {
        ball.tick();
        putter.tick(ball, mouse);
        flag.tick(ball);
        emitter.tick();

        if(ball.inHole && emitter.period == 0) {
            emitter.period = 5;
            emitter.duration = 100;
        }

        physEnv.update(0.016);

        tick++;
    }

    //drawscreen
    ctx.putImageData(backgroundImage, 0, 0);

    ball.draw(ctx);
    flag.draw(ctx);
    putter.draw(ctx);
    emitter.draw(ctx);
    drawHUD(ctx);

    window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);

function drawHUD(ctx) {
    ctx.fillStyle = "white";
    ctx.font = "30px Coda";
    ctx.textBaseline = "bottom";
    ctx.textAlign = "center";
    ctx.fillText(`Strokes: ${ball.strokes}`, canvas.width/2, canvas.height - 10);
}

let mouse = {
    pos: new Vec2D(canvas.width, canvas.height),
    down: false,
}

document.addEventListener("mousedown", () => { 
    mouse.down = true;
    putter.startSwing(ball, mouse);
});

document.addEventListener("mouseup", (e) => {
    mouse.down = false;
    putter.endSwing();
});

document.addEventListener("mousemove", (e) => {
    const bounds = canvas.getBoundingClientRect();
    mouse.pos.x = e.clientX - bounds.x;
    mouse.pos.y = e.clientY - bounds.y;
});

document.addEventListener("touchstart", (e) => {
    e.preventDefault();

    mouse.down = true;
    putter.startSwing(ball, mouse);
});

document.addEventListener("touchend", (e) => {
    mouse.down = false;
    putter.endSwing();
});

document.addEventListener("touchmove", (e) => {
    const bounds = canvas.getBoundingClientRect();
    mouse.pos.x = e.touches[0].clientX - bounds.x;
    mouse.pos.y = e.touches[0].clientY - bounds.y;
});
