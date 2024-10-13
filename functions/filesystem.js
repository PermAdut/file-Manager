import path from "node:path";
import fsPromises from "node:fs/promises";
import { operatingSystem, parseArgs } from "./constants.js";
import { constants, createReadStream, createWriteStream, read } from "node:fs";

async function handleADDCommand(relPath, ...params) {
  let dir;
  try {
    const param = params[0][0];
    const newPath = path.resolve(relPath, param);
    dir = await fsPromises.opendir(relPath);
    await fsPromises.writeFile(newPath, "");
  } catch (err) {
    process.stdout.write("This operation can't be done!\n");
  } finally {
    if (dir) await dir.close();
  }
}

async function handleRMCommad(...params) {
  try {
    const param = params[0].join(" ");
    await fsPromises.unlink(param);
  } catch (err) {
    process.stdout.write("This operation can't be done!\n");
  }
}

async function handleCATCommand(...params) {
  return new Promise((res) => {
    const param = params[0].join(" ");
    try {
      const readStream = createReadStream(param);
      readStream.on("data", (data) => {
        process.stdout.write(data.toString());
        if (data == null) {
          readStream.emit("end");
        }
      });
      readStream.on("end", () => {
        process.stdout.write("\n");
        readStream.close();
        res();
      });
    } catch (err) {
      process.stdout.write("This operation can't be done!\n");
      res();
    }
  });
}

async function handleRNCommand(...params){

}



export {
  handleADDCommand,
  handleRMCommad,
  handleCATCommand,
  handleRNCommand
};
