canvas = document.getElementById("canvas");
c = canvas.getContext("2d");

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

window.onresize = resizeCanvas;
resizeCanvas();

document.addEventListener("click", function() {
	if(!controller.transitioning) {
		controller.pickTransition();
		controller.transitioning = true;
		controller.transition.setup();
	}
});

function Controller() {
	this.displays = ["sqyrm"];
	this.transitions = ["pixelate"];
	
	this.displayIDX = 0;
	this.transitionIDX = 0;
	
	this.display = new SqyrmRunner();
	this.transition = null;
	this.transitioning = false;
	
	this.pickDisplay = function() {
		this.displayIDX = (this.displayIDX+1>=this.displays.length) ? 0:this.displayIDX+1;
		switch(this.displays[this.displayIDX]) {
			case "sqyrm":
				this.display = new SqyrmRunner();
				break;
			default:
				throw new Error("unknown display type");
		}
	};
	
	this.pickTransition = function() {
		this.transitionIDX = Math.floor(Math.random()*this.displays.length);
		switch(this.transitions[this.transitionIDX]) {
			case "pixelate":
				this.transition = new Pixelate();
				break;
			default:
				throw new Error("unknown transition type");
		}
	};
}

var controller = new Controller();
controller.display.setup();

setInterval(function() {	
	c.clearRect(0, 0, canvas.width, canvas.height);
	c.fillStyle = "black";
	c.fillRect(0, 0, canvas.width, canvas.height);
	
	if(!controller.transitioning) {
		controller.display.update();
	} else {
		controller.transition.update();
		if(!controller.transition.working) {
			controller.transitioning = false;
			controller.pickDisplay();
			controller.display.setup();
		}
	}
}, 20);