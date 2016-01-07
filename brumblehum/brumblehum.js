var rng = null;
var places = [{x: 0, y: 0, biome: "Plains"}];
var existing = null;
var placeInPlaces = null;
var countNotExist = 0;

var curPlace = {
  x: 0,
  y: 0,
  biome: "Plains"
};

function startGame() {
    $("#textShown").html("Choose a direction!");
    $('#startButton').remove();
    chooseDirection();
}

function chooseDirection() {
    $("#farLeftField").append('<button onclick="north();" style="display: block; margin: auto">North</button>');
    $("#midLeftField").append('<button onclick="south();" style="display: block; margin: auto">South</button>');
    $("#midRightField").append('<button onclick="east();" style="display: block; margin: auto">East</button>');
    $("#farRightField").append('<button onclick="west();" style="display: block; margin: auto">West</button>');
}

function newBiome() {
	rng = Math.floor((Math.random()*4)+1);
	switch(rng) {
  case 1: 
    curPlace.biome = "Plains"; 
    break;
  case 2: 
    curPlace.biome = "Mountain";
    break;
  case 3: 
    curPlace.biome = "Desert";
	  break;
  case 4: 
    curPlace.biome = "Forest";
    break;
  default:
  }
  $("#textShown").html(curPlace.biome);
}

function isSame () {
  var i = null;
  for (i = 0; i < places.length; i++) {
    if((places[i].x == curPlace.x) && (places[i].y == curPlace.y)) {
      placeInPlaces = i;
    } else {
      countNotExist += 1;
    }
  }
  if(countNotExist == places.length) {
    existing = false;
  } else {
    existing = true;
  }
  countNotExist = 0;
}

function generateLand() {
  	if(existing === false) {
	  places.push({x: curPlace.x, y: curPlace.y, biome: curPlace.biome});
    newBiome();
    $("#textShown").html("New Generation: " + curPlace.biome);
	} else if(existing === true) { //code block below kinda works :()
	  curPlace.biome = places[placeInPlaces].biome;
    $("#textShown").html("Old Generation: " + curPlace.biome);
	}
}

function north(){
	curPlace.y += 1;
	isSame();
  generateLand()
}

function south(){
	curPlace.y -= 1;
	isSame();
  generateLand()
}

function east(){
	curPlace.x += 1;
	isSame();
  generateLand()
}

function west(){
	curPlace.x -= 1;
	isSame();
  generateLand()
}