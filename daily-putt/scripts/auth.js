let user = null;

function handleCredentialResponse(res) {

    t = res.credential;
    let token = {};
    token.raw = t;
    token.header = JSON.parse(window.atob(t.split('.')[0]));
    token.payload = JSON.parse(window.atob(t.split('.')[1]));

    user = token;
    console.log(token);
}