const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const backgroundImage = createBackground();

const physEnv = new PhysEnv(1);

const tee = new Vec2D(canvas.width/2, canvas.height/2);

const ball = new Ball(tee);
physEnv.addObject(ball);

const pos = new Vec2D(canvas.width, canvas.height);
const putter = new Putter(pos);
physEnv.addObject(putter);

let tick = Date.now() / 16;

function gameLoop() {
    const now = Date.now() / 16;

    while(tick < now) {
        ball.tick();
        putter.tick(ball, mouse);

        physEnv.update(0.016);

        tick++;
    }

    //drawscreen
    ctx.putImageData(backgroundImage, 0, 0);
    physEnv.drawObjects(ctx);

    window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);

// ctx.putImageData(backgroundImage, 0, 0);

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
