function showModal(card) {
	switch(card) {
		case "supersuit":
			$('#mdlTitle').text("SuperSuit");
			$('#mdlText').text("The premise of the game is that time only moves when you move. You play as Frozone from the incredibles and travel from floor to floor dodging bullets and killing enemies. This was made at a CodeDay Chicago event in under 24 hours with a few of my friends. For such a small time frame I'm very happy with how it came out, the time slowing effect came out feeling pretty natural and we added a few tracing effects to emphasize it. What I wish we could have improved on was spending a little more time on art and instructions for players and maybe adding a few more levels to the mix.");

			$('#mdlImg').attr("src", "img/supersuit.png");
			$('#mdlLink').attr("href", "https://idougherty.github.io/supersuit/");
			$('#mdlOverlay').show();
			break;
	
		case "kangarookiller":
			$('#mdlTitle').text("Kangaroo Killer");
			$('#mdlText').text("This was made by a small team of students in only 24 hours at CodeDay Chicago.");

			$('#mdlImg').attr("src", "img/kangarookiller.png");
			$('#mdlLink').attr("href", "https://idougherty.github.io/kangaroo-killer/");
			$('#mdlOverlay').show();
			break;
			
		case "bjorn":
			$('#mdlTitle').text("Bjorn");
			$('#mdlText').text("Point and click to move, eat animals to grow, but watch out for larger animals that can still damage you. I made this game for a small game jam I organized with a few friends to pass time during quarantine, our theme was 'start small'. I'm very happy with how the game came out visually, but I am planning on flipping a few of the animal assets to be more detailed. This project was made in about a week but I have made a few changes since the deadline passed to polish it a little more.");

			$('#mdlImg').attr("src", "img/bjorn.png");
			$('#mdlLink').attr("href", "https://idougherty.github.io/bjorn/");
			$('#mdlOverlay').show();
			break;
		
		case "sqyrm":
			$('#mdlTitle').text("Sqyrm");
			$('#mdlText').text("This project started a few years ago with a small animation idea I had to make a 3d effect. Recently I have picked it up again and am adding more effects and transitions to flesh it out. There is currently a burn transition effect that I'm still working on that may lag on higher resolutions, but I hope to optimize that soon. This page also lead to a commission for an opening title screen animation on a senior directing film at Northwestern. The commission is still in progress but will be added to this portfolio in the future.");

			$('#mdlImg').attr("src", "img/sqyrm.png");
			$('#mdlLink').attr("href", "https://idougherty.github.io/sqyrm/");
			$('#mdlOverlay').show();
			break;
		
		case "lava":
			$('#mdlTitle').text("Lava");
			$('#mdlText').text("A game where you fight other circles to stay on top, if you touch the lava you die. This project also uses Node.js so five players can play remotely at once. It used to be hosted on a Raspberry Pi from my basement, however it is not currently hosted anywhere.");

			$('#mdlImg').attr("src", "img/lava.png");
			$('#mdlLink').attr("href", "https://idougherty.github.io/lava/");
			$('#mdlOverlay').show();
			break;

		case "cruiser":
			$('#mdlTitle').text("Wood Cruiser");
			$('#mdlText').text("This was a small project I did with my dad to learn a bit how skateboard decks are made. It's made from four quarter inch sheets of maple that were laminated together. Afterwards we sanded and stained the deck to make it look a little nicer. I think it's pretty nice but I would make a more ambitious shape if I were to do it again.");

			$('#mdlImg').attr("src", "img/cruiser.jpg");
			$('#mdlLink').attr("href", "");
			$('#mdlOverlay').hide();
			break;

		case "heely":
			$('#mdlTitle').text("Custom Heely's");
			$('#mdlText').text("I found a pair of size 6 childrens heely's at a thrift store and dug out the wheel components then stuck them on a shoe my size. They rolled pretty well and the material cost was only $6.");

			$('#mdlImg').attr("src", "img/heely.jpg");
			$('#mdlLink').attr("href", "");
			$('#mdlOverlay').hide();
			break;
	
		case "portfolio":
			$('#mdlTitle').text("This Portfolio");
			$('#mdlText').text("This page was made with JQuery and Bootstrap. It originally had a splash image of a polygonal lizard, which has now been replaced with the spinning globe animation. Since then, I've also added pop ups so I can fit in more information about each project without cluttering the screen. I liked the challenge of creating my own website without a template and it has an added bonus of feeling a little different than others.");

			$('#mdlImg').attr("src", "img/portfolio.png");
			$('#mdlLink').attr("href", "");
			$('#mdlOverlay').show();
			break;
			
		case "sculpture":
			$('#mdlTitle').text("Kinetic Sculpture");
			$('#mdlText').text("This project was made for my physical computing class in collaboration with a sculpture class over the course of a few weeks. I worked with two art students who designed the dioramas and constructed the base. I used a raspberry pi with a camera module and which reads the average color of the center of the capture. The color is mapped to either red, green, blue, or other and then a dc motor spins the diagram to the appropriate side.");

			$('#mdlImg').attr("src", "img/sculpture.png");
			$('#mdlLink').attr("href", "https://drive.google.com/open?id=13J4Tn3dVhy3EZkFnjoBzgf5clTty8iMc");
			$('#mdlOverlay').show();
			break;
		default:
	}
	$('#infoModal').modal('show');
}

var earthPixels = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,0,0,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,1,0,0,1,1,1,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,1,1,1,0,0,0,0,0,0,0,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];

canvas = document.getElementById("canvas");
c = canvas.getContext("2d");

function Node(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.color = this.y * 18;
	this.base = 30;

	this.rotatePoint = function(angle, x, y) {
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);
		
		const nx = x*cos - y*sin;
		const ny = y*cos + x*sin;
		
		return [nx, ny];
	};

	this.draw = function(distance, pitch, yaw, roll) {
		const p1 = this.rotatePoint(pitch, this.z, this.y);
		const p2 = this.rotatePoint(yaw, this.x, p1[0]);
		const p3 = this.rotatePoint(roll, p2[0], p1[1]);

		const nx = p3[0];
		const ny = p3[1];
		const nz = p2[1];

		const size = 5 / (nz + distance);
		var alpha = (7 - nz)/5;

		imageX = nx * size * 200 + canvas.width/2;
		imageY = ny * size * 200 + canvas.height/2;

		this.color = this.color + 2 > 360 ? 0 : this.color + 2;
		
		c.fillStyle = "hsla("+this.color+", 75%, 50%, "+alpha+")";
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

var controller = new MarbleRunner();
controller.setup();

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight/2;
	
	c.globalCompositeOperation = controller.blendMode;
}

window.onresize = resizeCanvas;
resizeCanvas();

setInterval(function() {	
	c.globalCompositeOperation = "lighter";
	c.clearRect(0, 0, canvas.width, canvas.height);
	c.fillStyle = "black";
	c.fillRect(0, 0, canvas.width, canvas.height);
	
    controller.update();
    
    c.globalCompositeOperation = "source-over";
    var grd = c.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width);
    grd.addColorStop(0, "rgba(16, 64, 48, 0.3)");
    grd.addColorStop(1, "rgba(0, 0, 0, 1)");

    c.fillStyle = grd;
    c.fillRect(0, 0, canvas.width, canvas.height);
}, 20);