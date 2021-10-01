// import {Track} from "./trackGenerator.js";
// const TrackGen = require('./trackGenerator');
// const Track = TrackGen.Track;

let canvas = document.getElementById("paper");
let ctx = canvas.getContext("2d");

let track;
let center = {x: canvas.width/2, y: canvas.height/2}
let drawTrack = true;
let drawMesh = false;

function generateTrack() {
    track = new Track(center);
    Track.genMesh(track);

    refreshCanvas(track);
}

function refreshCanvas() {
    ctx.fillStyle = "#080F0F";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if(drawTrack)
        track.draw(ctx);
    
    if(drawMesh)
        track.drawMesh(ctx);
}

generateTrack();