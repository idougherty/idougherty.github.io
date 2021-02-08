

function Environment() {
  this.trees = [];
  this.details = [];
  this.animals = [];
  this.noises = {
    "enemy_hit": new Audio('sounds/enemy_hit.wav'),
    "player_hit": new Audio('sounds/player_hit.wav'),
    "enemy_death": new Audio('sounds/enemy_death.wav'),
    "bjorn_death": new Audio('sounds/bjorn_death.wav'),
  };

  this.drawElements = function(elements) {
    for(let i = 0; i < elements.length; i++) {
      const el = elements[i];

      c.beginPath();

      for(j = 0; j < el.slice.length; j++) {
        c.fillStyle = el.color;
        c.lineTo(el.x + el.width * el.slice[j][0], el.y + el.height * el.slice[j][1]);
      }

      c.closePath();
      c.fill();
    }
  }

  this.spawnAnimal = function(x, y) {
    let chance = Math.random() * 50 + Math.min(player.size * 5, 60);
    const limit = 40;

    if(this.animals.length > limit) {
      chance = -10;
    }

    if(0 < chance && chance < 30) {
      let b = new Bug(x, y);
      this.animals.push(b);
      b = new Bug(x, y);
      this.animals.push(b);
      b = new Bug(x, y);
      this.animals.push(b);
    } else if(30 < chance && chance < 45) {
      let f = new Frog(x, y);
      this.animals.push(f);
    } else if(45 < chance && chance < 60) {
      let r = new Rabbit(x, y);
      this.animals.push(r);
    } else if(55 < chance && chance < 65) {
      let r = new Raccoon(x, y);
      this.animals.push(r);
    } else if(65 < chance && chance < 80) {
      let d = new Doe(x, y);
      this.animals.push(d);
    } else if(80 < chance && chance < 95) {
      let b = new Buck(x, y);
      this.animals.push(b);
    } else if(96 < chance) {
      count = 0;
      for(let i = 0; i < this.animals.length; i++) {
        if(this.animals[i] instanceof Bear) {
          count++;
        }
      }
      
      if(count == 0 && !player.win) {
        let b = new Bear(x, y);
        this.animals.push(b);
      }
    }
  };

  this.update = function() {
    for(let i = 0; i < this.trees.length; i++) {
      this.trees[i].ping()
    }

    for(let i = 0; i < this.details.length; i++) {
      let d = this.details[i];
      d.ping();

      const xDif = d.x - player.x;
      const yDif = d.y - player.y;
      const dist = Math.sqrt(xDif * xDif + yDif * yDif)
      if(dist < player.size * 100 && dist > player.size * 80 && Math.abs(camera.height - player.size) < .3) {
        this.spawnAnimal(d.x + Math.random() * 30, d.y + Math.random() * 30);
      }
    }

    for(let i = 0; i < this.animals.length; i++) {
      if(this.animals[i].update()) {
        this.animals.splice(i, 1);
        i--;
      }
    }
  }

  this.drawBackground = function(camX, camY, camHeight) {
    let elements = [];

    for(let i = 0; i < this.details.length; i++) {
      elements = elements.concat(this.details[i].getPoints(camX, camY, camHeight));
    }

    this.drawElements(elements);
  };
  
  this.drawForeground = function(camX, camY, camHeight) {

    let elements = [];
    
    this.animals.sort(function(a, b){
      return a.size - b.size;
    })
    
    c.globalCompositeOperation = player.win ? "lighter" : "source-over";
    for(let i = 0; i < this.animals.length; i++) {
      this.animals[i].draw(camX, camY, camHeight);
    }

    for(let i = 0; i < this.trees.length; i++) {
      elements = elements.concat(this.trees[i].getSlices(camX, camY, camHeight));
    }

    elements.sort(function(a, b){
      return a.order - b.order;
    })

    this.drawElements(elements);
    c.globalCompositeOperation = "source-over";
  }
}

function Tree(x, y, size) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.layers = [];
  this.age = Math.random() * 1000;

  this.setup = function () {
    const layerAmt = 5 + Math.floor(size / 3);

    for(let i = 0; i < layerAmt; i++) {
      const points = 16 - i;
      let layer = [];

      for(var j = 0; j < points; j++) {
        const angle = j * Math.PI * 2 / points;
        
        let lx = Math.floor(Math.random() * 5);
        lx *= j % 2 == 0 ? 1 : -1;
        
        const x = (20 + lx) * Math.cos(angle); 
        const y = (20 + lx) * Math.sin(angle);

        layer.push([x, y]);
      }

      this.layers.push(layer);
    }
  };

  this.ping = function() {
    let flag = false;

    const xDif = this.x - player.x;
    const yDif = this.y - player.y;
    if(Math.abs(xDif) > 700) {
      this.x -= Math.sign(xDif) * 1400;
      this.y = Math.random() * 1400 - 700 + player.y;
      flag = true;
    }
    if(Math.abs(yDif) > 700) {
      this.y -= Math.sign(yDif) * 1400;
      this.x = Math.random() * 1400 - 700 + player.x;
      flag = true;
    }
    return false;
  }

  this.getSlices = function(camX, camY, camHeight) {
    const offsetX = ((this.x - player.x + 30*Math.sin(this.age/this.size)) / camHeight) * this.size / 20;
    const offsetY = ((this.y - player.y + 30*Math.cos(this.age/this.size)) / camHeight) * this.size / 20;
    let elements = [];

    for(let i = 0; i < this.layers.length; i++) {
      const width = (4 - (i / this.layers.length)*4) / camHeight * this.size;
      const height = (4 - (i / this.layers.length)*4) / camHeight * this.size;

      const nx = (this.x - camX - canvas.width/2 + offsetX * (i+1)) / camHeight * 12;
      const ny = (this.y - camY - canvas.height/2 + offsetY * (i+1)) / camHeight * 12;
      
      const x = nx + canvas.width/2;
      const y = ny + canvas.height/2;
      
      const xDif = this.x - player.x;
      const yDif = this.y - player.y;
      alpha = Math.max(Math.sqrt(xDif * xDif + yDif * yDif) / (20*this.size) - .5, .2 - 1/(5*camHeight), 0);

      let hue = (128 - 2*i) + Math.floor(Math.random()*8);
      let sat = 20;
      let lum = 30 + i*size/5;

      if(player.win) {
        hue = Math.random()*360;
        lum = 60 + i*size/5;
        sat = 30;
        alpha = .04;
      }

      const color = "hsla("+hue+", "+sat+"%, "+lum+"%, "+alpha+")";

      const data = {
        slice: this.layers[i],
        x: x,
        y: y,
        width: width, 
        height: height, 
        order: i * this.size,
        color: color,
      };

      elements.push(data); 
    }
    
    this.age += .1;
    return elements;
  };
}

function Detail(x, y, type) {
  this.x = x;
  this.y = y;
  this.type = type;
  this.points = [];

  this.setup = function () {
    switch(this.type) {
      case "rock":
        this.size = Math.random() * 3 + 1;
        this.color = "#666";
        break;
      case "weed":
        this.size = Math.random() * 4 + 2;
        this.color = "#334030";
        break;
      default:
    }
    
    const points = Math.floor(this.size) * 2;
    const theta = Math.random() * Math.PI;

    for(var i = 0; i < points; i++) {
      const angle = theta + i * Math.PI * 2 / points;
      
      let lx = 0;

      switch(this.type) {
        case "rock":
          lx = 6 + Math.random() * 3;
          break;
        case "weed":
          lx = 3 + Math.random() * 2;
          lx *= i % 2 == 0 ? 3 : 1;
          break;
        default:
      }
      
      const x = lx * Math.cos(angle); 
      const y = lx * Math.sin(angle);

      this.points.push([x, y]);
    }
  };

  this.ping = function() {
    const xDif = this.x - player.x;
    const yDif = this.y - player.y;
    if(Math.abs(xDif) > 700) {
      this.x -= Math.sign(xDif) * 1400;
      this.y = Math.random() * 1400 - 700 + player.y;
    }
    if(Math.abs(yDif) > 700) {
      this.y -= Math.sign(yDif) * 1400;
      this.x = Math.random() * 1400 - 700 + player.x;
    }
  }

  this.getPoints = function(camX, camY, camHeight) {
    const width = 2 * this.size / camHeight;
    const height = 2 * this.size / camHeight;

    const nx = (this.x - camX - canvas.width/2) / camHeight * 12;
    const ny = (this.y - camY - canvas.height/2) / camHeight * 12;
    
    const x = nx + canvas.width/2;
    const y = ny + canvas.height/2;

    const data = {
      slice: this.points,
      x: x,
      y: y,
      width: width, 
      height: height, 
      order: 0,
      color: this.color,
    };

    return (data); 
  };
}