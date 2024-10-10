import os from "node:os";

const args = process.argv.slice(2)
const __filename = os.homedir();
const userName = getUserName();
const hashAlgh = "sha256";
const operatingSystem = os.type()

function getUserName(){
    if(args[1].startsWith('--username')){
        
        return args[1].slice(args[1].indexOf('=') + 1)
    }
}

export {userName, __filename, hashAlgh, operatingSystem}