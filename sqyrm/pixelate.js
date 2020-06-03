
function Pixel(x, y, color, size) {
    this.x = x;
    this.y = y;
    this.color = color;
	this.size = size/2;
	this.dsize = 1;
    
    this.update = function() {
		this.size += Math.random()*this.dsize;
		this.dsize -= .04;
		this.draw();
    };
    
    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.size, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    };
	
	this.alive = function() {
		return !(this.x + this.size < 0 ||
			this.x - this.size > canvas.width ||
			this.y + this.size < 0 ||
			this.y - this.size > canvas.height) &&
			this.size > -this.dsize;
	};
}

function Pixelate() {
	this.pixels = [];
	this.grid = 10;
	this.working = true;
	this.blendMode = "lighter";
	
	this.setup = function() {
		c.globalCompositeOperation = "lighter";
		
		var imageData = c.getImageData(0, 0, canvas.width, canvas.height);
		var data = imageData.data;
		
		for(var i = 0; i < data.length; i += 4 * this.grid) {

			if(Math.floor((i/4) / canvas.width) % this.grid != 0) {
				i += canvas.width * 4;
			}

			if(data[i] > 50 || data[i+1] > 50 || data[i+2] > 50) {
				var x = (i/4)%canvas.width;
				var y = Math.floor((i/4)/canvas.width);
				var color = "rgb("+data[i]+", "+data[i+1]+", "+data[i+2]+", .2)";
				
				this.pixels.push(new Pixel(x, y, color, 10));
			}
		}
	};
	
	this.update = function() {
		if(this.pixels.length == 0) {
			this.working = false;
		}
		for(var i = this.pixels.length - 1; i >= 0; i--) {
			if(this.pixels[i].alive()) {
				this.pixels[i].update();
			} else {
				this.pixels.splice(i, 1)
			}
		}
	};
}