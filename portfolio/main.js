function showModal(card) {
	switch(card) {
		case "cave3d":
			$('#mdlTitle').text("3d Cave");
			$('#mdlText').text("This mesh is generated from the cave generator, and rendered with the self built 3d engine. Eventually, I would like to make this into a procedural doom style game, but for now it can just be explored from room to room.");

			$('#mdlImg').attr("src", "img/cave3d.png");
			$('#mdlLink').attr("href", "https://idougherty.github.io/3d/cave");
			$('#mdlOverlay').show();
			break;

		case "3dteapot":
			$('#mdlTitle').text("3d Engine");
			$('#mdlText').text("This is a 3d engine I built in javascript, it took me a few months and a lot of new math. The model in the picture is my high polygon render of the Utah Teapot. In the actual demo the resolution is lessened to run in real time. Hold down the mouse to look around and use WASD to move.");

			$('#mdlImg').attr("src", "img/3dteapot.png");
			$('#mdlLink').attr("href", "https://idougherty.github.io/3d");
			$('#mdlOverlay').show();
			break;

		case "cavegen":
			$('#mdlTitle').text("cavegen");
			$('#mdlText').text("A procedural cave generator. It uses binary space partitioning to create rooms, random noise and cellular automata to add features to those rooms, and minimum spanning trees to connect the rooms.");

			$('#mdlImg').attr("src", "img/cavegen.png");
			$('#mdlLink').attr("href", "https://idougherty.github.io/cavegen");
			$('#mdlOverlay').show();
			break;

		case "trackgen":
			$('#mdlTitle').text("Track Generator");
			$('#mdlText').text("A procedural track generator from the f1 racing simulator. Tracks will be generated for daily and weekly races. It is formed by generating random points on a circle, distorting them with perlin noise, using separation forces to spread them out, and fitting curves between them.");

			$('#mdlImg').attr("src", "img/trackgen.png");
			$('#mdlLink').attr("href", "https://idougherty.github.io/f1-minigames/trackgen");
			$('#mdlOverlay').show();
			break;

		case "lavarun":
			$('#mdlTitle').text("SuperSuit");
			$('#mdlText').text("A minigame from the f1 racing simulator, these minigames will be part of a weekly race with special events. This minigame will be a driving event. If the player wins they will get a boost, if they fail their car will be damaged.");

			$('#mdlImg').attr("src", "img/lavarun.png");
			$('#mdlLink').attr("href", "https://idougherty.github.io/f1-minigames/lavarunner");
			$('#mdlOverlay').show();
			break;
	
		case "cupgame":
			$('#mdlTitle').text("Cup Game");
			$('#mdlText').text("A minigame from the f1 racing simulator, these minigames will be part of a weekly race with special events. The cup game will be a pit minigame that rewards or punishes your tires depending on the outcome of the game.");

			$('#mdlImg').attr("src", "img/cupgame.png");
			$('#mdlLink').attr("href", "https://idougherty.github.io/f1-minigames/cupgame");
			$('#mdlOverlay').show();
			break;
	
		case "flyswatter":
			$('#mdlTitle').text("Fly Swatter");
			$('#mdlText').text("A minigame from the f1 racing simulator, these minigames will be part of a weekly race with special events. This minigame will be a driving event. Depending on the players performance they will either lose some control over their car or gain speed.");

			$('#mdlImg').attr("src", "img/flyswatter.png");
			$('#mdlLink').attr("href", "https://idougherty.github.io/f1-minigames/flyswatter");
			$('#mdlOverlay').show();
			break;
	
		case "mixer":
			$('#mdlTitle').text("Paint Mixer");
			$('#mdlText').text("A minigame from the f1 racing simulator, these minigames will be part of a weekly race with special events. The fuel mixing game will be a pit minigame that rewards or punishes your fuel/engine depending on the outcome of the game.");

			$('#mdlImg').attr("src", "img/mixer.png");
			$('#mdlLink').attr("href", "https://idougherty.github.io/f1-minigames/fuelmixer");
			$('#mdlOverlay').show();
			break;

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
			$('#mdlText').text("Point and click to jump and try to hit other players into the lava. This project uses Node.js and supports up to five remote players. It used to be hosted on a Raspberry Pi from my basement, however it is not currently hosted anywhere. For now, I have a video of some gameplay uploaded to my drive to see.");

			$('#mdlImg').attr("src", "img/lava.png");
			$('#mdlLink').attr("href", "");
			$('#mdlOverlay').show();
			break;

		case "basketball":
			$('#mdlTitle').text("NBA 3K");
			$('#mdlText').text("Use WASD to move and hold shift to charge a shot, the ball will shoot on release. This was my first project to use Node.js to allow for multiple computers to play. Development was started 8th grade, and polishing continued into junior year due to it's popularity. It was temporarily hosted on a Raspberry Pi in my basement, but it is not currently running. There is a video of some gameplay on my drive to see.");

			$('#mdlImg').attr("src", "img/basketball.png");
			$('#mdlLink').attr("href", "");
			$('#mdlOverlay').show();
			break;

		case "cruiser":
			$('#mdlTitle').text("Custom Cruiser Deck");
			$('#mdlText').text("This was a small project I did with my dad to learn a bit how skateboard decks are made. It's made from four quarter inch sheets of maple that were laminated together. Afterwards we sanded and stained the deck to make it look a little nicer. I think it's pretty nice but I would make a more ambitious shape if I were to do it again.");

			$('#mdlImg').attr("src", "img/cruiser.jpg");
			$('#mdlLink').attr("href", "javascript:void(0)");
			$('#mdlOverlay').hide();
			break;

		case "heely":
			$('#mdlTitle').text("Custom Heely's");
			$('#mdlText').text("I found a pair of size 6 childrens heely's at a thrift store then dug out the wheel components and stuck them on a shoe my size. They function just as well as standard heely's do and the material cost was only $6.");

			$('#mdlImg').attr("src", "img/heely.jpg");
			$('#mdlLink').attr("href", "javascript:void(0)");
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
		
		case "checkers":
			$('#mdlTitle').text("Checkers AI");
			$('#mdlText').text("I made this for a final project in my Intro to AI class, it uses a minimax algorithm to find the optimal move for a certain depth. I would like to come back and test more heuristics for scoring the board and also add pruning to allow for the algorithm to read more moves in advance. It can still beat me in its current state, but I welcome challengers. The program was written in python so the link will download the file.");

			$('#mdlImg').attr("src", "img/checkers.png");
			$('#mdlLink').attr("href", "https://idougherty.github.io/checkers.py");
			$('#mdlOverlay').show();
			break;
		
		case "feudalism":
			$('#mdlTitle').text("Feudalism");
			$('#mdlText').text("Use WASD to move and space to attack, press enter to start. This game is unfinished but the premise is you are a knight protecting a castle, and in return for fighting waves of enemies you can buy upgrades and weapons. This project taught me a lot about managing the scope of a game, there were many features I wanted to add, but ultimately the project was too large for the little experience with game development I had. Despite this, I am happy with how a lot of the art and style turned out for this game.");

			$('#mdlImg').attr("src", "img/feudalism.png");
			$('#mdlLink').attr("href", "https://idougherty.github.io/feudalism");
			$('#mdlOverlay').show();
			break;
		
		case "airhockey":
			$('#mdlTitle').text("Car Airhockey");
			$('#mdlText').text("A local multiplayer airhockey game where you play as cars. Player 1 uses WASD and player 2 uses arrow keys to move. This was my first project written in java, the ball collision is still a little buggy but it works for the most part. The link will download the class files.");

			$('#mdlImg').attr("src", "img/airhockey.png");
			$('#mdlLink').attr("href", "https://idougherty.github.io/airhockey.zip");
			$('#mdlOverlay').show();
			break;
		
		case "traffic":
			$('#mdlTitle').text("Traffic Simulator");
			$('#mdlText').text("A simulation of a single 4 way intersection with traffic lights. This was used for my freshman year science fair project where I varied the timing of red lights to find a system with the greatest volume of traffic flow.");

			$('#mdlImg').attr("src", "img/traffic.png");
			$('#mdlLink').attr("href", "https://idougherty.github.io/traffic");
			$('#mdlOverlay').show();
			break;
		
		case "genetic":
			$('#mdlTitle').text("Genetic Learning Project");
			$('#mdlText').text("I wanted to create a system of nodes that over generations of fighting would gradually get more efficient. The nodes can adjust how fast they shoot and how often they change direction along with some other variables that impact their behavior. The experiment was pretty interesting and later generations showed some more promise, but the matches were not set up in a scaleable form so simulating took a long time. I might attempt an evolution algorithm again with more complicated behaviors or different game.");
			
			$('#mdlImg').attr("src", "img/genetic.png");
			$('#mdlLink').attr("href", "https://idougherty.github.io/geneticAI");
			$('#mdlOverlay').show();
			break;
		
		case "thesaurus":
			$('#mdlTitle').text("Equivalent Word Optical Device App");
			$('#mdlText').text("A web app I made for my final project in Programming 1. It loops through a string of words and fetches the longest synonym it can find in a thesaurus API. It doesn't have a lot of practical use but it can give some amusing translations.");

			$('#mdlImg').attr("src", "img/thesaurus.png");
			$('#mdlLink').attr("href", "https://idougherty.github.io/thesaurus");
			$('#mdlOverlay').show();
			break;
	
		case "simplegame":
			$('#mdlTitle').text("UFO Side Scroller");
			$('#mdlText').text("Use the up and down arrow keys to dodge the asteroids and pick up coins to boost your score. This is a small game I made for a web development project. The game is pretty simple itself, but I'm most happy with the damage animations for the character and scrolling background.");

			$('#mdlImg').attr("src", "img/simplegame.png");
			$('#mdlLink').attr("href", "https://idougherty.github.io/simplegame");
			$('#mdlOverlay').show();
			break;

		case "dog":
			$('#mdlTitle').text("Rainbow Dog Head");
			$('#mdlText').text("I found this plaster dog head on sale and painted it. It is usually dressed appropriate to the season and has a pair of glasses or shades on.");

			$('#mdlImg').attr("src", "img/dog.jpg");
			$('#mdlLink').attr("href", "javascript:void(0)");
			$('#mdlOverlay').hide();
			break;

		case "fireworks":
			$('#mdlTitle').text("Particle Fireworks");
			$('#mdlText').text("I saw the canvas globalCompositeOperation variable and thought that it might look cool in a fire simulation. I added a rising emitter that explodes at its peak and I got a little firework demo.")

			$('#mdlImg').attr("src", "img/fireworks.png");
			$('#mdlLink').attr("href", "https://idougherty.github.io/particles/fireworks.html");
			$('#mdlOverlay').show();
			break;
	
		case "library":
			$('#mdlTitle').text("Library App");
			$('#mdlText').text("A webapp I made for my web development class that uses the Chicago Library API to retrieve locations and info of libraries in Chicago. I also used the google maps API to add markers on a map with some information about each library.")

			$('#mdlImg').attr("src", "img/library.png");
			$('#mdlLink').attr("href", "https://idougherty.github.io/libapp");
			$('#mdlOverlay').show();
			break;

		case "dodge":
			$('#mdlTitle').text("Laser Dodging Game");
			$('#mdlText').text("Use the arrow keys to go move through gaps in the lasers as they get faster and faster. I drew every new frame with a slightly transparent alpha value which added the tracing effect that I used in many future games.")

			$('#mdlImg').attr("src", "img/dodge.png");
			$('#mdlLink').attr("href", "https://idougherty.github.io/dodge");
			$('#mdlOverlay').hide();
			break;

		case "school":
			$('#mdlTitle').text("Student Initiative Project");
			$('#mdlText').text("A website I made with bootstrap for an english project where we needed to design a school. This was my introduction to bootstrap and I used a lot of features from their tutorial pages and tweaked them to fit the design.")

			$('#mdlImg').attr("src", "img/school.jpg");
			$('#mdlLink').attr("href", "https://idougherty.github.io/studentinit");
			$('#mdlOverlay').show();
			break;
	
		case "tank":
			$('#mdlTitle').text("Tank Shooter");
			$('#mdlText').text("A demo I made using javascript and a canvas element for a turret that could shoot towards the mouse cursor. This was an introduction to mouse eventlisteners and drawing rotated shapes using canvas transformation functions.");

			$('#mdlImg').attr("src", "img/tank.png");
			$('#mdlLink').attr("href", "https://idougherty.github.io/tankthing.html");
			$('#mdlOverlay').show();
			break;

		case "spook":
			$('#mdlTitle').text("Spook.html");
			$('#mdlText').text("A website that screams after 20 minutes - I also added a button to change the time for varying use cases. In 7th grade I would open this up on a school computer in minimized window and the next period's computer would start screaming. It was very simple but very effective.")

			$('#mdlImg').attr("src", "img/spook.png");
			$('#mdlLink').attr("href", "https://idougherty.github.io/spook.html");
			$('#mdlOverlay').hide();
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
	this.offset = 0;
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
		this.offset = this.color/720 - .5;

		const p1 = this.rotatePoint(pitch, this.z, this.y + this.offset);
		const p2 = this.rotatePoint(yaw, this.x, p1[0]);
		const p3 = this.rotatePoint(roll, p2[0], p1[1]);

		const nx = p3[0];
		const ny = p3[1];
		const nz = p2[1];


		const size = 5 / (nz + distance);
		var alpha = (7 - nz)/5;

		imageX = nx * size * 200 + canvas.width*3/4;
		imageY = ny * size * 200 + canvas.height/2;

		this.color = this.color + 2 > 360 ? 0 : this.color + 2;
		
		c.fillStyle = "hsla("+this.color+", 75%, 20%, "+alpha+")";
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

canvas.width = 1600;
canvas.height = 640;


setInterval(function() {	
    c.globalCompositeOperation = "source-over";
    var grd = c.createRadialGradient(canvas.width * 3/4, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width*2);
    grd.addColorStop(0, "rgba(24, 16, 24, 0.2)");
	grd.addColorStop(1, "rgba(0, 0, 0, 1)");

    c.fillStyle = grd;
    c.fillRect(0, 0, canvas.width, canvas.height);
	
	c.globalCompositeOperation = "lighter";
	
    controller.update();
}, 20);