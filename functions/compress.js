import { dirname, resolve } from "node:path";
import fsPromises from "node:fs/promises";
import zlib from "node:zlib";
import { createReadStream, createWriteStream } from "node:fs";
import { exactTwoParams } from "./constants.js";

async function handleCompressCommand(relPath, ...params) {
  return new Promise(async (res) => {
    let dir;
    try {
      const [filePath, zipName] = exactTwoParams(params, relPath);
      if (filePath == -1) {
        process.stdout.write("Invalid input\n");
        res();
      } else {
        const zipPath = resolve(relPath, zipName);
        await fsPromises.access(filePath);
        dir = await fsPromises.opendir(dirname(zipPath));
        const compress = zlib.createBrotliCompress();
        const readStream = createReadStream(filePath);
        const writeStream = createWriteStream(zipPath);
        const stream = readStream.pipe(compress).pipe(writeStream);
        stream.on("finish", () => {
          res();
        });
        stream.on("error", () => {
          process.stdout.write("Operation failed\n");
        });
        readStream.on("error", () => {
          process.stdout.write("Operation failed\n");
        });
        writeStream.on("error", () => {
          process.stdout.write("Operation failed\n");
        });
      }
    } catch (err) {
      if (err.code == "ENOENT") {
        process.stdout.write("Invalid input\n");
      } else {
        process.stdout.write("Operation failed\n");
      }
    } finally {
      if (dir) await dir.close();
      res();
    }
  });
}

async function handleDeCompressCommand(relPath, ...params) {
  let dir;
  return new Promise(async (res) => {
    try {
      const [filePath, unzipName] = exactTwoParams(params, relPath);
      if (filePath == -1) {
        process.stdout.write("Invalid input\n");
        res();
      } else {
        const unzipPath = resolve(relPath, unzipName);
        await fsPromises.access(filePath);
        dir = await fsPromises.opendir(dirname(unzipName));
        const compress = zlib.createBrotliDecompress();
        const readStream = createReadStream(filePath);
        const writeStream = createWriteStream(unzipName);
        const stream = readStream.pipe(compress).pipe(writeStream);
        stream.on("finish", () => {
          res();
        });
        stream.on("error", () => {
          process.stdout.write("Operation failed\n");
        });
        readStream.on("error", () => {
          process.stdout.write("Operation failed\n");
        });
        writeStream.on("error", () => {
          process.stdout.write("Operation failed\n");
        });
      }
    } catch (err) {
      if (err.code == "ENOENT") {
        process.stdout.write("Invalid input\n");
      } else {
        process.stdout.write("Operation failed\n");
      }
    } finally {
      if (dir) await dir.close();
      res();
    }
  });
}

export { handleCompressCommand, handleDeCompressCommand };
