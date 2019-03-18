var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var gridsize = 8;

var particles = [];

function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.radius = Math.random()*gridsize/2;
    this.color = "hsl("+Math.floor(Math.random()*360)+", 70%, 60%)";
    this.vx = 0;
    this.vy = 0;
    this.state = "frozen";
    
    this.update = function() {
      switch(this.state) {
        case "frozen":
          this.radius = (this.radius > .5) ? this.radius-Math.random()*.2 : gridsize/2;
          break;
        case "explode":
          this.x += this.vx;
          this.y += this.vy;
          this.radius -= .02;
          break;
        default:
      }
      this.draw();
    };
    
    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    };
    
    this.updateVelocityToMouse = function(mx, my) {
      
    };
}

function textToParticles(text) {
  particles = [];
  c.clearRect(0, 0, canvas.width, canvas.height);
  
  c.fillStyle = "black";
  c.textAlign = "center";
  c.font = "bold 240px Arial";
  c.fillText(text, canvas.width/2, canvas.height/2, canvas.width);

  var idata = c.getImageData(0, 0, canvas.width, canvas.height);

  var buffer32 = new Uint32Array(idata.data.buffer);
  
  for (var y = 0; y < canvas.height; y += gridsize) {
    for (var x = 0; x < canvas.width; x += gridsize) {
      if (buffer32[y * canvas.width + x] != 0) {
        particles.push(new Particle(x, y));
      }
    }
  }
  c.clearRect(0, 0, canvas.width, canvas.height);
}

textToParticles("hi mom");

document.addEventListener("click", function(e) {
  for(var i = particles.length-1; i >= 1; i++) {
    particles[i].state = "explode";
      particles[i].updateVelocityToMouse(e.clientX, e.clientY);
  }
});

setInterval(function() {
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    for(var i = particles.length-1; i >= 0; i--) {
      particles[i].update();
      if(particles[i].radius <= 0) {
        particles.splice(i, 1);
      }
    }
}, 20);