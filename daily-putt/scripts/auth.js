async function handleCredentialResponse(res) {
    t = res.credential;
    let token = decodeJWT(res.credential);

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if(savedUser?.payload && savedUser.payload.email != token.payload.email)
        google.accounts.id.revoke(savedUser.payload.email, () => console.log(`email ${savedUser.payload.email} revoked`))

    localStorage.setItem("user", JSON.stringify(token));

    Menu.hide("sign-in-menu");
    
    const day = Game.getDay();
    const score = localStorage.getItem(`${day}-${Menu.screen}`);
    submitScore(token, Menu.screen, score);
}

function decodeJWT(jwt) {
    let token = {};
    token.raw = jwt;
    token.header = JSON.parse(window.atob(t.split('.')[0]));
    token.payload = JSON.parse(window.atob(t.split('.')[1]));

    return token;
}

const DB_URL = "http://localhost:3000";

async function submitScore(token, mode, score) {

    const res = await fetch(`${DB_URL}/${Game.getDay()}/${mode}`, {
        method: 'POST',
        headers: {
            Accept: 'application.json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "jwt": token.raw,
            "score": score
        }),
    });

    const scores = await res.json();

    if(res.ok)
        Menu.updateScoreboard(mode, scores);
}

async function fetchScore(mode) {
    const user = getUser();
    if(!user)
        return null;

    try {
        const res = await fetch(`${DB_URL}/${Game.getDay()}/${mode}/${user.payload.sub}`, {
            method: 'GET',
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json',
            },
        });
        
        const entry = await res.json();

        return entry ? entry.score : null;
    } catch {
        return null;
    }
}

async function fetchScoreboard(mode) {
    try {
        const res = await fetch(`${DB_URL}/${Game.getDay()}/${mode}`, {
            method: 'GET',
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json',
            },
        });

        if(!res.ok)
            return null;
    
        const scores = await res.json();

        scores.sort((a, b) => a.score - b.score);
    
        return scores;
    } catch {
        return null;
    }
}

function getUser() {
    const user = JSON.parse(localStorage.getItem("user"));

    if(!user)
        return null;

    if(user.payload.exp < Date.now() / 1000)
        return null;

    return user;
}

if(getUser()) {
    Menu.hide("sign-in-menu");
}