import {Track} from "./trackGenerator.js";

let canvas = document.getElementById("paper");
let c = canvas.getContext("2d");
c.imageSmoothingEnabled = false;
c.mozImageSmoothingEnabled = false;

let center = {x: canvas.width/2, y: canvas.height/2}

let track = new Track(center);
Track.genMesh(track);

c.fillStyle = "#080F0F";
c.fillRect(0, 0, canvas.width, canvas.height);

track.draw(c);