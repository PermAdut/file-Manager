import { dirname } from "node:path";
import { parseArgsCompr } from "./constants.js";
import fsPromises from "node:fs/promises"
import zlib from "node:zlib"
import { createReadStream, createWriteStream } from "node:fs";


async function handleCompressCommand(...params) {
  return new Promise(async (res) => {
    const [relPath, copyPath, fileName, zipName] = parseArgsCompr(params[0]);
    if (relPath == -1) {
      process.stdout.write("Error inputing\n");
      res();
    }
    let dir;
    try{
        await fsPromises.access(relPath);
        dir = await fsPromises.opendir(dirname(copyPath));
        const compress = zlib.createBrotliCompress();
        const readStream = createReadStream(relPath);
        const writeStream = createWriteStream(copyPath);
        const stream = readStream.pipe(compress).pipe(writeStream);
        stream.on('finish', ()=>{
            res();
        })
    } catch(err){
        process.stdout.write("This operation can't be done!\n");
        res();
    } finally{
        if(dir) await dir.close()
    }

  });
}

async function handleDeCompressCommand(...params) {
    return new Promise(async (res) => {
        const [relPath, copyPath, fileName, zipName] = parseArgsCompr(params[0]);
        if (relPath == -1) {
          process.stdout.write("Error inputing\n");
          res();
        }
        let dir;
        try{
            await fsPromises.access(relPath);
            dir = await fsPromises.opendir(dirname(copyPath));
            const compress = zlib.createBrotliDecompress();
            const readStream = createReadStream(relPath);
            const writeStream = createWriteStream(copyPath);
            const stream = readStream.pipe(compress).pipe(writeStream);
            stream.on('finish', ()=>{
                res();
            })
        } catch(err){
            process.stdout.write("This operation can't be done!\n");
            res();
        } finally{
            if(dir) await dir.close()
        }
    
      });
}

export { handleCompressCommand, handleDeCompressCommand };
