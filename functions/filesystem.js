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

async function handleRNCommand(...params) {
  return new Promise(async (res) => {
    try {
      const fullParams = params[0].join(" ");
      const firstIndex = fullParams.indexOf('"');
      const lastIndex = fullParams.lastIndexOf('"');
      if (firstIndex === -1 || lastIndex === -1 || lastIndex <= firstIndex) {
        process.stdout.write(
          "Ошибка: Имя файла должно быть заключено в кавычки.\n"
        );
        res();
        return;
      }
      const fileName = fullParams.slice(firstIndex + 1, lastIndex).trim();
      const pathToFile = fullParams.slice(0, firstIndex).trim();
      await fsPromises.stat(pathToFile);
      await fsPromises.rename(pathToFile, path.resolve(path.dirname(pathToFile), fileName));
    } catch (err) {
      process.stdout.write("This operation can't be done!\n");
      res();
    } finally {
      res();
    }
  });
}

export { handleADDCommand, handleRMCommad, handleCATCommand, handleRNCommand };
