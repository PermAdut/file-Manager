import path from "node:path";
import fsPromises from "node:fs/promises";
import { parseArgs } from "./constants.js";
import { constants, createReadStream, createWriteStream } from "node:fs";

async function hadnleCPCommand(...params) {
  return new Promise(async (res) => {
    const [relPath, copyPath, fileName] = parseArgs(params[0]);
    if (relPath == -1) {
      process.stdout.write("Error inputing\n");
      res();
    }
    let dir;
    try {
      console.log(relPath);
      await fsPromises.access(relPath, constants.F_OK);
      dir = await fsPromises.opendir(copyPath);

      const writeStream = createWriteStream(path.resolve(copyPath, fileName));
      const readStream = createReadStream(relPath);
      readStream.on("data", (data) => {
        writeStream.write(data);
      });
      readStream.on("end", () => {
        readStream.close();
        writeStream.close();
        res();
      });
    } catch (err) {
      process.stdout.write("This operation can't be done!\n");
      res();
    } finally {
      if (dir) dir.close();
    }
  });
}

async function handleMVCommand(...params) {
  return new Promise(async (res) => {
    const [relPath, copyPath, fileName] = parseArgs(params[0]);
    if (relPath == -1) {
      process.stdout.write("Error inputing\n");
      res();
    }
    let dir;
    try {
      console.log(relPath);
      await fsPromises.access(relPath, constants.F_OK);
      dir = await fsPromises.opendir(copyPath);

      const writeStream = createWriteStream(path.resolve(copyPath, fileName));
      const readStream = createReadStream(relPath);
      readStream.on("data", (data) => {
        writeStream.write(data);
      });
      readStream.on("end", async () => {
        readStream.close();
        writeStream.close();
        await fsPromises.unlink(relPath);
        res();
      });
    } catch (err) {
      process.stdout.write("This operation can't be done!\n");
      res();
    } finally {
      if (dir) dir.close();
    }
  });
}

export { hadnleCPCommand, handleMVCommand };
