import path from 'path';
import { read, write } from '../dal/fs.dal.js';
import { getRiddles } from '../utils/helpers.js';


const filePath = path.join(".", "./db/riddles.txt");


// GET /riddles
async function handleGet(req, res) {
    try {
        const riddles = await getRiddles();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(riddles));
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to read riddles.' }));
    }
}

// POST /create/riddles
async function handlePost(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
        try {
            const newRiddle = JSON.parse(body);
            const riddles = await getRiddles();
            const newId = riddles.length > 0 ? Math.max(...riddles.map(r => r.id)) + 1 : 1;
            newRiddle.id = newId;
            riddles.push(newRiddle);
            const sortedRiddles = sortRiddles(riddles);
            await write(filePath, JSON.stringify(sortedRiddles, null, 2));
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Riddle added', riddle: newRiddle }));
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid data or failed to write.' }));
        }
    });
}

// PUT /update/riddles
async function handlePut(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
        try {
            const updated = JSON.parse(body);
            const riddles = await getRiddles();
            const index = riddles.findIndex(r => r.id === updated.id);
            if (index === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Riddle not found' }));
                return;
            }
            riddles[index] = { ...riddles[index], ...updated };
            await write(filePath, JSON.stringify(riddles, null, 2));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Riddle updated', riddle: riddles[index] }));
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid update format or failed to write.' }));
        }
    });
}

// DELETE /delete/riddles
async function handleDelete(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
        try {
            const { id } = JSON.parse(body);
            let riddles = await getRiddles();
            const newRiddles = riddles.filter(r => r.id !== id);
            if (newRiddles.length === riddles.length) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Riddle not found' }));
                return;
            }
            await write(filePath, JSON.stringify(newRiddles, null, 2));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Riddle deleted' }));
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid request or failed to write.' }));
        }
    });
}

function sortRiddles(riddles) {
      const sorted = riddles.map((r, i) => ({
        id: i + 1,
        name: r.name,
        taskDescription: r.taskDescription,
        correctAnswer: r.correctAnswer
      }));
      return sorted;
}

export {
    handleGet,
    handlePost,
    handlePut,
    handleDelete
};
