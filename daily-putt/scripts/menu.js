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

        if(newScreen == "daily-putt" || newScreen == "daily-3-hole" || newScreen == "weekly-9-hole" || newScreen == "endless") {
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

    static updateScores(screen, score) {
        const userScore = document.getElementById(screen+"-score");
        userScore.innerHTML = score;

        this.updateScoreboard(screen);
    }

    static async updateScoreboard(screen) {
        const scoreboard = document.getElementById(screen+"-scoreboard");
        
        while(scoreboard.firstChild)
            scoreboard.removeChild(scoreboard.firstChild);

        const loading = scoreboard.insertRow();
        loading.insertCell().innerHTML = "Loading...";

        const scores = await fetchScoreboard(screen);

        while(scoreboard.firstChild)
            scoreboard.removeChild(scoreboard.firstChild);

        if(!scores) {
            const header = scoreboard.insertRow();
            header.insertCell().innerHTML = "Couldn't find the scores. :(";
            return;
        }

        if(scores.length == 0) {
            const header = scoreboard.insertRow();
            header.insertCell().innerHTML = "No scores yet today!";
            return;
        }

        const header = scoreboard.insertRow();
        header.insertCell().innerHTML = "Rank";
        header.insertCell().innerHTML = "Name";
        header.insertCell().innerHTML = "Score";

        let lastScore = -1;
        let rank = 0;
        for(const row of scores) {
            if(lastScore != row["score"]) {
                rank++;
                lastScore = row["score"];
            }

            const header = scoreboard.insertRow();
            header.insertCell().innerHTML = rank;
            header.insertCell().innerHTML = row["name"];
            header.insertCell().innerHTML = row["score"];
            
            if(rank <= 3) {
                const trophy = document.createElement("span");
                trophy.classList.add("scoreboard-rank-"+rank,"fa", "fa-solid", "fa-trophy");
                header.lastChild.appendChild(trophy);
            }
        }

    }
}