import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';

import { OAuth2Client } from 'google-auth-library';

import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config();

function getMongoClient() {
    const uri = process.env.MONGO_URL;
    return new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
}

const app = express();
const port = 5000;

const corsOptions ={
   origin:['http://localhost:8080','https://www.idougherty.net'], 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

// create jwt verifier
const CLIENT_ID = "115725711625-i6hkglkt9o4aa34lpbc1p4rc0ctkrcjp.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

app.get("/:day/:mode", async (req, res) => {

    const {day, mode} = req.params;
    const mongo = getMongoClient();

    try {
        await mongo.connect();

        const db = mongo.db("daily-putt");
        const scores = await db.collection("scores")
            .findOne({ "day": day, "mode": mode });

        if(!scores)
            return res.json([])
        
        return res.json(scores.scoreboard)
    } catch(error) {
        console.log(error);
        return res.status(500).json({ ok: false, message: "Bad request" });
    } finally {
        await mongo.close();
    }
});

app.get("/:day/:mode/:id", async (req, res) => {

    const {day, mode, id} = req.params;
    const mongo = getMongoClient();

    try {
        await mongo.connect();

        const db = mongo.db("daily-putt");
        const scores = await db.collection("scores")
            .findOne({ "day": day, "mode": mode });

        if(!scores)
            return res.json(null);
    
        const score = scores.scoreboard.find(e => e["id"] == id);
    
        return res.json(score ? score : null);
    } catch(error) {
        console.log(error);
        return res.status(500).json({ ok: false, message: "Bad request" });
    } finally {
        await mongo.close();
    }
});

// parse application/json
app.use(bodyParser.json());

app.post("/:day/:mode", async (req, res) => {
    
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

    const entry = { id, name, score };
    const mongo = getMongoClient();

    try {
        await mongo.connect();

        const db = mongo.db("daily-putt");
        const scores = await db.collection("scores")
            .findOne({ "day": day, "mode": mode });

        if(!scores) {
            await db.collection("scores").insertOne(
                { "day": day, "mode": mode, "scoreboard": [ entry ]});

            return [ entry ];
        }

        if(scores.scoreboard.find(e => e["id"] == id))
            return res.status(400).json({ ok: false, message: "Score exists already" });
    
        await db.collection("scores").updateOne(
            { "day": day, "mode": mode },
            { "$push": { scoreboard: entry } }
        );

        return res.json([...scores, entry]);
    } catch(error) {
        console.log(error);
        return res.status(500).json({ ok: false, message: "Bad request" });
    } finally {
        await mongo.close();
    }
    // let scores = db.data.scores;

    // if(!scores[`${day}-${mode}`])
    //     scores[`${day}-${mode}`] = [];

    // let dailyScores = scores[`${day}-${mode}`];

    // if(dailyScores.find(e => e["id"] == id))
    //     return res.status(400).json({ ok: false, message: "Score exists already" });

    // dailyScores.push({
    //     "id": id,
    //     "name": name,
    //     "score": score,
    // });

    // await db.write();

    // return res.json(dailyScores);
});

app.listen(port, () => {
    console.log(`Daily Putt listening on port ${port}!`);
});