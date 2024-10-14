import path from "node:path";
import fsPromises from "node:fs/promises";
import { exactTwoParams, extractParam } from "./constants.js";
import { createReadStream } from "node:fs";

async function handleADDCommand(relPath, ...params) {
  return new Promise(async (res) => {
    try {
      const param = extractParam(params[0]);
      const newPath = path.resolve(relPath, param);
      await fsPromises.writeFile(newPath, "");
    } catch (err) {
      process.stdout.write("Operation failed\n");
    } finally {
      res();
    }
  });
}

async function handleRMCommad(relPath, ...params) {
  return new Promise(async (res) => {
    try {
      const param = extractParam(params[0]);
      const newPath = path.resolve(relPath, param);
      await fsPromises.unlink(newPath);
    } catch (err) {
      if (err.code == "ENOENT") {
        process.stdout.write("Invalid input\n");
      } else {
        process.stdout.write("Operation failed\n");
      }
    } finally {
      res();
    }
  });
}

async function handleCATCommand(relPath, ...params) {
  return new Promise((res) => {
    const param = extractParam(params[0]);
    const newPath = path.resolve(relPath, param);
    const readStream = createReadStream(newPath);
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
    readStream.on("error", (err) => {
      if (err.code == "ENOENT") {
        process.stdout.write("Invalid input\n");
      } else {
        process.stdout.write("Operation failed\n");
      }
      readStream.close();
      res();
    });
  });
}

async function handleRNCommand(relPath, ...params) {
  return new Promise(async (res) => {
    try {
      const [fullPathToFile, fullDestPath] = exactTwoParams(params, relPath);
      if (fullDestPath == -1) {
        process.stdout.write("Invalid input\n");
        res();
      } else {
        await fsPromises.stat(fullPathToFile);
        await fsPromises.rename(fullPathToFile, fullDestPath);
        res();
      }
    } catch (err) {
      if (err.code == "ENOENT") {
        process.stdout.write("Invalid input\n");
      } else {
        process.stdout.write("Operation failed\n");
      }
    } finally {
      res();
    }
  });
}

export { handleADDCommand, handleRMCommad, handleCATCommand, handleRNCommand };
