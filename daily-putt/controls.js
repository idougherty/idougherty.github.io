document.addEventListener("mousedown", () => { 
    Game.mouse.down = true;
    Game.putter.startSwing(Game.ball, Game.mouse);
});

document.addEventListener("mouseup", (e) => {
    Game.mouse.down = false;
    Game.putter.endSwing();
});

document.addEventListener("mousemove", (e) => {
    const bounds = canvas.getBoundingClientRect();
    Game.mouse.pos.x = e.clientX - bounds.x;
    Game.mouse.pos.y = e.clientY - bounds.y;
});

document.addEventListener("touchstart", (e) => {
    e.preventDefault();

    Game.mouse.down = true;
    Game.putter.startSwing(Game.ball, Game.mouse);
});

document.addEventListener("touchend", (e) => {
    Game.mouse.down = false;
    Game.putter.endSwing();
});

document.addEventListener("touchmove", (e) => {
    const bounds = canvas.getBoundingClientRect();
    Game.mouse.pos.x = e.touches[0].clientX - bounds.x;
    Game.mouse.pos.y = e.touches[0].clientY - bounds.y;
});