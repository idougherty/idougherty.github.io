function Burn() {
	this.resolution = 10;
	this.working = true;
	this.blendMode = "source-over";
	this.coolingMap = [];
	this.screen = [];
	this.clock = 0;
	this.xSize = canvas.width;
	this.ySize = canvas.height;
	
	this.setup = function() {
		c.globalCompositeOperation = this.blendMode;

		c.strokeStyle = "black";
		c.lineWidth = 2;
		c.strokeRect(0, 0, this.xSize, this.ySize);

		var imageData = c.getImageData(0, 0, this.xSize, this.ySize);
		this.screen = imageData;
		
		this.coolingMap = [];
		noise.seed(Math.random());
		
		for(var y = 0; y < this.ySize; y++) {
			for(var x = 0; x < this.xSize; x++) {
				this.coolingMap[y * this.xSize + x] = Math.abs(7*noise.simplex2(x/100, y/100));
			}
		}
	};

	this.smoothPixel = function (index, channel) {
		const n1 = this.screen.data[index + channel - this.xSize * 4];
		const n2 = this.screen.data[index + channel + 8];
		const n3 = this.screen.data[index + channel - 8];
		const n4 = this.screen.data[index + channel + this.xSize * 12];
		
		return ((n1 + n2 + n3 + n4) / 4);
	}

	this.update = function() {

		const buffer = this.screen;

		for(var y = 1; y < this.ySize - 1; y++) {
			for(var x = 1; x < this.xSize - 1; x++) {
				const index = (y * this.xSize + x) * 4;

				const r = this.smoothPixel(index, 0);
				const g = this.smoothPixel(index, 1);
				const b = this.smoothPixel(index, 2);
				const c = this.coolingMap[index/4 + this.clock * this.xSize];

				buffer.data[index + 0] = Math.max(r - c, 0);
				buffer.data[index + 1] = Math.max(g - c, 0);
				buffer.data[index + 2] = Math.max(b - c, 0);
				buffer.data[index + 3] = 255;
			}
		}

		c.putImageData(buffer, 0, 0);
		this.screen = buffer;
		this.clock++;

		if(this.clock > 80) {
			this.working = false;
		}
	};
}