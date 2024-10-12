import path from "node:path";
import fsPromises from "node:fs/promises";
import { operatingSystem } from "./constants.js";

async function handleLSCommand(dirPath) {
  const dir = await fsPromises.opendir(dirPath);
  const res = [];
  for await (const dirent of dir) {
    const obj = { name: dirent.name, type: "" };
    try{
        const fileStat = await fsPromises.stat(
        path.resolve(dirent.parentPath, dirent.name)
        );
        if (fileStat.isFile()) {
            obj.type = "file";
          } else {
            obj.type = "directory";
        }
        res.push(obj);
    } catch(err){
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
    return new Promise( async (res) => {
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
            } else if (path.isAbsolute(chosedDir)){
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
    })

}


async function handleADDCommand(relPath, ...params){
    const param = params[0][0];
    const newPath = path.resolve(relPath, param)
    let dir;
    try{
        dir = await fsPromises.opendir(relPath);
        await fsPromises.writeFile(newPath, "");
    }
    catch(err){
        process.stdout.write("This operation can't be done!\n");
    } finally{
        if(dir) await dir.close();
    }
}

export { handleLSCommand, handleUPCommand, handleCDCommand, handleADDCommand};
