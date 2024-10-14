import os from "node:os";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import path from "node:path";

const args = process.argv.slice(2);
const __filename = os.homedir();
//const __filename = fileURLToPath(dirname(import.meta.url)); // apply this for testing
const userName = getUserName();
const hashAlgh = "sha256";
const operatingSystem = os.type();

function getUserName() {
  if (args[1].startsWith("--username")) {
    return args[1].slice(args[1].indexOf("=") + 1);
  }
}

const extractParam = (params) => {
  const paramString = params.join(" ").trim();
  if (paramString.startsWith('"') && paramString.endsWith('"')) {
    return paramString.slice(1, -1);
  }
  return paramString;
};

const exactTwoParams = (params, relPath) => {
  const fullParams = params[0].join(" ").trim();
  const quoteCount = (fullParams.match(/"/g) || []).length;
  if (quoteCount < 4) {
    return [-1, -1];
  }
  const firstIndex = fullParams.indexOf('"');
  const firstSpaceIndex = fullParams.indexOf(" ", firstIndex);
  if (firstSpaceIndex === -1 || firstIndex === -1) {
    return [-1, -1];
  }
  const pathToFile = fullParams
    .slice(firstIndex + 1, firstSpaceIndex - 1)
    .trim();
  const lastIndex = fullParams.lastIndexOf('"');
  const lastSpaceIndex = fullParams.lastIndexOf(" ", lastIndex - 1);
  if (lastSpaceIndex === -1 || lastIndex === -1) {
    return [-1, -1];
  }
  const newFileName = fullParams.slice(lastSpaceIndex + 2, lastIndex).trim();
  return [
    path.resolve(relPath, pathToFile),
    path.resolve(relPath, newFileName),
  ];
};

export {
  userName,
  __filename,
  hashAlgh,
  operatingSystem,
  extractParam,
  exactTwoParams,
};
