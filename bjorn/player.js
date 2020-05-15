function Player() {
  this.x = 0;
  this.y = 0;
  this.d = 0;
  this.vx = 0;
  this.vy = 0;
  this.kx = 0;
  this.ky = 0;
  this.size = 1;
  this.baseRadius = 20;
  this.staticSize = 3;
  this.biteTimer = 100;
  this.targetX = 0;
  this.targetY = 0;
  this.biteCoolDown = 3;
  this.speed = 10;
  this.particles = [];
  this.win = false;
  this.biting = false;

  this.bite = function(x, y) {
    if(this.biteTimer > this.biteCoolDown) {
      this.biteTimer = 0;

      const theta = Math.atan2(y - canvas.height/2, x - canvas.width/2);

      this.kx *= 0.2;
      this.ky *= 0.2;
      this.vx *= 0.8;
      this.vy *= 0.8;
      this.vy += Math.sin(theta) * .5 * this.speed;
      this.vx += Math.cos(theta) * .5 * this.speed;
    }
  };

  this.resolveCollision = function(target) {
    if(this.size > target.size * 3) {
      return true;
    } else if(this.size * 3 < target.size) {
      return false;
    } else {
      return Math.sqrt(this.vx * this.vx + this.vy * this.vy)*this.size*1.5 >= Math.sqrt(target.vx * target.vx + target.vy * target.vy)*target.size*target.mass;
    }
  };

  this.collision = function() {
    for(let i = 0; i < environment.animals.length; i++) {
      let target = environment.animals[i];
      const xDif = this.x - target.x;
      const yDif = this.y - target.y;
      const dist = Math.sqrt(xDif * xDif + yDif * yDif) - this.size - target.size - target.base;

      if(dist < 0 && target.health > 0) {
        //const power1 = Math.sqrt(this.vx * this.vx + this.vy * this.vy) * this.size;
        //const power2 = Math.sqrt(target.vx * target.vx + target.vy * target.vy) * target.size;
        
        const sizeDif = Math.min(this.size/target.size, 1.5);
        const theta = Math.atan2(yDif, xDif);

        if(this.resolveCollision(target)) {
          target.health -= sizeDif * this.size / 4;

          target.x += Math.cos(theta) * dist;
          target.y += Math.sin(theta) * dist;
          target.kx = Math.cos(theta + Math.PI) + this.vx * sizeDif;
          target.ky = Math.sin(theta + Math.PI) + this.vy * sizeDif;
        } else {
          if(Math.sqrt(this.kx * this.kx + this.ky * this.ky) < .2) {
            this.size *= .9;

            this.x += Math.cos(theta) * dist;
            this.y += Math.sin(theta) * dist;
            this.kx = Math.cos(theta) * target.size + target.vx;
            this.ky = Math.sin(theta) * target.size + target.vy;
          }
        }

        if(target.health <= 0) {
          this.size += Math.max((3 * target.size-this.size)/10, 0);
        }
      }
    }
  };

  this.update = function() {
    this.move();
    this.collision();

    if(this.biting) {
      const color = Math.floor(Math.random()*360);
      let p = new Particle(this.x, this.y, -this.vx/4, -this.vy/4, this.size, "hsla("+color+", 50%, 80%, .5)", this.size/8, .9);
      this.particles.push(p);
    }

    for(let i = 0; i < this.particles.length; i++) {
      if(this.particles[i].update()) {
        this.particles.splice(i, 1);
        i--;
      }
    }

    this.biteTimer++;
    if(this.size < .3) {
      this.size = .3;
      if(camera.text.text != "you died") {
        camera.text = new Text("you died");
      } else {
        if(camera.text.opacity == 0) {
          location.reload();
        }
      }
    }
    if(this.size > 12) {
      this.size = 12;
    }
  };

  this.move = function() {
    if(this.biting) {
      this.bite(this.targetX, this.targetY);
    }

    this.speed = this.size * 2 / 3;

    this.vx *= this.biting ? .98 : .94;
    this.vy *= this.biting ? .98 : .94;
    
    this.kx *= .94;
    this.ky *= .94;

    if(!this.biting && Math.sqrt(this.kx * this.kx + this.ky * this.ky) < .5) {

      const theta = Math.atan2(this.vy, this.vx);
      if(Math.sqrt(this.vx * this.vx + this.vy * this.vy) > this.speed) {
        this.vy = Math.sin(theta) * this.speed;
        this.vx = Math.cos(theta) * this.speed;
      }
    }

    this.y += this.vy + this.ky;
    this.x += this.vx + this.kx;
  };

  this.draw = function(camX, camY, camHeight) {
    for(let i = 0; i < this.particles.length; i++) {
      this.particles[i].draw(camX, camY, camHeight);
    }

    c.globalCompositeOperation = "lighter";
    const radius = 12 * this.size / camHeight;
    const nx = (this.x - camX - canvas.width/2) / camHeight * 12 + canvas.width/2;
    const ny = (this.y - camY - canvas.height/2) / camHeight * 12 + canvas.height/2;

    for(let y = -radius; y < radius; y += this.staticSize) {
      for(let x = -radius; x < radius; x += this.staticSize) {
        if(Math.sqrt(x*x + y*y) < radius) {
          let dmg = 100 * Math.sqrt(this.kx * this.kx + this.ky * this.ky);

          let lum = Math.floor(Math.random()*70)
          let sat = 70;
          let alpha = lum/70;
          let hue = Math.floor(Math.random() * 360 / (1+5*dmg));
          
          c.fillStyle = "hsla("+hue+", "+sat+"%, "+lum+"%, "+alpha+")";
          c.fillRect(nx + x, ny + y, this.staticSize*2, this.staticSize*2);
        }
      }
    }
    

    c.globalCompositeOperation = "source-over";
  };
}