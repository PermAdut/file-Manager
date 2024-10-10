import path from "node:path";
import fsPromises from "node:fs/promises";
import { operatingSystem } from "./constants";

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
    return Promise((res) => {
        const dirs = relPath.split(path.sep);
        if(operatingSystem == 'Windows_NT'){

        } else if(operatingSystem == 'Linux') {

        } else {}
    })
}

export {handleLSCommand,handleUPCommand}