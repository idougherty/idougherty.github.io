class Menu {
    static screen = "splash";
    static ctx = null;
    static backgroundImage = null;

    static drawBackground() {
        if(!this.backgroundImage) {
            const seed = Date.now();
            const [hole, tee, backgroundImage] = generateTerrain(seed);
            this.backgroundImage = backgroundImage;
        }

        this.ctx.putImageData(this.backgroundImage, 0, 0);
    }

    static hide(screen) {
        const menu = document.getElementById(screen);
    
        if(menu)
            menu.dataset.hidden = true;
    }

    static unhide(screen) {
        const menu = document.getElementById(screen);
    
        if(menu)
            menu.dataset.hidden = false;
    }

    static changeScreen(newScreen) {
        if(newScreen == this.screen)
            return;

        this.hide(this.screen);

        if(newScreen == "daily-putt" || newScreen == "daily-3-hole" || newScreen == "endless") {
            const score = Game.getScore(newScreen);

            if(score != null) {
                this.updateScores(newScreen, score);
            } else {
                Game.startMode(newScreen);
                newScreen = null;
            }
        }

        this.unhide(newScreen);

        this.screen = newScreen;
    }

    static updateScores(screen, score) {
        const userScore = document.getElementById(screen+"-score");
        userScore.innerHTML = score;

        const scoreboard = document.getElementById(screen+"-scoreboard");
        
        while(scoreboard.firstChild)
            scoreboard.removeChild(scoreboard.firstChild);

        this.scoreboardData = Game.getScoreboard(screen);

        if(!this.scoreboardData)
            return;

        const header = scoreboard.insertRow();
        header.insertCell().appendChild(document.createTextNode("Rank"));
        header.insertCell().appendChild(document.createTextNode("Name"));
        header.insertCell().appendChild(document.createTextNode("Score"));

        let lastScore = -1;
        let rank = 0;
        for(const row of this.scoreboardData) {
            if(lastScore != row["score"]) {
                rank++;
                lastScore = row["score"];
            }

            const header = scoreboard.insertRow();
            header.insertCell().appendChild(document.createTextNode(rank));
            header.insertCell().appendChild(document.createTextNode(row["name"]));
            header.insertCell().appendChild(document.createTextNode(row["score"]));
        }
    }
}