function Chunk(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.active = true;

	this.draw = function() {
		c.fillStyle = "hsl("+((x+y)*16)+", 100%, 10%)";
		c.fillRect(this.x, this.y, this.width, this.height);
	}
}

function Burn() {
	this.chunkGrid = 50;
	this.working = true;
	this.blendMode = "source-over";
	this.coolingMap = [];
	this.screen = [];
	this.clock = 0;
	this.xSize = canvas.width;
	this.ySize = canvas.height;
	this.chunks = [];
	
	this.setup = function() {
		c.globalCompositeOperation = this.blendMode;

		//prevent bleeding edges
		c.strokeStyle = "black";
		c.lineWidth = 2;
		c.strokeRect(0, 0, this.xSize, this.ySize);

		//save image data
		var imageData = c.getImageData(0, 0, this.xSize, this.ySize);
		this.screen = imageData;
		
		//create cooling map
		this.coolingMap = [];
		noise.seed(Math.random());
		
		for(var y = 0; y < this.ySize; y++) {
			for(var x = 0; x < this.xSize; x++) {
				this.coolingMap[y * this.xSize + x] = Math.floor(Math.abs(7*noise.simplex2(x/200, y/200)));
			}
		}
		canvas.innerHTML = this.coolingMap;

		//create optimization chunks
		for(var y = 0; y < this.chunkGrid; y++) {
			for(var x = 0; x < this.chunkGrid; x++) {
				const width = (this.xSize-2)/this.chunkGrid;
				const height = (this.ySize-2)/this.chunkGrid;
				const nx = Math.floor(x * width) + 1;
				const ny = Math.floor(y * height) + 1;

				let ch = new Chunk(nx, ny, width, height);
				this.chunks.push(ch);
			}
		}
	};

	this.smoothPixel = function (index, channel) {
		const n1 = this.screen.data[index + channel - this.xSize * 4];
		const n2 = this.screen.data[index + channel + 8];
		const n3 = this.screen.data[index + channel - 8];
		const n4 = this.screen.data[index + channel + this.xSize * 4];
		
		return ((n1 + n2 + n3 + n4) / 4);
	}

	this.update = function() {

		const buffer = this.screen;
		let chunksLeft = 0;

		for(var i = 0; i < this.chunks.length; i++) {
			let chunk = this.chunks[i];
			if(chunk.active) {
				chunksLeft++;
				chunk.active = false;

				for(let y = chunk.y; y < chunk.y + chunk.height; y++) {
					for(let x = chunk.x; x < chunk.x + chunk.width; x++) {
						const index = (y * this.xSize + x) * 4;

						const r = this.smoothPixel(index, 0);
						const g = this.smoothPixel(index, 1);
						const b = this.smoothPixel(index, 2);
						const c = this.coolingMap[index/4 + this.clock * this.xSize];

						buffer.data[index + 0] = Math.max(r - c, 0);
						buffer.data[index + 1] = Math.max(g - c, 0);
						buffer.data[index + 2] = Math.max(b - c, 0);
						buffer.data[index + 3] = 255;

						if(buffer.data[index + 0] > 0 || buffer.data[index + 1] > 0 || buffer.data[index + 2] > 0) {
							chunk.active = true;
						}
					}
				}
			}
		}

		c.putImageData(buffer, 0, 0);
		this.screen = buffer;
		this.clock++;

		if(this.clock > 140 || chunksLeft == 0) {
			this.working = false;
		}
	};
}