const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

Game.setup(69);

// ctx.putImageData(backgroundImage, 0, 0);
window.requestAnimationFrame(Game.update);

function drawGuide(ctx, ball, putter) {
    if(!putter.locked)
        return;

    const d = Vec2D.normalize(Vec2D.dif(ball.pos, putter.pos));
    const endPoint = d.mult(-100).addRet(ball.pos);

    ctx.lineWidth = 6;
    ctx.strokeStyle = "#FFFC";
    ctx.setLineDash([0, 30]);

    ctx.beginPath();
    ctx.moveTo(ball.pos.x, ball.pos.y);
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

function drawHUD(ctx) {
    ctx.fillStyle = "white";
    ctx.font = "30px Coda";
    ctx.textBaseline = "bottom";
    ctx.textAlign = "center";

    ctx.shadowColor = "#000";
    ctx.shadowBlur = 5;

    ctx.fillText(`Strokes: ${ball.strokes}`, canvas.width/2, canvas.height - 10);

    ctx.shadowBlur = 0;
}