import path from 'path';
import { write } from '../dal/fs.dal.js';
import { getRiddles,
    sortRiddles
 } from '../utils/helpers.js';


const filePath = path.join(".", "./db/riddles.txt");


// GET /riddles
async function handleGet(req, res) {
  try {
    const riddles = await getRiddles();
    res.status(200).json(riddles);
  } catch (err) {
    res.status(500).json({ error: "Failed to read riddles." });
  }
}

// POST /create/riddles
async function handlePost(req, res) {
  try {
    const newRiddle = req.body;
    const riddles = await getRiddles();
    const newId = riddles.length > 0 ? Math.max(...riddles.map(r => r.id)) + 1 : 1;
    newRiddle.id = newId;
    riddles.push(newRiddle);
    const sortedRiddles = sortRiddles(riddles);
    await write(filePath, JSON.stringify(sortedRiddles, null, 2));
    res.status(201).json({ message: 'Riddle added', riddle: newRiddle });
  } catch (err) {
    res.status(400).json({ error: 'Invalid data or failed to write.' });
  }
}

// PUT /update/riddles
async function handlePut(req, res) {
  try {
    const updated = req.body;
    const riddles = await getRiddles();
    const index = riddles.findIndex(r => r.id === updated.id);

    if (index === -1) {
      return res.status(404).json({ error: "Riddle not found" });
    }

    riddles[index] = { ...riddles[index], ...updated };

    await write(filePath, JSON.stringify(riddles, null, 2));
    res.status(200).json({ message: "Riddle updated", riddle: riddles[index] });
  } catch (err) {
    res.status(400).json({ error: "Invalid update format or failed to write." });
  }
}

// DELETE /delete/riddles
async function handleDelete(req, res) {
  try {
    const { id } = req.body;
    const riddles = await getRiddles();
    const newRiddles = riddles.filter(r => r.id !== id);

    if (newRiddles.length === riddles.length) {
      return res.status(404).json({ error: "Riddle not found" });
    }

    await write(filePath, JSON.stringify(newRiddles, null, 2));
    res.status(200).json({ message: "Riddle deleted" });
  } catch (err) {
    res.status(400).json({ error: "Invalid request or failed to write." });
  }
}

export {
    handleGet,
    handlePost,
    handlePut,
    handleDelete
};
