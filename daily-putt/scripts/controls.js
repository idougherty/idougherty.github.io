document.addEventListener("mousedown", () => {
    if(!Game.running)
        return;

    Game.mouse.down = true;
    Game.putter.startSwing(Game.ball, Game.mouse);
});

document.addEventListener("mouseup", (e) => {
    if(!Game.running)
        return;

    Game.mouse.down = false;
    Game.putter.endSwing();
});

document.addEventListener("mousemove", (e) => {
    if(!Game.running)
        return;

    const bounds = canvas.getBoundingClientRect();
    Game.mouse.pos.x = e.clientX - bounds.x;
    Game.mouse.pos.y = e.clientY - bounds.y;
});

// TODO: mobile?
// document.addEventListener("touchstart", (e) => {
//     if(!Game.playingState)
//         return;

//     e.preventDefault();

//     Game.mouse.down = true;
//     Game.putter.startSwing(Game.ball, Game.mouse);
// });

// document.addEventListener("touchend", (e) => {
//     if(!Game.playingState)
//         return;

//     Game.mouse.down = false;
//     Game.putter.endSwing();
// });

// document.addEventListener("touchmove", (e) => {
//     if(!Game.playingState)
//         return;

//     const bounds = canvas.getBoundingClientRect();
//     Game.mouse.pos.x = e.touches[0].clientX - bounds.x;
//     Game.mouse.pos.y = e.touches[0].clientY - bounds.y;
// });