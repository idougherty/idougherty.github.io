function Buck(x, y) {
  this.x = x;
  this.y = y;
  this.vx = 0;
  this.vy = 0;
  this.kx = 0;
  this.ky = 0;
  this.d = 0;
  this.size = 8 + Math.random();
  this.base = 5;
  this.mass = 2;
  this.health = this.size * this.base / 2;
  this.maxHealth = this.health;
  this.opacity = 1;
  this.target = Math.random() * Math.PI;
  this.timer = 0;
  this.particles = [];
  this.sprite1 = new Image();
  this.sprite1.src = "art/buck1.png";
  this.sprite2 = new Image();
  this.sprite2.src = "art/buck2.png";

  this.update = function() {
    if(this.health > 0) {
      this.move();
      return this.ping();
    } else {
      return this.die();
    }
  };

  this.jumping = function() {
    if(Math.sqrt(this.vx * this.vx + this.vy * this.vy) > 2) {
      return true;
    } else {
      return false;
    }
  }
  
  this.ping = function() {
    const xDif = this.x - player.x;
    const yDif = this.y - player.y;
    
    return Math.sqrt(xDif * xDif + yDif * yDif) > player.size * 90;
  }

  this.move = function() {
    this.kx *= .92;
    this.ky *= .92;
    this.vx *= .96;
    this.vy *= .96;

    this.x += Math.cos(this.d) * 3;
    this.y += Math.sin(this.d) * 3;

    this.d += Math.sin(angleDif(this.target, this.d)) * .02;

    if(this.jumping()) {
    } else {
      const xDif = this.x - player.x;
      const yDif = this.y - player.y;

      if(Math.sqrt(xDif * xDif + yDif * yDif) - player.size < 400 && this.size > player.size && !player.win) {
        const theta = player.size < this.size * 3 ? Math.PI : 0;
        this.target = theta + Math.atan2(yDif, xDif);
      }

      this.d += Math.sin(angleDif(this.target, this.d)) * .09;

      if(this.timer > 70) {
        this.vx = Math.cos(this.d) * 8;
        this.vy = Math.sin(this.d) * 8;
        this.timer = 0;
        this.target += Math.random() * 2 - 1;
      }
    }

    this.x += this.vx + this.kx;
    this.y += this.vy + this.ky;
    this.timer++;

    if(this.d < -Math.PI) {
      this.d += 2 * Math.PI;
    } else if(this.d > Math.PI) {
      this.d -= 2 * Math.PI;
    }
  }

  this.die = function() {
    this.opacity *= .92;

    this.size *= .99;
  
    if(this.opacity > .1) {
      const color = 0;// Math.floor(Math.random()*360);
      let p = new Particle(this.x, this.y, (Math.random()-.5)*this.size * 2, (Math.random()-.5)*this.size * 2, 5, "hsla("+color+", 50%, 50%, "+this.opacity+")", .5, .98);
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
    
    let img = this.sprite1;
    if(this.jumping()) {
      img = this.sprite2;
    }

    const width = img.width / camHeight * this.size * .6;
    const height = img.height / camHeight * this.size * .6;

    const nx = (this.x - camX - canvas.width/2 ) / camHeight * 12 + canvas.width/2 + width/2;
    const ny = (this.y - camY - canvas.height/2 ) / camHeight * 12 + canvas.height/2 + height/2;
    
    c.translate(nx - width/2, ny - height/2);
    c.rotate(this.d + Math.PI/2);
    c.globalAlpha = this.opacity;
    c.drawImage(img, -width/2, -height/2, width, height);
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