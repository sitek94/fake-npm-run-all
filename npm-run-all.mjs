import fs from "fs";
import childProcess from "child_process";

// Get arguments from command line
const args = process.argv.slice(2);

// Expect two arguments, e.g. "dev:* parallel", which will
// run all tasks with "dev" prefix in parallel
const [command, mode] = args;
const [prefix, suffix] = command.split(":");

if (!mode) {
  console.error("Please specify a mode: parallel or sequential");
  process.exit(1);
}

// Check if command is used properly
if (suffix !== "*") {
  console.error(`Usage: "npm-run-all prefix:*"`);
  process.exit(1);
}

// Get all tasks from package.json that match the prefix
const packageJsonString = fs.readFileSync("./package.json", "utf8");
const packageJson = JSON.parse(packageJsonString);
const tasks = Object.keys(packageJson.scripts).filter((task) =>
  task.startsWith(prefix)
);

if (mode === "parallel") {
  for (const task of tasks) {
    console.log(`🏗️ Running: ${task}`);
    const command = `npm run ${task}`;
    childProcess.exec(command, () => {
      console.log(`🏁 Finished: ${task}`);
    });
  }
}

if (mode === "sequential") {
  for (const task of tasks) {
    console.log(`🏗️ Running: ${task}`);
    const command = `npm run ${task}`;
    childProcess.execSync(command);
    console.log(`🏁 Finished: ${task}`);
  }
}
