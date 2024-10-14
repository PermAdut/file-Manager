import crypto from "node:crypto";
import { hashAlgh } from "./constants.js";
import { createReadStream } from "node:fs";
import { access, constants } from "node:fs/promises";
import { resolve } from "node:path";
import { extractParam } from "./constants.js";

export default async function handleHashCommand(relPath, ...params) {
  return new Promise(async (res) => {
    const param = extractParam(params[0]);
    const newPath = resolve(relPath, param);
    try {
      await access(newPath, constants.F_OK);
      const stream = createReadStream(newPath);
      const hash = crypto.createHash(hashAlgh);
      stream.on("readable", () => {
        const data = stream.read();
        if (data) {
          hash.update(data);
        } else {
          process.stdout.write(`${hash.digest("hex")}` + "\n");
        }
      });
      stream.on("end", () => {
        stream.close();
        res();
      });
      stream.on("error", (err) => {
        process.stdout.write("Operation failed" + "\n");
      });
    } catch (e) {
      if (err.code == "ENOENT") {
        process.stdout.write("Invalid input\n");
      } else {
        process.stdout.write("Operation failed\n");
      }
      res();
    }
  });
}
