function Raccoon(x, y) {
  this.x = x;
  this.y = y;
  this.vx = 0;
  this.vy = 0;
  this.vd = 0;
  this.kx = 0;
  this.ky = 0;
  this.d = Math.random() * Math.PI * 2;
  this.size = Math.random() + 3;
  this.base = 4;
  this.mass = 1.5;
  this.health = this.size * 4;
  this.maxHealth = this.health;
  this.opacity = 1;
  this.particles = [];
  this.sprite = new Image();
  this.sprite.src = "art/raccoon.png";

  this.update = function() {
    if(this.health > 0) {
      this.move();
      return this.ping();
    } else {
      return this.die();
    }
  };

  this.move = function() {
    const xDif = this.x - player.x;
    const yDif = this.y - player.y;

    this.vd += (Math.random()-.5)/20;
    this.vd = Math.max(-.05, Math.min(this.vd, .05));

    if(Math.sqrt(xDif * xDif + yDif * yDif) - player.size < 70 && this.size < player.size * 2 && !player.win) {
      const theta = player.size < this.size * 3 ? Math.PI : 0;
      this.d += Math.sin(angleDif(theta + Math.atan2(yDif, xDif), this.d)) * .1;
    } else {
      this.d += this.vd;
    }

    this.kx *= .92;
    this.ky *= .92;

    this.vx = Math.cos(this.d) * 2.5 + this.kx;
    this.vy = Math.sin(this.d) * 2.5 + this.ky;

    this.x += this.vx;
    this.y += this.vy;

    if(this.d < -Math.PI) {
      this.d += 2 * Math.PI;
    } else if(this.d > Math.PI) {
      this.d -= 2 * Math.PI;
    }
  }

  this.ping = function() {
    const xDif = this.x - player.x;
    const yDif = this.y - player.y;
    
    return Math.sqrt(xDif * xDif + yDif * yDif) > player.size * 90;
  }

  this.die = function() {
    this.opacity *= .92;

    this.size *= .99;
  
    if(this.opacity > .1) {
      const color = 0;// Math.floor(Math.random()*360);
      let p = new Particle(this.x, this.y, (Math.random()-.5)*this.size * 2, (Math.random()-.5)*this.size * 2, 3, "hsla("+color+", 50%, 50%, "+this.opacity+")", .5, .98);
      this.particles.push(p);
    }

    for(let i = 0; i < this.particles.length; i++) {
      if(this.particles[i].update()) {
        this.particles.splice(i, 1);
        i--;
      }
    }

    if(this.particles.length == 0) {
      return true;
    }
  }
  this.draw = function(camX, camY, camHeight) {
    for(let i = 0; i < this.particles.length; i++) {
      this.particles[i].draw(camX, camY, camHeight);
    }
    
    let img = new Image();
    img.src = "art/raccoon.png";

    const width = this.sprite.width / camHeight * this.size / 4;
    const height = this.sprite.height / camHeight * this.size / 4;

    const nx = (this.x - camX - canvas.width/2 ) / camHeight * 12 + canvas.width/2 + width/2;
    const ny = (this.y - camY - canvas.height/2 ) / camHeight * 12 + canvas.height/2 + height/2;
    
    c.translate(nx - width/2, ny - height/2);
    c.rotate(this.d + Math.PI/2);
    c.globalAlpha = this.opacity;
    c.drawImage(this.sprite, -width/2, -height/2, width, height);
    c.globalAlpha = 1;
    c.rotate(-this.d - Math.PI/2);
    c.translate(-nx + width/2, -ny + height/2);

    if(this.health > 0 && this.health < this.maxHealth) {
      c.fillStyle = "#622";
      c.fillRect(nx - width, ny + height/6, width, height/10);
      c.fillStyle = "#933";
      c.fillRect(nx - width, ny + height/6, width * this.health/this.maxHealth, height/10);
    }
  }
}