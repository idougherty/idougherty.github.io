function startGame() {
    $("#textShown").html("Choose a direction!");
    $('button').css('visibility', 'hidden');
    chooseDirection();
}

function chooseDirection() {
    $("#farLeftField").append('<button onclick="north();" style="display: block; margin: auto">North</button>');
    $("#midLeftField").append('<button onclick="south();" style="display: block; margin: auto">South</button>');
    $("#midRightField").append('<button onclick="east();" style="display: block; margin: auto">East</button>');
    $("#farRightField").append('<button onclick="west();" style="display: block; margin: auto">West</button>');
}

var rng = null;

function newBiome() {
	rng = Math.floor((Math.random()*4)+1);
	switch(rng){
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
  alert(curPlace.biome + " places: " + places)
}

  var places = [];

function isSame (value) {
  if ((value.x == curPlace.x) && (value.y == curPlace.y)){
  return value;
  }
}

var curPlace = {
  x: 0,
  y:0,
  biome:"Plains"
};

function north(){
  places.push({x: curPlace.x, y: curPlace.y, biome: curPlace.biome, existing: "existing"});
	curPlace.y += 1;
  if (places.filter(isSame).existing == "existing"){
    curPlace.biome = places.filter(isSame).biome;
    alert("hi mom");
	}	else {
    newBiome();
	}
}

function south(){
  places.push({x: curPlace.x, y: curPlace.y, biome: curPlace.biome, existing: "existing"});
	curPlace.y -= 1;
  if (places.filter(isSame).existing == "existing"){
    curPlace.biome = places.filter(isSame).biome;
    alert("hi mom");
	}	else {
    newBiome();
	}
}

function east(){
  places.push({x: curPlace.x, y: curPlace.y, biome: curPlace.biome, existing: "existing"});
	curPlace.x -= 1;
  if (places.filter(isSame).existing == "existing"){
    curPlace.biome = places.filter(isSame).biome;
    alert("hi mom");
	}	else {
    newBiome();
	}
}

function west(){
  places.push({x: curPlace.x, y: curPlace.y, biome: curPlace.biome, existing: "existing"});
	curPlace.x += 1;
  if (places.filter(isSame).existing == "existing"){
    curPlace.biome = places.filter(isSame).biome;
    alert("hi mom");
	}	else {
    newBiome();
	}
}