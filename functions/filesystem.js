import path from "node:path";
import fsPromises from "node:fs/promises";
import { operatingSystem } from "./constants.js";
import { constants, createReadStream, createWriteStream, read } from "node:fs";

async function handleLSCommand(dirPath) {
  const dir = await fsPromises.opendir(dirPath);
  const res = [];
  for await (const dirent of dir) {
    const obj = { name: dirent.name, type: "" };
    try {
      const fileStat = await fsPromises.stat(
        path.resolve(dirent.parentPath, dirent.name)
      );
      if (fileStat.isFile()) {
        obj.type = "file";
      } else {
        obj.type = "directory";
      }
      res.push(obj);
    } catch (err) {
      process.stdout.write("Can't access this folder\n");
      return;
    }
  }
  console.table(res);
}

async function handleUPCommand(relPath) {
  return new Promise((res) => {
    const dirs = relPath.split(path.sep);
    if (operatingSystem == "Windows_NT") {
      if (dirs.length == 1) {
        res(relPath);
      } else {
        relPath = dirs.slice(0, -1).join(path.sep);
      }
    } else if (operatingSystem == "Linux" || operatingSystem == "Darwin") {
      if (dirs.length == 0) {
        res(path.sep);
      } else {
        relPath = dirs.slice(0, -1).join(path.sep);
      }
    }
    res(relPath);
  });
}

async function handleCDCommand(relPath, chosedDir) {
  return new Promise(async (res) => {
    let initDir, dir;
    try {
      initDir = await fsPromises.opendir(relPath);
      const initPath = relPath;
      chosedDir = chosedDir.join(" ");

      if (chosedDir === ".") {
        res(initPath);
      } else if (chosedDir === "..") {
        const newPath = relPath.split(path.sep).slice(0, -1).join(path.sep);
        dir = await fsPromises.opendir(newPath);
        newPath.length === 0 ? res(initPath) : res(newPath);
      } else if (path.isAbsolute(chosedDir)) {
        dir = await fsPromises.opendir(chosedDir);
        res(chosedDir);
      } else {
        const dirs = chosedDir.split(path.sep).join(path.sep);
        if (relPath[relPath.length - 1] === path.sep) {
          relPath = relPath.slice(0, -1);
        }
        const exactPath = path.join(relPath, dirs);
        dir = await fsPromises.opendir(exactPath);
        res(exactPath);
      }
    } catch (err) {
      process.stdout.write("Can't access this folder\n");
      res(relPath);
    } finally {
      if (dir) await dir.close();
      if (initDir) await initDir.close();
    }
  });
}

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

const parseArgs = (arrayPar) => {
    const args = arrayPar;
    let secondArgIndex = -1;
    if (operatingSystem === "Windows_NT") {
      secondArgIndex = args.findIndex((el, ind) => {
        if (ind != 0) return /^[A-Za-z]:/.test(el);
      });
    } else {
      secondArgIndex = args.findIndex((el, ind) => {
        if (ind != 0) return el.startsWith(path.sep);
      });
    }
    if (secondArgIndex == -1) return [-1, -1];
    const firstParam = args.slice(0, secondArgIndex).join(" ");
    const fileName = path.basename(firstParam);
    const secondParam = args.slice(secondArgIndex).join(" ");
    console.log(fileName);
    return [firstParam, secondParam, fileName];
};


export {
  handleLSCommand,
  handleUPCommand,
  handleCDCommand,
  handleADDCommand,
  handleRMCommad,
  handleCATCommand,
  hadnleCPCommand,
};
