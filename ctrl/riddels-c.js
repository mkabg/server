import { connect, toObjectId } from "../db/riddlesDB.js";


// GET /riddles/:id
async function getRiddle(req, res) {
  try {
    const { id } = req.params;
    const filter = { _id: toObjectId(id) };
    const db = await connect();
    const riddle = await db.collection("riddles").findOne(filter);
    if (!riddle) {
      return res.status(404).json({ message: "Riddle not found" });
    }
    res.json(riddle);
  } catch (err) {
    return res.status(400).json({message: "Error retrieving riddle: ", err})
  }
}

// GET /riddles
async function getAllRiddles(req, res) {
  try {
    const db = await connect();
    const riddles = await db.collection("riddles").find({}).toArray();
    res.json(riddles);
  } catch (err) {
    return res.status(400).json({message: "Error retrieving riddles: ", err})
  } 
}

// POST /riddles
async function addRiddle(req, res) {
  try {
    const newRiddle = req.body;
    const db = await connect();
    const result = await db.collection("riddles").insertOne(newRiddle);
    
    res.status(201).json({ message: 'Riddle added', riddle: result.insertedId });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid data or failed to write.' });
  }
}

// POST /riddles/load-initial-riddles
async function addRiddles(req, res) {
  try {
    const newRiddles = req.body;
    const db = await connect();
    const result = await db.collection("riddles").insertMany(newRiddles);

    res.status(201).json({ message: 'Riddles added', riddles: result.insertedCount });
  } catch (err) {
    return res.status(400).json({error: "invalid data or failed to write."})
  }
}

// PUT /riddles/:id
async function updateRiddle(req, res) {
  try {
    const { id } = req.params;
    const filter = { _id: toObjectId(id) };
    const updated = req.body;
    const db = await connect();
    const result = await db.collection("riddles").updateOne(filter, { $set: updated });
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Riddle not found" });
    }
    res.json({ message: "Riddle updated" });
    
  } catch (err) {
    return res.status(400).json({ error: "Invalid update format or failed to write." });
  }
}

// DELETE /riddles/:id
async function delRiddle(req, res) {
  try {
    const { id } = req.params;
    const filter = { _id: toObjectId(id) };
    const db = await connect();
    const result = await db.collection("riddles").deleteOne(filter);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Riddle not found" });
    } 
    res.json({ message: "Riddle deleted" })
  } catch (err) {
    return res.status(400).json({ error: "Invalid request or failed to write." });
  }
}

export {
  getRiddle,
  getAllRiddles,
  addRiddle,
  addRiddles,
  updateRiddle,
  delRiddle
};
