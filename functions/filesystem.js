import path from "node:path";
import fsPromises from "node:fs/promises";
import { operatingSystem } from "./constants.js";

async function handleLSCommand(dirPath){
    const dir = await fsPromises.opendir(dirPath);
    const res = []
    for await (const dirent of dir){
        const obj = {name:dirent.name, type:""}
        const fileStat = await fsPromises.stat(path.resolve(dirent.parentPath, dirent.name))
        if(fileStat.isFile()){
            obj.type = "file";
        } else {
            obj.type = "directory";
        }
        res.push(obj)
    }
    console.table(res)
}

async function handleUPCommand(relPath){
    return new Promise((res) => {
        const dirs = relPath.split(path.sep);
        if(operatingSystem == 'Windows_NT'){
            if(dirs.length == 1){
                res(relPath)
            } else {
                relPath = dirs.slice(0,-1).join(path.sep);
            }
        } else if(operatingSystem == 'Linux' || operatingSystem == 'Darwin') {
            if(dirs.length == 0){
                res(path.sep)
            } else {
                relPath = dirs.slice(0,-1).join(path.sep);
            }
        }
        res(relPath)
    })
}

export {handleLSCommand,handleUPCommand}