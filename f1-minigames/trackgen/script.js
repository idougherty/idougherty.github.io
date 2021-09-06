// import {Track} from "./trackGenerator.js";
// const TrackGen = require('./trackGenerator');
// const Track = TrackGen.Track;

let canvas = document.getElementById("paper");
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;

let center = {x: canvas.width/2, y: canvas.height/2}

let track = new Track(center);
Track.genMesh(track);

ctx.fillStyle = "#080F0F";
ctx.fillRect(0, 0, canvas.width, canvas.height);

track.draw(ctx);
track.drawMesh(ctx);