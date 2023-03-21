import express from 'express';
import bodyParser from 'body-parser';

import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const app = express();
const port = 3000;

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

// ensure db exists
await db.read();
db.data ||= { scores: {} }
await db.write();

app.get("/:day/:mode", async (req, res) => {
    await db.read();

    const {day, mode} = req.params;

    const scores = db.data.scores[`${day}-${mode}`];

    if(!scores)
        res.status(400).json({ ok: false });

    res.json(scores);
});

// parse application/json
app.use(bodyParser.json());

app.post("/", async (req, res) => {
    await db.read();

    const {day, mode, name, score} = req.body;

    if(!day || !mode || !name || !score)
        res.status(400).json({ ok: false });

    let scores = db.data.scores;

    if(!scores[`${day}-${mode}`])
        scores[`${day}-${mode}`] = [];

    scores[`${day}-${mode}`].push({
        "name": name,
        "score": score,
    });

    await db.write();

    res.json(scores);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});