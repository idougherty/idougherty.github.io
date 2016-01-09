var rng = null;
var places = [{x: 0, y: 0, biome: "plains", specialty: "village"}];
var existing = null;
var placeInPlaces = null;
var countNotExist = 0;
var countStoryLine = 0;
var randomMonster = Math.floor(Math.random()*4);
var monsterChoices = ["bear", "giant snake", "giant eagle", "wandering bandit"];
var swordUpgradeCost = 100;
var newToVillage = true;

var user = {
  health: 10,
  sword: 5,
  item: "basic sheild",
  fireball: 1,
  potion: {
    amount: 0,
    type: null
  },
  money: 100,
};

var curPlace = {
  x: 0,
  y: 0,
  biome: "plains",
  specialty: "village"
};

function startGame() {
  $('#startButton').remove();
  story();
}

function nextText() {
  var storyText = ["Your village has been undergoing drought for years and years.", "You, as the elected champion of your village,", "have set out to talk to the ancient wizard about the problem.", "Once you climb the mountain to get to his towering steeple,", "you learn that the ancient wizard is dying,", "and you must bring back the prosperity of their lands.", "He tells the story of how once there were 4 artifacts,", "that when brought together let the ancient Bramblehamian River flow free.", "but after the great civil war where Brambleham split into Brumblehum and Breembleheem", "he had hidden the artifacts in four dungeons spread across the land, one in each biome.", "He says that you are the one that must bring them together,", "and restore peace and prosperity to all the lands."];
  $("#textShown").html(storyText[countStoryLine]);
  countStoryLine++;
  if(countStoryLine > storyText.length) {
    village();
  }
}

function story() {
  $("#textShown").html("Welcome to the Brumblehum RPG game!");
  $("#1choice").append('<button onclick="nextText();" id="continueButton" class="btn btn-default" style="display: block; margin: auto">Continue</button>');
}

function chooseDirection() {
  $("#textShown").html("Choose a direction!");
  $("#continueButton").remove();
  $("#moveOnButton").remove();
  $("#exploreButton").remove();
  $("#villageButton2").remove();
  $("#villageButton3").remove();
  $("#villageButton4").remove();
  $("#farLeftField").append('<button onclick="north();" id="directionButton1" class="btn btn-default" style="display: block; margin: auto">North</button>');
  $("#midLeftField").append('<button onclick="south();" id="directionButton2" class="btn btn-default" style="display: block; margin: auto">South</button>');
  $("#midRightField").append('<button onclick="east();" id="directionButton3" class="btn btn-default" style="display: block; margin: auto">East</button>');
  $("#farRightField").append('<button onclick="west();" id="directionButton4" class="btn btn-default" style="display: block; margin: auto">West</button>');
}

function chooseExploration() {
  $("#directionButton1").remove();
  $("#directionButton2").remove();
  $("#directionButton3").remove();
  $("#directionButton4").remove();
  $("#2choice-left").append('<button onclick="chooseDirection();" id="moveOnButton" class="btn btn-default" style="display: block; margin: auto">Move On</button>');
  $("#2choice-right").append('<button onclick="explore();" id="exploreButton" class="btn btn-default" style="display: block; margin: auto">Explore</button>');
}

function newBiome() {
	rng = Math.floor((Math.random()*4)+1);
	switch(rng) {
  case 1: 
    curPlace.biome = "plains"; 
    break;
  case 2: 
    curPlace.biome = "mountain";
    break;
  case 3: 
    curPlace.biome = "desert";
	  break;
  case 4: 
    curPlace.biome = "forest";
    break;
  default:
  }
  rng = Math.floor((Math.random()*12)+1);
	switch(rng) {
  case 1: 
    curPlace.specialty = "dungeon"; 
    break;
  case 2: 
    curPlace.specialty = "nothing";
    break;
  case 3: 
    curPlace.specialty = "nothing";
	  break;
  case 4: 
    curPlace.specialty = "nothing";
    break;
  case 5: 
    curPlace.specialty = "village";
    break;
  case 6: 
    curPlace.specialty = "village";
    break;
  case 7: 
    curPlace.specialty = "village";
    break;
  case 8: 
    curPlace.specialty = "village";
	  break;
  case 9: 
    curPlace.specialty = "monster";
    break;
  case 10: 
    curPlace.specialty = "monster";
    break;
  case 11: 
    curPlace.specialty = "monster";
    break;
  case 12: 
    curPlace.specialty = "monster";
    break;
  default:
  }
  places.push({x: curPlace.x, y: curPlace.y, biome: curPlace.biome, specialty: curPlace.specialty});
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
    newBiome();
	} else if(existing === true) { //code block below kinda works :()
	  curPlace.biome = places[placeInPlaces].biome;
	}
	$("#textShown").html("You find yourself in a " + curPlace.biome + " biome.");
}

function north(){
	curPlace.y += 1;
	isSame();
  generateLand();
  chooseExploration();
}

function south(){
	curPlace.y -= 1;
	isSame();
  generateLand();
  chooseExploration();
}

function east(){
	curPlace.x += 1;
	isSame();
  generateLand();
  chooseExploration();
}

function west(){
	curPlace.x -= 1;
	isSame();
  generateLand();
  chooseExploration();
}

function village() {
  if(newToVillage === true) {
    $("#textShown").html("Do you want to rest, upgrade your sword at the blacksmith's, or buy some potions at the shop?");
    newToVillage = false;
  }
  $("#exploreButton").remove();
  $("#moveOnButton").remove();
  $("#continueButton").remove();
  $("#villageButton2").remove();
  $("#villageButton3").remove();
  $("#villageButton4").remove();
  $("#yesButton").remove();
  $("#noButton").remove();
  $("#farLeftField").append('<button onclick="chooseDirection();" id="moveOnButton" class="btn btn-default" style="display: block; margin: auto">Move On</button>');
  $("#midLeftField").append('<button onclick="restOption();" id="villageButton2" class="btn btn-default" style="display: block; margin: auto">Rest</button>');
  $("#midRightField").append('<button onclick="upgradeSwordOption();" id="villageButton3" class="btn btn-default" style="display: block; margin: auto">Upgrade Sword</button>');
  $("#farRightField").append('<button onclick="choosePotion();" id="villageButton4" class="btn btn-default" style="display: block; margin: auto">Buy Potions</button>');
}

function restOption() {
  $("#textShown").html("Do you want to rest and heal for 75 coins?");
  $("#directionButton1").remove();
  $("#directionButton2").remove();
  $("#directionButton3").remove();
  $("#directionButton4").remove();
  $("#moveOnButton").remove();
  $("#villageButton2").remove();
  $("#villageButton3").remove();
  $("#villageButton4").remove();
  $("#2choice-left").append('<button onclick="rest();" id="yesButton" class="btn btn-default" style="display: block; margin: auto">Yes</button>');
  $("#2choice-right").append('<button onclick="village();" id="noButton" class="btn btn-default" style="display: block; margin: auto">No</button>');
}

function rest() {
  if(user.money >= 100) {
    user.money -= 75;
    user.health = 10;
    user.fireball = 1;
    $("#textShown").html("You feel refreshed and ready to explore.");
  } else {
    $("#textShown").html("You do not have enough coins to rest here! You have " + user.money + " coins!");
  }
  village();
}

function upgradeSwordOption() {
  $("#textShown").html("Would you like to upgrade your sword for " + swordUpgradeCost + " coins?");
  $("#directionButton1").remove();
  $("#directionButton2").remove();
  $("#directionButton3").remove();
  $("#directionButton4").remove();
  $("#moveOnButton").remove();
  $("#villageButton2").remove();
  $("#villageButton3").remove();
  $("#villageButton4").remove();
  $("#2choice-left").append('<button onclick="upgradeSword();" id="yesButton" class="btn btn-default" style="display: block; margin: auto">Yes</button>');
  $("#2choice-right").append('<button onclick="village();" id="noButton" class="btn btn-default" style="display: block; margin: auto">No</button>');
}

function upgradeSword() {
  if(user.money >= 100) {
    user.money -= swordUpgradeCost;
    user.sword += 5;
    $("#textShown").html("Your sword is now lighter, stronger, and sharper!");
  } else {
    $("#textShown").html("You do not have enough coins to upgrade your sword! You have " + user.money + " coins!");
  }
  village();
}

function choosePotion() {
  $("#textShown").html("Would you like to buy a health potion or an energy potion?");
  $("#directionButton1").remove();
  $("#directionButton2").remove();
  $("#directionButton3").remove();
  $("#directionButton4").remove();
  $("#moveOnButton").remove();
  $("#villageButton2").remove();
  $("#villageButton3").remove();
  $("#villageButton4").remove();
  $("#2choice-left").append('<button onclick="buyHealthOption();" id="buyHealthButton" class="btn btn-default" style="display: block; margin: auto">Buy Health</button>');
  $("#2choice-right").append('<button onclick="buyEnergyOption();" id="buyEnergyButton" class="btn btn-default" style="display: block; margin: auto">Buy Energy</button>');
}

function buyHealthOption() {
  $("#buyEnergyButton").remove();
  $("#buyHealthButton").remove();
  $("#textShown").html("Would you like to buy a health potion that regenerates you 5 health for 50 coins?");
  $("#2choice-left").append('<button onclick="buyHealth();" id="yesButton" class="btn btn-default" style="display: block; margin: auto">Yes</button>');
  $("#2choice-right").append('<button onclick="village();" id="noButton" class="btn btn-default" style="display: block; margin: auto">No</button>');
}

function buyHealth() {
  if(user.money >= 50 && user.potion.type != "energy") {
    user.money = 50;
    user.sword += 5;
    user.potion.type = "health";
    user.potion.amount += 1;
    $("#textShown").html("You now have a potion that heals you 5 health when used in combat!");
  } else if(user.money < 50) {
    $("#textShown").html("You do not have enough coins to buy a potion! You have " + user.money + " coins!");
  } else {
    $("#textShown").html("You can't have both energy potions and health potions, if they are accidentally mixed, they become highly explosive!");
  }
  village();
}

function buyEnergyOption() {
  $("#buyEnergyButton").remove();
  $("#buyHealthButton").remove();
  $("#textShown").html("Would you like to buy an energy potion that regenerates you 5 health for 50 coins?");
  $("#2choice-left").append('<button onclick="buyEnergy();" id="yesButton" class="btn btn-default" style="display: block; margin: auto">Yes</button>');
  $("#2choice-right").append('<button onclick="village();" id="noButton" class="btn btn-default" style="display: block; margin: auto">No</button>');
}

function buyEnergy() {
  if(user.money >= 50 && user.potion.type != "health") {
    user.money = 50;
    user.sword += 5;
    user.potion.type = "energy";
    $("#textShown").html("You now have a potion that regenerates your fireball when used in combat!");
  } else if(user.money < 50) {
    $("#textShown").html("You do not have enough coins to buy a potion! You have " + user.money + " coins!");
  } else {
    $("#textShown").html("You can't have both energy potions and health potions, if they are accidentally mixed, they become highly explosive!");
  }
  village();
}

function fight() {
  $("#directionButton1").remove();
  $("#directionButton2").remove();
  $("#directionButton3").remove();
  $("#directionButton4").remove();
  $("#moveOnButton").remove();
  $("#farLeftField").append('<button onclick="attack();" id="attackButton" class="btn btn-default" style="display: block; margin: auto">Attack</button>');
  $("#midLeftField").append('<button onclick="fireball();" id="fireballButton" class="btn btn-default" style="display: block; margin: auto">FireBall(' + user.fireball + ')</button>');
  $("#midRightField").append('<button onclick="potion();" id="potionButton" class="btn btn-default" style="display: block; margin: auto">Use Potions(' + user.potion.amount + ')</button>');
  $("#farRightField").append('<button onclick="flee();" id="fleeButton" class="btn btn-default" style="display: block; margin: auto">Flee</button>');
}

function explore() {
  switch(curPlace.specialty) {
    case "dungeon":
      $("#textShown").html("You find the entrance to a dungeon.");
      switch(curPlace.biome) {
        case "plains":
          
          break;
        case "desert":
          
          break;
        case "forest":
          
          break;
        case "mountains":
          
          break;
        default:
      }
      break;
    case "monster":
      var randomMonster = Math.floor(Math.random()*4);
      var monster = monsterChoices[randomMonster];
      $("#textShown").html("You are attacked by a " + monsterChoices[randomMonster] + "!");
      $("#2choice-right").append('<button onclick="fight();" id="" class="btn btn-default" style="display: block; margin: auto"></button>');
      break;
    case "village":
      $("#textShown").html("You find a village where you can heal your wounds and buy items.");
      newToVillage = true;
      $("#2choice-right").append('<button onclick="village();" id="exploreButton" class="btn btn-default" style="display: block; margin: auto">Explore the Village</button>');
      $("#exploreButton").remove();
      break;
    case "nothing":
      $("#textShown").html("You find no significant features in the " + curPlace.biome + ".");
      $("#exploreButton").remove();
      break;
    default:
  }
}