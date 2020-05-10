var canvas = document.getElementById("paper");
var c = canvas.getContext("2d");

function mod(a, n) {
  return a - Math.floor(a/n) * n;
}

function angleDif(a, b) {
  if(Math.abs(a-b) < Math.abs(Math.PI*2 - Math.abs(a-b)))
    return a - b;
  else 
    return -(Math.PI*2 - Math.abs(a-b));
}

function Camera() {
  this.x = -canvas.width/2;
  this.y = -canvas.height/2;
  this.height = 20;
  this.text = new Text("bjorn");

  this.draw = function() {
    c.fillStyle = "#334d36";

    if(player.win) {
      hue = Math.random()*360;
      lum = 5;
      sat = 30;
      c.fillStyle = "hsla("+hue+", "+sat+"%, "+lum+"%, .7)";
      c.globalCompositeOperation = "lighter";
    }
  
    c.fillRect(0, 0, canvas.width, canvas.height);
  
    this.x += (player.x - canvas.width/2 - this.x) / 3;
    this.y += (player.y - canvas.height/2 - this.y) / 3;
    this.height += (player.size - this.height) / 20;
    //this.height = player.size;

    environment.drawBackground(this.x, this.y, this.height);
    player.draw(this.x, this.y, this.height);
    environment.drawForeground(this.x, this.y, this.height);

    this.text.draw();

    //vignette
    var grd = c.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width);
    grd.addColorStop(0, "rgba(0, 0, 0, 0)");
    grd.addColorStop(1, "rgba(0, 0, 0, 1)");

    c.fillStyle = grd;
    c.fillRect(0, 0, canvas.width, canvas.height);
  }
}

let player = new Player();
let environment = new Environment();
let camera = new Camera();

for(let i = 0; i < 100; i++) {
  let t = new Tree(Math.random()*1400 - 700, Math.random()*1400 - 700, Math.random() * 5 + 10);
  t.setup();
  environment.trees.push(t);

  let r = new Detail(Math.random()*1400 - 700, Math.random()*1400 - 700, "rock");
  r.setup();
  environment.details.push(r);

  let w = new Detail(Math.random()*1400 - 700, Math.random()*1400 - 700, "weed");
  w.setup();
  environment.details.push(w);

  w = new Detail(Math.random()*1400 - 700, Math.random()*1400 - 700, "weed");
  w.setup();
  environment.details.push(w);

  w = new Detail(Math.random()*1400 - 700, Math.random()*1400 - 700, "weed");
  w.setup();
  environment.details.push(w);
}

document.body.addEventListener('keydown', function(e) {
  switch(e.which) {
    case 87:
      player.keyDown.up = true;
      break;
    case 83:
      player.keyDown.down = true;
      break;
    case 65:
      player.keyDown.left = true;
      break;
    case 68:
      player.keyDown.right = true;
      break;
    case 16:
      player.keyDown.shift = true;
      break;
    default:
  }
});

document.body.addEventListener('keyup', function(e) {
  switch(e.which) {
    case 87:
      player.keyDown.up = false;
      break;
    case 83:
      player.keyDown.down = false;
      break;
    case 65:
      player.keyDown.left = false;
      break;
    case 68:
      player.keyDown.right = false;
      break;
    case 16:
      player.keyDown.shift = false;
      break;
    default:
  }
});

canvas.addEventListener('mousedown', function(e) {
  player.bite(e.layerX, e.layerY);
  //tree1.push([e.layerX, e.layerY]);
});

setInterval(function() {
  player.update();
  environment.update();

  camera.draw();
}, 20);