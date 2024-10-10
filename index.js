import { userName, __filename, operatingSystem } from "./functions/constants.js";
import process from "node:process";
import handleOsCommand from "./functions/os.js";
import handleHashCommand from "./functions/hash.js";
import { handleLSCommand, handleUPCommand } from "./functions/filesystem.js";
let curDir = __filename;

process.stdout.write(`Welcome to the File Manager, ${userName}!` + "\n");
process.stdout.write(`You are currently in ${curDir}` + "\n");

process.stdin.on("data", async (data) => {
  const params = data.toString().trim().split(" ").slice(1);
  const command = data.toString().trim().split(" ")[0];
  console.log(operatingSystem);
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
