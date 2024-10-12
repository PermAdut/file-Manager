import {
  userName,
  __filename,
  operatingSystem,
} from "./functions/constants.js";
import process from "node:process";
import handleOsCommand from "./functions/os.js";
import handleHashCommand from "./functions/hash.js";
import {
    handleADDCommand,
  handleCDCommand,
  handleLSCommand,
  handleUPCommand,
  handleRMCommad,
  handleCATCommand,
  hadnleCPCommand,
  handleMVCommand,
} from "./functions/filesystem.js";
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
      await handleHashCommand(params);
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
       await handleRMCommad(params);
       break;   
    case "cat":
        await handleCATCommand(params);
        break; 
    case "cp":
        await hadnleCPCommand(params);
        break;     
    case "mv":
        await handleMVCommand(params);
        break;
    case "rn":
        break;
    case "compress":
        break;
    case "decompress":
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
