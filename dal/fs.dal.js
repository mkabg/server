import fs from "fs/promises";


async function read(path){
    return JSON.parse(await fs.readFile(path, { encoding: "utf-8" }));
}


async function write(path, data) {
    if (typeof data !== "string") {
        data = JSON.stringify(data, null, 2);
    }
    await fs.writeFile(path, data);
    return "Successfully wrote to file";
}

export {
    read,
    write
}