class Menu {
    static screen = "splash";
    static ctx = null;
    static backgroundImage = null;

    static drawBackground() {
        if(!this.backgroundImage) {
            this.backgroundImage = new Image();
            this.backgroundImage.src = "assets/background_image.png";
            this.backgroundImage.onload = () => {
                this.ctx.drawImage(this.backgroundImage, 0, 0);
            };
        }

        this.ctx.drawImage(this.backgroundImage, 0, 0);
    }

    static hide(id) {
        const elements = document.querySelectorAll(`[id=${id}]`);
        
        for(const element of elements)
            if(element)
                element.dataset.hidden = true;
    }

    static unhide(id) {
        const elements = document.querySelectorAll(`[id=${id}]`);
        
        for(const element of elements)
            if(element)
                element.dataset.hidden = false;
    }

    static async changeScreen(newScreen) {
        if(newScreen == this.screen)
            return;

        this.hide(this.screen);

        if(newScreen == "daily-putt" || newScreen == "daily-3-hole" || newScreen == "endless") {
            const score = await Game.getScore(newScreen);

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

    static async updateScores(screen, score) {
        const userScore = document.getElementById(screen+"-score");
        userScore.innerHTML = score;

        const scores = await fetchScoreboard(screen);
        this.updateScoreboard(screen, scores);
    }

    static updateScoreboard(screen, scores) {
        const scoreboard = document.getElementById(screen+"-scoreboard");
        
        while(scoreboard.firstChild)
            scoreboard.removeChild(scoreboard.firstChild);

        if(!scores) {
            const header = scoreboard.insertRow();
            header.insertCell().appendChild(document.createTextNode("Couldn't find the scores. :("));
            return;
        }

        if(scores.length == 0) {
            const header = scoreboard.insertRow();
            header.insertCell().appendChild(document.createTextNode("No scores yet today!"));
            return;
        }

        const header = scoreboard.insertRow();
        header.insertCell().appendChild(document.createTextNode("Rank"));
        header.insertCell().appendChild(document.createTextNode("Name"));
        header.insertCell().appendChild(document.createTextNode("Score"));

        let lastScore = -1;
        let rank = 0;
        for(const row of scores) {
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