import { userName, __filename } from "./functions/constants.js";
import process from "node:process";
import handleOsCommand from "./functions/os.js";

let curDir = __filename;

process.stdout.write(`Welcome to the File Manager, ${userName}!` + "\n");
process.stdout.write(`You are currently in ${curDir}` + "\n");

process.stdin.on("data", (data) => {
  const params = data.toString().trim().split(' ').slice(1);
  const command = data.toString().trim().split(' ')[0];
  switch (command) {
    case ".exit":
      process.stdin.destroy();
      break;
    case "os":
      handleOsCommand(params);
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
