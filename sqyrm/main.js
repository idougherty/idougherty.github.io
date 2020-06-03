canvas = document.getElementById("canvas");
c = canvas.getContext("2d");

function Controller() {
	this.displays = ["wave", "sqyrm", "marble"];
	this.transitions = ["pixelate", "burn"];
	
	this.displayIDX = 1;
	this.transitionIDX = -1;
	
	this.display = new TitleRunner();
	this.transition = false;
	
	this.pickDisplay = function() {
		this.displayIDX = (this.displayIDX+1>=this.displays.length) ? 0:this.displayIDX+1;

		switch(this.displays[this.displayIDX]) {
			case "sqyrm":
				this.display = new SqyrmRunner();
				break;
			case "wave":
				this.display = new WaveRunner();
				break;
			case "marble":
				this.display = new MarbleRunner();
				break;
			default:
				throw new Error("unknown display type");
		}
	}
	
	this.pickTransition = function() {
		this.transitionIDX = 1;//Math.floor(Math.random()*this.transitions.length);

		switch(this.transitions[this.transitionIDX]) {
			case "pixelate":
				this.display = new Pixelate();
				break;
			case "burn":
				this.display = new Burn();
				break;
			default:
				throw new Error("unknown transition type");
		}
	}
}

var controller = new Controller();
controller.display.setup();

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	c.globalCompositeOperation = controller.display.blendMode;
}

window.onresize = resizeCanvas;
resizeCanvas();

function triggerTransition() {
	if(!controller.transition) {
		controller.pickTransition();
		controller.transition = true;
		controller.display.setup();
	} else {
		controller.display.working = false;
	}
}

document.addEventListener("click", triggerTransition);

setInterval(function() {	
    c.globalCompositeOperation = "source-over";

    c.fillStyle = "rgba(0, 0, 0, .2)";
    c.fillRect(0, 0, canvas.width, canvas.height);
	
	c.globalCompositeOperation = "lighter";
	
	
	controller.display.update();

	if(controller.display.working != undefined && !controller.display.working) {
		controller.transition = false;
		controller.pickDisplay();
		controller.display.setup();
	}
}, 20);