function Word(color, text, size) {
	this.size = size;
	this.distance = 2;
	this.color = color;
	this.text = text;
	this.offsetX = 0.01;
	this.offsetY = 0.01;
	this.timer = 0;
    
    this.offsetModifier = function(value, min, max) {
        const range = max - min;
        value += (Math.random() - .5) * range;
        
        return Math.min(Math.max(value, min), max);
    };
	
	this.draw = function(x, y) {
		var alpha = 1 - 1/(3-this.distance);
		this.distance -= .007;
		const fontsize = this.size * 10 / this.distance;
		
		this.offsetX = this.offsetModifier(this.offsetX, -.02, .00);

		c.font = fontsize + "px Bitwise";
		c.lineWidth = fontsize/30;
		c.textBaseline = "middle";
		c.textAlign = "center";
		
		c.strokeStyle = "hsla("+this.color+", 75%, 12%, "+alpha+")";
		c.strokeText(this.text, canvas.width / 2 + this.offsetX * fontsize,  canvas.height / 2 + this.offsetX * fontsize);

		c.strokeStyle = "hsla("+(180-this.color)+", 75%, 12%, "+alpha+")";
		c.strokeText(this.text, canvas.width / 2 - this.offsetX * fontsize,  canvas.height / 2 - this.offsetX * fontsize);

		this.timer++;
		
		if(this.distance <= .02) {
			return "kill";
		}
	};
}

function TitleRunner() {
	this.timer = 1000;
	this.spawnHue = 0;
	this.frequency = 250;
	this.wordIndex = 0;
	this.blendMode = "lighter";
	this.phrases = [["SQYRM", 30],
					["some animations by ian dougherty", 7],
					["- click to cycle through -", 10]];
    this.words = [];
	this.working = true;

	this.setup = function() {
        c.globalCompositeOperation = this.blendMode;
    };
	
	this.update = function() {
        this.timer++;
		
		//spawn lines
		if(this.timer >= this.frequency && this.wordIndex < this.phrases.length) {
			this.timer = 0;

            var slice = new Word(0, this.phrases[this.wordIndex][0], this.phrases[this.wordIndex][1]);
			this.words.push(slice);

			this.wordIndex++;
		}
		
		//kill lines
		for(var i = this.words.length-1; i >= 0; i--) {
			if(this.words[i].draw(canvas.width/2, canvas.height/2) == "kill") {
				this.words.splice(i, 1);
			}
		}

		if(this.words.length == 0) {
			this.working = false;
		}
	};
}