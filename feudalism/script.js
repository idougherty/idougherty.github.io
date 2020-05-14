var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
var knife = document.getElementById("knife");
var knife2 = document.getElementById("knife2");
var axe = document.getElementById("axe");
var axe2 = document.getElementById("axe2");
var axedown = document.getElementById("axedown");
var axedown2 = document.getElementById("axedown2");
var heart = document.getElementById("heart");
var arrow = document.getElementById("arrow");
var bow = document.getElementById("bow");
var bowdrawn = document.getElementById("bowdrawn");
var logo = document.getElementById("menu");
var castle = document.getElementById("castle");
var castle2back = document.getElementById("castle2back");
var castle2front = document.getElementById("castle2front");
var town = document.getElementById("town");
var grass = document.getElementById("grass");
var playerR = document.getElementById("player");
var playerL = document.getElementById("player2");
var enemyL = document.getElementById("enemy");
var enemyR = document.getElementById("enemy2");
var menu2xJump = document.getElementById("menu-2xjump");
var menuFireball = document.getElementById("menu-fireball");
var menuShield = document.getElementById("menu-shield");
var menuMeteors = document.getElementById("menu-meteors");
var menuRage = document.getElementById("menu-rage");
var fireball = document.getElementById("fireball");

var p = [];

function Particle(x, y) {
	this.x = x;
	this.y = y;
	this.vx = 5*Math.random()-2.5;
	this.vy = -7*Math.random();
	this.width = 5;
	this.color = "rgba("+(Math.floor(Math.random()*100) + 155)+", 50, 30, 1)";
	this.run = function() {
		c.fillStyle = this.color;
		c.fillRect(this.x, this.y, this.width, this.width);
		
		this.vx *= .98;
		this.vy += .3;

		this.width -= .1;
		this.x += this.vx;
		this.y += this.vy;
	}
}

var arrows = [];

function Arrow(x, y) {
	this.x = x;
	this.y = y;
	this.vx = -15;
	this.vy = -.1;
	this.width = 32;
	this.height = 4;
	this.damage = 1;
	this.run = function() {
		c.drawImage(arrow, this.x, this.y, this.width, this.height);
		
		this.vy += .01;

		this.x += this.vx;
		this.y += this.vy;
		
		if(this.damage === 1 && this.x < player.x + player.width && this.x + this.width > player.x && this.y < player.y + player.height && this.y + this.height > player.y) {
			player.hit();
			this.damage = 0;
		};
	};
}

var fireballs = [];

function Fireball(x, y, vx) {
	this.x = x;
	this.y = y;
	this.vx = vx;
	this.width = 30;
	this.height = 30;
	this.d = 0;
	this.timer = 0;
	this.run = function() {
		c.translate(this.x + this.width/2, this.y + this.height/2);
		c.rotate(this.d*Math.PI/180);
		c.drawImage(fireball, -1/2*this.width, -1/2*this.height, this.width, this.height);
		c.rotate(-this.d*Math.PI/180);
		c.translate(-this.x - this.width/2, -this.y - this.height/2);
		
		this.timer++;
		this.x += this.vx;
		
		if(this.timer%1 === 0) {
			this.d += 20;
		}
		
		for(var i = 0; i < enemies.length; i++) {
			if(enemies[i].tookDamageFireball === false && this.x < enemies[i].x + enemies[i].width && this.x + this.width > enemies[i].x && this.y < enemies[i].y + enemies[i].height && this.y + this.height > enemies[i].y) {
				enemies[i].health -= 3;
				enemies[i].tookDamageFireball = true;
				
				for(var j = 0; j < 20; j++) {
					p.push(new Particle(enemies[i].x + 12.5, enemies[i].y + 25));
				}
			}
		}
	};
}

var player = {
	state: "menu",
	screen: "field",
	x: 100,
	y: 350,
	vx: 0,
	vy: 0,
	d: 1,
	width: 25,
	height: 50,
	ducking: false,
	speed: 1,
	stabtime: 0,
	health: 3,
	wave: 1,
	jumps: false,
	weapon: "knife",
	abilityBasic: "fireball",
	abilityAdv: null,
	restart: function() {
		player.state === menu;
		player.ducking = false;
		player.speed = 1;
		player.height = 50;
		player.health = 3;
		player.wave = 1;
		
		red = 0;
		wave.curwave = 0;
		wave.running = true;
		wave.cwave = wave.waves[0];
		
		enemies.splice(0, enemies.length);
		arrows.splice(0, arrows.length);
		p.splice(0, p.length);
	},
	hit: function() {
		red = .8;
		player.health--;
	},
	keydown: {
		w: false,
		a: false,
		s: false,
		d: false,
		m: false,
		n: false,
		space: false,
	},
	draw: function() {
		if(player.vx >= 0) {
			c.drawImage(playerR, player.x, player.y);
		} else if(player.vx < 0){
			c.drawImage(playerL, player.x, player.y);
		}
	},
	move: function() {
		if(player.keydown.a) {
			player.vx = -6;
		}

		if(player.keydown.d) {
			player.vx = 6;
		}
		
		if(player.keydown.s && player.y + player.height >= 400 && !player.ducking) {
			player.ducking = true;
			player.height = 30;
			player.y += 20;
			player.speed = 1/2;
		} else if(player.ducking && !player.keydown.s){
			player.ducking = false;
			player.y -= 20;
			player.height = 50;
			player.speed = 1;
		}
		
		if((player.keydown.w && player.y + player.height >= 400 && !player.ducking)||(player.keydown.w && player.vy > -3 && player.abilityBasic === "2xjump" && player.jumps < 2)) {
			player.vy = -8.5;
			player.jumps++;
		}
	},
	attack: function() {
		player.stabtime++;
		
		if(player.stabbing && player.stabtime > 5) {
				player.stabbing = false;
		}
		
		if(player.keydown.space && !player.stabbing && player.stabtime > 10) {
			player.stabbing = true;
			player.stabtime = 0;
			for(var i = 0; i < enemies.length; i++) {
				enemies[i].tookDamage = false;
			}
		}
		
		switch(player.weapon) {
			case "knife":
			case "spear":
				var offset = 0;
				var x;
				var y;
				if(player.stabbing) {
					offset = 10;
				}
				if(player.vx >= 0) {
					x = player.x + 15 + offset;
					y = player.y + player.height/2;
					c.drawImage(knife, x, y, 30, 10);
				} else if(player.vx < 0) {
					x = player.x - 20 - offset;
					y = player.y + player.height/2;
					c.drawImage(knife2, x, y, 30, 10);
				}
				if(player.stabbing) {
					for(var i = 0; i < enemies.length; i++) {
						if(enemies[i].tookDamage === false && x < enemies[i].x + enemies[i].width && x + 30 > enemies[i].x && y < enemies[i].y + enemies[i].height && y + 10 > enemies[i].y) {
							
							enemies[i].health -= 2;
							enemies[i].tookDamage = true;
							for(var j = 0; j < 20; j++) {
								p.push(new Particle(enemies[i].x + 12.5, enemies[i].y + 25));
							}
						}
					}
				}
				break;
			case "axe":
			case "sword":
				break;
			case "bow":
				break;
			default:
		}
		
		if(this.keydown.n) {
			switch(this.abilityBasic) {
				case "fireball":
					if(fireballs.length === 0) {
						fireballs.push(new Fireball((player.x + player.width), (player.y+player.height/4), 5))
					}
					break;
				default:
			}
		}
		
		if(fireballs.length !== 0) {
			fireballs[0].run();
			if(fireballs[0].x > 500) {
				fireballs.splice(0, 1);
				for(var i = 0; i < enemies.length; i++) {
					enemies[i].tookDamageFireball = false;
				}
			}
		}
		
		for(var i = 0; i < enemies.length; i++) {
			if(enemies[i].health <= 0) {
				for(var j = 0; j < 40; j++) {
					p.push(new Particle(enemies[i].x + 12.5, enemies[i].y + 25));
				}
				enemies.splice(i, 1);
			}
		}
	},
	run: function() {
		player.draw();
		player.move();
		player.attack();
		
		
		player.vx *= player.speed;		
		
		player.x += player.vx;
		player.y += player.vy;
		
		player.vx *= .74;
		player.vy *= .99;

		if(player.y < 400 - player.height) {
			player.vy += .5;
		} else {
			player.vy = 0;
			player.y = 400 - player.height;
			player.jumps = 0;
		}
		
		if(player.x < 40 && player.screen === "field") {
			player.vx = 0;
			player.x = 40;
		} else if(player.x < 0){
			player.vx = 0;
			player.x = 0;
		}

		if(player.x + player.width > 500) {
			player.vx = 0;
			player.x = 500 - player.width;
		}
	},
};

document.addEventListener("keydown", function(e) {
	switch(e.keyCode) {
		case 87:
			player.keydown.w = true;
			break;
		case 65:
			player.keydown.a = true;
			break;
		case 83:
			player.keydown.s = true;
			break;
		case 68:
			player.keydown.d = true;
			break;
		case 77:
			player.keydown.m = true;
			break;
		case 78:
			player.keydown.n = true;
			break;
		case 32:
			player.keydown.space = true;
			break;
		case 13:
			if(player.state === "menu") {
				player.restart();
				player.state = "playing"
			}
			break;
		default:
	}
});

document.addEventListener("keyup", function(e) {
	switch(e.keyCode) {
		case 87:
			player.keydown.w = false;
			break;
		case 65:
			player.keydown.a = false;
			break;
		case 83:
			player.keydown.s = false;
			break;
		case 68:
			player.keydown.d = false;
			break;
		case 77:
			player.keydown.m = false;
			break;
		case 78:
			player.keydown.n = false;
			break;
		case 32:
			player.keydown.space = false;
			break;
		default:
	}
});

var enemies = [];

var wave = {
	curwave: 0,
	timer: 0,
	wait: 0,
	running: false,
	waves: [["melee",],
			["ranged", 1, "melee", 1, "melee"],
			["ranged", 3, "melee", 4, "melee"],
			["ranged", 1, "melee"]],
	cwave: [],
	run: function() {
		if(wave.cwave.length > 0) {
			if(wave.timer >= wave.wait) {
				if(typeof(wave.cwave[0]) === "string") {
					wave.wait = 0;
					wave.timer = 0;
					enemies.push(new Enemy(wave.cwave[0]));
				} else {
					wave.wait = wave.cwave[0] * 100/3;
				}
				wave.cwave.splice(0,1);
			}
			wave.timer++;
		} else if(enemies.length === 0 && wave.running === true){
			wave.running = false;
			wave.reset();
		}
	},
	reset: function() {
		player.health = 3;
			wave.curwave++;
			wave.cwave = ((wave.waves.length > wave.curwave)? wave.waves[wave.curwave] : ["ranged"]);
	}
};

function Enemy(type) {
	this.type = type;
	this.x = 500;
	this.y = 350;
	this.width = 25;
	this.height = 50;
	this.vx = 0;
	this.vy = 0;
	this.d = -1;
	this.attacking = false;
	this.attacktime = 100;
	this.damage = 1;
	this.speed = 3 + Math.random();
	this.health = 6;
	this.tookDamage = false;
	this.tookDamageFireball = false;
	this.draw = function() {
		if(this.d < 0) {
			c.drawImage(enemyL, this.x, this.y, this.width, this.height);
		} else {
			c.drawImage(enemyR, this.x, this.y, this.width, this.height);
		}
		switch(this.type) {
			case "melee":
				if(this.d < 0) {
					if(this.attacking) {
						c.drawImage(axedown, this.x - 33, this.y - 20);
					} else {
						c.drawImage(axe, this.x - 8, this.y - 20);
					}
				} else if(this.d > 0) {
					if(this.attacking) {
						c.drawImage(axedown2, this.x + 8, this.y - 20);
					} else {
						c.drawImage(axe2, this.x + 8, this.y - 20);
					}
				}
				break;
			case "ranged":
				if(this.attacking) {
					c.drawImage(bowdrawn, this.x - 20, this.y - 5);
				} else {
					c.drawImage(bow, this.x - 10, this.y - 5);
				}
			default:
		}
	};
	this.meleeAI = function() {
		if(this.x > player.x) {
			this.d = -1;
		} else {
			this.d = 1;
		}
		
		if(Math.abs(this.x - player.x) > 50) {
			if(this.x > player.x) {
				this.vx = -this.speed;
			} else {
				this.vx = this.speed;
			}
		} else if(this.attacktime > 40){
			this.attacktime = 0;
			this.damage = 1;
		}
		
		this.attacktime++;
		
		if(this.attacktime > 10 && this.attacktime < 15) {
			this.attacking = true;
		} else {
			this.attacking = false;
		}

		if(this.attacking && this.damage !== 0) {
			if(this.d < 0) {
				if(this.x - 33 < player.x + player.width && this.x > player.x && this.y < player.y + player.height && this.y + 30 > player.y) {
					player.hit();
					this.damage = 0;
				}
			} else {
				if(this.x + this.width < player.x + player.width && this.x + 58 > player.x && this.y < player.y + player.height && this.y + 30 > player.y) {
					player.hit();
					this.damage = 0;
				}
			}
		}
	};
	this.rangedAI = function() {
		if(this.x > 460) {
			this.vx = -4.5;
		} else if(this.attacktime > 60){
			this.attacking = true;
			this.attacktime = 0;
		}

		this.attacktime++;
		if(this.attacking && this.attacktime > 20) {
			this.attacking = false;
			arrows.push(new Arrow(this.x - 5, this.y + 13));
		}
	};
	this.run = function() {
		this.draw();
		
		switch(this.type) {
			case "melee":
				this.meleeAI();
				break;
			case "ranged":
				this.rangedAI();
				break;
			default:
		}
		
		if(this.attacking) {
			this.vx =  0;
		}
		
		this.x += this.vx
		this.vx *= .6
	}
}

menu = {
	pane: null,
	justentered: false,
	run: function() {
		if(player.x > 40 && player.x < 150) {
			if(!menu.justentered) {
				menu.justentered = true;
				menu.pane = menu2xJump;
			}
			if(195 > lastClick.x && lastClick.x > 95) {
				if(86 > lastClick.y && lastClick.y > 68) {
					menu.pane = menu2xJump;
				} else if(104 > lastClick.y && lastClick.y > 86) {
					menu.pane = menuFireball;
				} else if(123 > lastClick.y && lastClick.y > 104) {
					menu.pane = menuShield;
				} else if(150 > lastClick.y && lastClick.y > 130) {
					menu.pane = menuMeteors;
				} else if(168 > lastClick.y && lastClick.y > 150) {
					menu.pane = menuRage;
				}
			}
		} else if(player.x > 170 && player.x < 280) {
			
		} else if(player.x > 300 && player.x < 410) {
			
		} else {
			menu.justentered = false;
			menu.pane = null;
		}
		
		if(lastClick.x > 230 && lastClick.x <400 && lastClick.y < 160 && lastClick.y > 135) {
			switch(menu.pane) {
				case menu2xJump:
					player.abilityBasic = "2xjump";
					break;
				case menuFireball:
					player.abilityBasic = "fireball";
					break;
				case menuShield:
					player.abilityBasic = "shield";
					break;
				case menuMeteors:
					player.abilityAdv = "meteors";
					break;
				case menuRage:
					player.abilityAdv = "rage";
					break;
				default:
			}
			lastClick = {x: 0, y: 0};
		}
		
		if(menu.pane !== null) c.drawImage(menu.pane, 70, 20);
	},
};

function drawUI() {
	
}

lastClick = {
	x: 0,
	y: 0,
}

document.addEventListener("click", function(e) {
	lastClick = {
		x: e.pageX - document.getElementById("canvas").getBoundingClientRect().left,
		y: e.pageY - document.getElementById("canvas").getBoundingClientRect().top,
	};
});
	
function runGame() {
	wave.run();
	
	for(var i = 0; i < enemies.length; i++) {
		enemies[i].run(i);
	}
	
	for(var i = 0; i < p.length; i++) {
		p[i].run();
		if(p[i].width <= 0) {
			p.splice(i, 1);
		}
	}

	for(var i = 0; i < arrows.length; i++) {
		arrows[i].run();
		if(arrows[i].x + arrows[i].width <= 0) {
			arrows.splice(i, 1);
		}
	}
	
	player.run();
}

var red = 0;
setInterval(function() {
	if(player.state === "playing") {
		if(player.health > 0) {
			if(wave.running) {
				c.fillStyle = "#5af";
				c.fillRect(0, 0, 500, 500);
				c.drawImage(grass2, 0, 350);
				c.drawImage(castle, -50, 20, 200, 400);

				runGame();
				
				c.drawImage(grass, 0, 390, 500, 110);
				
				for(var i = 0; i < player.health; i++) {
					c.drawImage(heart, 450, 10 + i*35);
				}
				
				if(red >= 0) {
					red -= .1;
					c.fillStyle = "rgba(230, 40, 40, "+red+")";
					c.fillRect(0, 0, 500, 500);
				}
				
			} else {
				if(player.screen === "field") {
					c.fillStyle = "#5af";
					c.fillRect(0, 0, 500, 500);
					c.drawImage(grass2, 0, 350);
					c.drawImage(castle2back, -50, 20);
					
					player.run();
					
					for(var i = 0; i < p.length; i++) {
						p[i].run();
						if(p[i].width <= 0) {
							p.splice(i, 1);
						}
					}

					for(var i = 0; i < arrows.length; i++) {
						arrows[i].run();
						if(arrows[i].x + arrows[i].width <= 0) {
							arrows.splice(i, 1);
						}
					}
					
					if(player.x <= 40) {
						player.screen = "shop";
						player.x = 499 - player.width;
					}
					
					c.drawImage(grass, 0, 390, 500, 110);
					c.drawImage(castle2front, -50, 20);
				} else if (player.screen === "shop") {
					c.fillStyle = "#5af";
					c.fillRect(0, 0, 500, 500);
					c.drawImage(grass2, 0, 350);
					c.drawImage(town, 0, 0, 500, 400);
					
					player.run();
					menu.run();
					
					if(player.x + player.width >= 500) {
						player.screen = "field";
						player.x = 45;
						wave.running = true;
					}
					
					c.drawImage(grass, 0, 390);
				}
			}
		} else if(player.health < 1) {
			player.state = "menu";
		}
	} else if(player.state === "menu") {
		if(player.screen === "field") {
			c.fillStyle = "#5af";
			c.fillRect(0, 0, 500, 500);
			c.drawImage(grass2, 0, 350);
			c.drawImage(castle2back, -50, 20);
			
			player.run();
			
			if(player.x <= 40) {
				player.screen = "shop";
				player.x = 499 - player.width;
			}
			
			c.drawImage(grass, 0, 390, 500, 110);
			c.drawImage(castle2front, -50, 20);
			c.drawImage(logo, 0, 0, 500, 500);
		} else if (player.screen === "shop") {
			c.fillStyle = "#5af";
			c.fillRect(0, 0, 500, 500);
			c.drawImage(grass2, 0, 350);
			c.drawImage(town, 0, 0, 500, 400);
			
			player.run();
			
			if(player.x + player.width >= 500) {
				player.screen = "field";
				player.x = 45;
			}
			
			c.drawImage(grass, 0, 390);
		}
	}
}, 30);