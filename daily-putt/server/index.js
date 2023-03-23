import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

import { OAuth2Client } from 'google-auth-library';

const app = express();
const port = 3000;

const corsOptions ={
   origin:['http://localhost:8080','https://www.idougherty.net'], 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

// ensure db exists
await db.read();
db.data ||= { scores: {} }
await db.write();

// create jwt verifier
const CLIENT_ID = "115725711625-i6hkglkt9o4aa34lpbc1p4rc0ctkrcjp.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

app.get("/:day/:mode", async (req, res) => {

    await db.read();

    const {day, mode} = req.params;

    const scores = db.data.scores[`${day}-${mode}`];

    if(!scores)
        return res.json([]);

    res.json(scores);
});

app.get("/:day/:mode/:id", async (req, res) => {

    await db.read();

    const {day, mode, id} = req.params;

    const scores = db.data.scores[`${day}-${mode}`];

    if(!scores)
        return res.json(null);

    const score = scores.find(e => e["id"] == id);

    res.json(score ? score : null);
});

// parse application/json
app.use(bodyParser.json());

app.post("/:day/:mode", async (req, res) => {
    
    await db.read();
    
    const {day, mode} = req.params;
    const {jwt, score} = req.body;
    
    // TODO: verify jwt
    if(!jwt)
        return res.status(400).json({ ok: false, message: "Bad request" });

    let ticket;
    try {
        ticket = await client.verifyIdToken({
            idToken: jwt,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
    } catch (error) {
        return res.status(400).json({ ok: false, message: "Bad request" });
    }

    const payload = ticket.getPayload();
    const id = payload['sub'];
    const name = payload['given_name'];

    if(!day || !mode || !name || !score)
        return res.status(400).json({ ok: false, message: "Bad request" });

    let scores = db.data.scores;

    if(!scores[`${day}-${mode}`])
        scores[`${day}-${mode}`] = [];

    let dailyScores = scores[`${day}-${mode}`];

    if(dailyScores.find(e => e["id"] == id))
        return res.status(400).json({ ok: false, message: "Score exists already" });

    dailyScores.push({
        "id": id,
        "name": name,
        "score": score,
    });

    await db.write();

    return res.json(dailyScores);
});

app.listen(port, () => {
    console.log(`Daily Putt listening on port ${port}!`);
});