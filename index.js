import { userName, __filename } from "./functions/constants.js";
import process from "node:process";
import handleOsCommand from "./functions/os.js";
import handleHashCommand from "./functions/hash.js";
import {
  handleADDCommand,
  handleRMCommad,
  handleCATCommand,
  handleRNCommand,
} from "./functions/filesystem.js";
import {
  handleCDCommand,
  handleLSCommand,
  handleUPCommand,
} from "./functions/dirsOperations.js";
import {
  handleCompressCommand,
  handleDeCompressCommand,
} from "./functions/compress.js";
import { hadnleCPCommand, handleMVCommand } from "./functions/copyCommands.js";

let curDir = __filename;

process.stdout.write(`Welcome to the File Manager, ${userName}!` + "\n");
process.stdout.write(`You are currently in ${curDir}` + "\n");

process.stdin.on("data", async (data) => {
  const params = data.toString().trim().split(" ").slice(1);
  const command = data.toString().trim().split(" ")[0];
  switch (command) {
    case ".exit":
      process.stdin.destroy();
      break;
    case "os":
      await handleOsCommand(params);
      break;
    case "hash":
      await handleHashCommand(curDir, params);
      break;
    case "ls":
      await handleLSCommand(curDir);
      break;
    case "up":
      curDir = await handleUPCommand(curDir);
      break;
    case "cd":
      curDir = await handleCDCommand(curDir, params);
      break;
    case "add":
      await handleADDCommand(curDir, params);
      break;
    case "rm":
      await handleRMCommad(curDir, params);
      break;
    case "cat":
      await handleCATCommand(curDir, params);
      break;
    case "cp":
      await hadnleCPCommand(curDir, params);
      break;
    case "mv":
      await handleMVCommand(curDir, params);
      break;
    case "rn":
      await handleRNCommand(curDir, params);
      break;
    case "compress":
      await handleCompressCommand(curDir, params);
      break;
    case "decompress":
      await handleDeCompressCommand(curDir, params);
      break;
    default:
      process.stdout.write("Invalid input" + "\n");
  }
  process.stdout.write(`You are currently in ${curDir}` + "\n");
});

process.stdin.on("close", () => {
  process.stdout.write(
    `Thank you for using File Manager, ${userName}, goodbye!` + "\n"
  );
});

process.stdin.on("end", () => {
  process.stdout.write(
    `Thank you for using File Manager, ${userName}, goodbye!` + "\n"
  );
});

process.on("SIGINT", () => {
  process.stdout.write(
    `Thank you for using File Manager, ${userName}, goodbye!` + "\n"
  );
  process.exit();
});
