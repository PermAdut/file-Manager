import crypto from "node:crypto";
import { hashAlgh } from "./constants.js";
import { createReadStream } from "node:fs";
import { access, constants } from "node:fs/promises";


export default async function handleHashCommand(...params){
    const param = params[0].join(' ');
    try{
        await access(param, constants.F_OK);
        const stream = createReadStream(param);
        const hash = crypto.createHash(hashAlgh);
        stream.on("readable", () => {
            const data = stream.read();
            if(data){
                hash.update(data)
            } else {
                process.stdout.write(`${hash.digest('hex')}` + '\n');
            }
        });
    } catch(e){
        process.stdout.write("Operation failed" + '\n');
        return;
    }

}
