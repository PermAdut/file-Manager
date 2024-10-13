import os from "node:os";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import path from"node:path"

const args = process.argv.slice(2)
//const __filename = os.homedir();
const __filename = fileURLToPath(dirname(import.meta.url));
const userName = getUserName();
const hashAlgh = "sha256";
const operatingSystem = os.type()

function getUserName(){
    if(args[1].startsWith('--username')){
        
        return args[1].slice(args[1].indexOf('=') + 1)
    }
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
    return [firstParam, secondParam, fileName];
};

const parseArgsCompr = (arrayPar) => {
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
    const firstFileName = path.basename(firstParam);
    const secondParam = args.slice(secondArgIndex).join(" ");
    const secondFilename = path.basename(secondParam);
    return [firstParam, secondParam, firstFileName, secondFilename];
}

export {userName, __filename, hashAlgh, operatingSystem, parseArgs, parseArgsCompr}