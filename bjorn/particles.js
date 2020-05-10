function Particle(x, y, vx, vy, size, color, shake, decay) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.size = size;
  this.color = color;
  this.shake = shake;
  this.decay = decay;
  
  this.update = function() {
    this.size *= this.decay;
    this.vx *= .9;
    this.vy *= .9;

    this.vx += Math.random()*shake - shake/2;
    this.vy += Math.random()*shake - shake/2;

    this.x += this.vx;
    this.y += this.vy;

    return (this.size < .05);
  };

  this.draw = function(camX, camY, camHeight) {
    const nx = (this.x - camX - canvas.width/2) / camHeight * 12 + canvas.width/2;
    const ny = (this.y - camY - canvas.height/2) / camHeight * 12 + canvas.height/2;
    const radius = 12 * this.size / camHeight;
    
    c.globalCompositeOperation = "lighter";
    c.fillStyle = this.color;
    c.beginPath();
    c.arc(nx, ny, radius, 0, Math.PI*2);
    c.fill();
    
    c.globalCompositeOperation = player.win ? "lighter" : "source-over";
  };
}

function Text(text) {
  this.text = text;
  this.color = "white";
  this.opacity = 0;
  this.vo = .05;

  this.draw = function(camX, camY, camHeight) {
    this.vo -= 0.001;
    this.opacity = Math.max(this.opacity + this.vo, 0);

    c.fillStyle = this.color;
    c.font = "200px Arbre";
		c.textBaseline = "middle";
    c.textAlign = "center";
    c.globalAlpha = this.opacity;
    
    c.fillText(this.text, canvas.width/2, canvas.height/2);

    c.globalAlpha = 1;
  };
}