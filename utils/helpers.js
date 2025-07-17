import path from "path";
import {read} from "../dal/fs.dal.js";

const filePath = path.join(".", "./db/riddles.txt");

// Helper to get JSON array
async function getRiddles() {
    const data = await read(filePath);
    return data;
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
    getRiddles,
    sortRiddles    
};