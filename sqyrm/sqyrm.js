sPoints = [[1, 0], [2, -1], [2, -3], [0, -5], [-2, -3], [-2, -1], [0, 1], [0, 3], [0, 1], [-1, 0], [-2, 1], [-2, 3], [0, 5], [2, 3], [2, 1], [0, -1], [0, -3]];

function Sqyrm(color, angle, dda) {
	this.size = 100;
	this.distance = 20;
	this.color = color;
	this.a = angle;
	this.da = .5;
	this.dda = dda;
	this.timer = 0;
	
	this.rotatePoint = function(x, y, px, py) {
		sin = Math.sin(this.a*Math.PI/180);
		cos = Math.cos(this.a*Math.PI/180);
		
		nx = x*cos - y*sin + px;
		ny = y*cos + x*sin + py;
		
		return [nx, ny];
	};
	
	this.drawLine = function(x1, y1, x2, y2) {
		c.moveTo(x1, y1);
		c.lineTo(x2, y2);
	};
	
	this.draw = function(x, y) {
		c.beginPath();
		
		for(var i = 0; i < sPoints.length-1; i++) {
			const x1 = sPoints[i][0]*this.size;
			const y1 = sPoints[i][1]*this.size;
			const x2 = sPoints[i+1][0]*this.size;
			const y2 = sPoints[i+1][1]*this.size;
			
			const p1 = this.rotatePoint(x1, y1, x, y);
			const p2 = this.rotatePoint(x2, y2, x, y);
			
			this.drawLine(p1[0], p1[1], p2[0], p2[1]);
		}
		
		var alpha = (19-this.distance)/20;
		
		c.strokeStyle = "hsla("+this.color+", 75%, 50%, "+alpha+")";
		c.lineCap = "round";
		c.lineWidth = 5/this.distance;
		c.stroke();
		
		this.timer++;
		
		this.da = Math.cos(this.dda*this.timer/300)
		this.a += this.da;
		
		this.distance -= .03;
		this.size = 200/this.distance;
		
		if(this.distance <= 0) {
			return "kill";
		}
	};
}

function SqyrmRunner() {
	this.timer = 0;
	this.frequency = 5;
	this.spawnAngle = 0;
	this.spawnHue = 0;
	this.dda = 0;
	this.blendMode = "lighter";
	this.sqyrms = [];
	
	this.setup = function() {
		c.globalCompositeOperation = "lighter";
	}
	
	this.update = function() {
		this.timer++;
		
		//spawn slices
		if(this.timer >= this.frequency) {
			this.spawnHue += 2;
			this.spawnHue = this.spawnHue>360 ? 0:this.spawnHue;
			this.spawnAngle += 1;
			this.dda = 4*Math.sin(this.spawnAngle/200);
			this.timer = 0;
			
			this.sqyrms.push(new Sqyrm(this.spawnHue, this.spawnAngle, this.dda));
		}
		
		//kill slices
		for(var i = this.sqyrms.length-1; i >= 0; i--) {
			if(this.sqyrms[i].draw(canvas.width/2, canvas.height/2) == "kill") {
				this.sqyrms.splice(i, 1);
			}
		}
	}
}