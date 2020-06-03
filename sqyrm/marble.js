function Node(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.offset = 0;
	this.color = (this.y + 10) * 18;
	this.base = 30;
	this.opacity = 0;

	this.rotatePoint = function(angle, x, y) {
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);
		
		const nx = x*cos - y*sin;
		const ny = y*cos + x*sin;
		
		return [nx, ny];
	};

	this.draw = function(distance, pitch, yaw, roll) {
		this.offset = this.color/720 - .5;
		if(this.color == 0) {
			this.opacity = 1;
		}

		const p1 = this.rotatePoint(pitch, this.z, this.y + this.offset);
		const p2 = this.rotatePoint(yaw, this.x, p1[0]);
		const p3 = this.rotatePoint(roll, p2[0], p1[1]);

		const nx = p3[0];
		const ny = p3[1];
		const nz = p2[1];


		const size = 5 / (nz + distance);
		var alpha = (7 - nz)/6 * this.opacity;

		imageX = nx * size * 200 + canvas.width/2;
		imageY = ny * size * 200 + canvas.height/2;

		this.color = this.color + 2 > 360 ? 0 : this.color + 2;
		
		c.fillStyle = "hsla("+this.color+", 75%, 10%, "+alpha+")";
		c.beginPath();
		c.arc(imageX, imageY, size * this.base, 0, 2 * Math.PI);
		c.closePath();
		c.fill();
	}
}

function MarbleRunner() {
	this.distance = 20;
	this.timer = 0;
	this.resolution = 30;
	this.size = 10;
	this.blendMode = "lighter";
	this.nodes = [];
	this.pitch = 0;
	this.yaw = 0;
	this.roll = 0;

	this.createLayer = function(offset, nodeAmt) {
		for(var i = 0; i < nodeAmt; i++) {
			const layerSize = Math.sqrt(this.size/2 * this.size/2 - offset * offset);
			const angle = i * Math.PI * 2 / nodeAmt; 
			const x = layerSize * Math.cos(angle); 
			const z = layerSize * Math.sin(angle);

			this.nodes.push(new Node(x, offset, z));
		}
	}

	this.setup = function() {
		c.globalCompositeOperation = this.blendMode;

		for(var i = 0; i < this.resolution; i++) {
			const layerHeight = this.size / this.resolution;
			const offset = i * layerHeight - this.size/2 + layerHeight/2;
			this.createLayer(offset, this.resolution * 2);
		}
	};
	
	this.update = function() {
		this.timer++;
		this.yaw = 2 * Math.PI * Math.sin(this.timer/800);
		this.pitch = Math.PI / 16 * Math.sin(this.timer/500);
		this.roll = Math.PI / 16 * Math.sin(this.timer/100);
		
		// this.nodes.sort(function(a, b) {
		// 	return a.z - b.z;
		// });

		for(var i = this.nodes.length-1; i >= 0; i--) {
			if(!earthPixels[i]) {
				this.nodes[i].draw(this.distance, this.pitch, this.yaw, this.roll);
			}
		}
	};
}