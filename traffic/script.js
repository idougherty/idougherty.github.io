window.onload = function() {
var canvas = document.getElementById("paper");
var c = canvas.getContext("2d");

var roads = {
    top: {
    }
}

function runsim() {
    c.fillStyle = "#385";
    c.fillRect(0, 0, 600, 600);
}

setInterval(runsim, 30);
};