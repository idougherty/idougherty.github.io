async function handleCredentialResponse(res) {
    t = res.credential;
    let token = decodeJWT(res.credential);

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if(savedUser?.payload && savedUser.payload.email != token.payload.email)
        google.accounts.id.revoke(savedUser.payload.email, () => console.log(`email ${savedUser.payload.email} revoked`))

    localStorage.setItem("user", JSON.stringify(token));

    Menu.hide("sign-in-menu");

    // User has a score but was not signed in on hole end
    if(Menu.screen == "daily-putt" || Menu.screen == "daily-3-hole" || Menu.screen == "weekly-9-hole") {
        const storageString = Game.getModeString(Menu.screen);
        const score = localStorage.getItem(storageString);

        if(score)
            submitScore(token, Menu.screen, score);
    }
}

function decodeJWT(jwt) {
    let token = {};
    token.raw = jwt;
    token.header = JSON.parse(window.atob(t.split('.')[0]));
    token.payload = JSON.parse(window.atob(t.split('.')[1]));

    return token;
}

// const DB_URL = "http://localhost:5000";
const DB_URL = "https://idougherty-github-io.vercel.app";

async function submitScore(token, mode, score) {
    console.log(mode, score);
    const date = mode == "weekly-9-hole" ? Game.getWeek() : Game.getDay();

    const res = await fetch(`${DB_URL}/${date}/${mode}`, {
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
        const date = mode == "weekly-9-hole" ? Game.getWeek() : Game.getDay();
        const res = await fetch(`${DB_URL}/${date}/${mode}/${user.payload.sub}`, {
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
        const date = mode == "weekly-9-hole" ? Game.getWeek() : Game.getDay();
        const res = await fetch(`${DB_URL}/${date}/${mode}`, {
            method: 'GET',
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json',
            },
        });

        if(!res.ok) {
            console.log(res.json());
            return null;
        }
    
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

google.accounts.id.initialize({
    client_id: '115725711625-i6hkglkt9o4aa34lpbc1p4rc0ctkrcjp.apps.googleusercontent.com',
    callback: handleCredentialResponse,
    context: "signin",
    ux_mode: "popup",
    auto_select: "true",
    cancel_on_tap_outside: "false",
    itp_support: "true"
});

if(getUser())
    Menu.hide("sign-in-menu");
else if(localStorage.getItem("user"))
    google.accounts.id.prompt();