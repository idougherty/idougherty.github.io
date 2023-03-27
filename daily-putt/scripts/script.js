const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

Menu.ctx = ctx;
Menu.drawBackground();

function gameloop() {
    const now = Date.now() / 16;
    
    while(Game.tick < now) {
        Game.update();
        Game.tick++;
    }
    
    Game.draw(ctx);

    if(Game.running)
        window.requestAnimationFrame(gameloop);
    else
        Menu.drawBackground();
}

if(window.location.host == "idougherty.github.io")
    window.location.href = "https://idougherty.net/daily-putt";