import path from "path";
import {read} from "../dal/fs.dal.js";

const filePath = path.join(".", "./db/riddles.txt");

// Helper to get JSON array
async function getRiddles() {
    const data = await read(filePath);
    return data;
}

export {getRiddles};