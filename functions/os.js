import os from "node:os";


const cpus = os.cpus()
const eol = Array.from(os.EOL).map(el => 
    `#${el.charCodeAt(0).toString(10).toUpperCase()}`
).join(' ')
const architechture = os.arch();
const username = os.userInfo().username;

async function handleOsCommand(...params){
    const args = params[0];
    for(let i = 0; i < args.length; i++){
        switch(args[i]){
            case "--EOL":
                process.stdout.write(`COMMAND os --EOL:` + '\n');
                process.stdout.write(`EOL: ${eol}` + '\n');
                break;
            case "--cpus":
                process.stdout.write(`COMMAND os --cpus:` + '\n');
                process.stdout.write(`cpus amount ${cpus.length}` + '\n');
                process.stdout.write(`CPU INFO` + '\n');
                for(let i =0; i<cpus.length; i++){
                    process.stdout.write(`Model & Clock Rate ${i + 1}: ${cpus[i].model}` + '\n');
                }
                break;
            case "--homedir":
                process.stdout.write(`COMMAND os --homedir:` + '\n');
                process.stdout.write(`homedir: ${os.homedir}` + '\n');
                break;

            case "--username":
                process.stdout.write(`COMMAND os --username:` + '\n');
                process.stdout.write(`Username: ${username}` + '\n');
                break;
            case "--architecture":
                process.stdout.write(`COMMAND os --architecture:` + '\n');
                process.stdout.write(`Architecture ${architechture}` + '\n')
                break;
            default:
                process.stdout.write("Invalid input" + "\n");
                return;    
        }
    }
}

export default handleOsCommand;