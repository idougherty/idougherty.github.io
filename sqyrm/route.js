function Slice(color, age, modifiers) {
	this.size = 100;
	this.distance = 20;
	this.color = color;
    this.timer = 0;
    this.age = age;
    this.points = [];
    this.modifiers = modifiers;
    
    this.setup = function() {
        for(var i = -15; i <= 15; i++) {
            this.points.push([i, 0]);
        }
    };

    this.update = function() {
        this.age += .5;

        for(var i = 0; i < this.points.length; i++) {
            const x = this.points[i][0];
            const pNoise = noise.simplex2((x + 10)/8 * this.modifiers.stretch, this.age/100 * this.modifiers.stretch);
            const pHeight = this.modifiers.amplitude * pNoise + this.modifiers.concavity * Math.cos(x/6) + 3;
            
            this.points[i][1] = pHeight;
        }
    }

	this.drawLine = function(x1, y1, x2, y2) {
		c.moveTo(x1, y1);
		c.lineTo(x2, y2);
	};
	
	this.draw = function(x, y) {
        this.update();

		c.beginPath();
		
		for(var i = 0; i < this.points.length-1; i++) {
			const x1 = this.points[i][0] * this.size + x;
			const y1 = this.points[i][1] * this.size + y;
			const x2 = this.points[i+1][0] * this.size + x;
			const y2 = this.points[i+1][1] * this.size + y;

			this.drawLine(x1, y1, x2, y2);
		}
		
		var alpha = (19-this.distance)/20;
		
		c.strokeStyle = "hsla("+this.color+", 75%, 50%, "+alpha+")";
		c.lineCap = "round";
		c.lineWidth = (10)/this.distance;
		c.stroke();
		
		this.timer++;
		
		this.distance -= .03;
		this.size = 200/this.distance;
		
		if(this.distance <= 0) {
			return "kill";
		}
	};
}

function RouteRunner() {
    this.clock = 0;
	this.timer = 0;
	this.frequency = 7;
	this.spawnHue = 0;
	this.blendMode = "lighter";
    this.slices = [];

    this.modifiers = {
        amplitude: Math.random() + .5,
        stretch: Math.random() + .5,
        concavity: Math.random() * 6,
    };
	
	this.setup = function() {
        c.globalCompositeOperation = "lighter";

        noise.seed(Math.random());
    };
    
    this.modifyModifier = function(value, min, max) {
        const range = max - min;
        value += (Math.random() - .5) * range / 10;
        
        return Math.min(Math.max(value, min), max);
    };
	
	this.update = function() {
        this.timer++;
        this.clock++;

        this.modifiers.amplitude = this.modifyModifier(this.modifiers.amplitude, .5, 1.5);
        this.modifiers.stretch = this.modifyModifier(this.modifiers.stretch, .5, 1);
        this.modifiers.concavity = this.modifyModifier(this.modifiers.concavity, 0, 6);
		
		//spawn lines
		if(this.timer >= this.frequency) {
			this.spawnHue += .5;
			this.spawnHue = this.spawnHue>360 ? 0 : this.spawnHue;
			this.timer = 0;
            instanceModifier = Object.assign({}, this.modifiers);

            var newSlice = new Slice(this.spawnHue, this.clock, instanceModifier);
            newSlice.setup();

			this.slices.push(newSlice);
		}
		
		//kill lines
		for(var i = this.slices.length-1; i >= 0; i--) {
			if(this.slices[i].draw(canvas.width/2, canvas.height/3) == "kill") {
				this.slices.splice(i, 1);
			}
		}
	};
}