import path from "node:path";
import fsPromises from "node:fs/promises";
import { exactTwoParams } from "./constants.js";
import { constants, createReadStream, createWriteStream } from "node:fs";

async function hadnleCPCommand(relPath, ...params) {
  return new Promise(async (res) => {
    let dir;
    try {
      const [filePath, direntPath] = exactTwoParams(params, relPath);
      if (filePath == -1) {
        process.stdout.write("Invalid input\n");
        res();
      }
      const dirPath = path.resolve(relPath, direntPath);

      await fsPromises.access(filePath, constants.F_OK);
      dir = await fsPromises.opendir(dirPath);

      const writeStream = createWriteStream(
        path.resolve(dirPath, path.basename(filePath))
      );
      const readStream = createReadStream(filePath);
      readStream.on("data", (data) => {
        writeStream.write(data);
      });
      readStream.on("end", () => {
        readStream.close();
        writeStream.close();
        res();
      });
      readStream.on("error", () => {
        process.stdout.write("Operation failed\n");
        res();
      });
      writeStream.on("error", () => {
        process.stdout.write("Operation failed\n");
        res();
      });
    } catch (err) {
      if (err.code == "ENOENT") {
        process.stdout.write("Invalid input\n");
      } else {
        process.stdout.write("Operation failed\n");
      }
      res();
    } finally {
      if (dir) dir.close();
    }
  });
}

async function handleMVCommand(relPath, ...params) {
  let dir;
  return new Promise(async (res) => {
    try {
      const [filePath, direntPath] = exactTwoParams(params, relPath);
      if (filePath == -1) {
        process.stdout.write("Invalid input\n");
        res();
      }
      const dirPath = path.resolve(relPath, direntPath);
      await fsPromises.access(filePath, constants.F_OK);
      dir = await fsPromises.opendir(dirPath);
      const writeStream = createWriteStream(
        path.resolve(dirPath, path.basename(filePath))
      );
      const readStream = createReadStream(filePath);
      readStream.on("data", (data) => {
        writeStream.write(data);
      });
      readStream.on("end", async () => {
        readStream.close();
        writeStream.close();
        await fsPromises.unlink(filePath);
        res();
      });
      readStream.on("error", () => {
        process.stdout.write("Operation failed\n");
        res();
      });
      writeStream.on("error", () => {
        process.stdout.write("Operation failed\n");
        res();
      });
    } catch (err) {
      if (err.code == "ENOENT") {
        process.stdout.write("Invalid input\n");
      } else {
        process.stdout.write("Operation failed\n");
      }
      res();
    } finally {
      if (dir) dir.close();
    }
  });
}

export { hadnleCPCommand, handleMVCommand };
