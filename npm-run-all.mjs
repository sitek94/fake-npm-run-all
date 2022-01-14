import fs from "fs";
import childProcess from "child_process";

// Get arguments from command line
let args = process.argv.slice(2);

const isParallel = args.includes("--parallel");
// We're running in sequential mode by default, if there is no --parallel option
const isSequential = !isParallel;

// Filter out options
args = args.filter((arg) => !arg.startsWith("--"));

let tasks = [];

for (const arg of args) {
  const [prefix, suffix] = arg.split(":");

  // Check if we want to run all the tasks
  if (suffix === "*") {
    // Get all tasks from package.json that match the prefix
    const packageJsonString = fs.readFileSync("./package.json", "utf8");
    const packageJson = JSON.parse(packageJsonString);
    tasks = Object.keys(packageJson.scripts).filter((task) =>
      task.startsWith(prefix)
    );

    // A task without a star "*" can be simply pushed to the list of tasks
  } else {
    tasks.push(arg);
  }
}

if (isParallel) {
  console.log("🧙‍ Running tasks in parallel\n");

  for (const task of tasks) {
    console.log(`🏗️ Running: ${task}`);
    const command = `npm run ${task}`;
    childProcess.exec(command, () => {
      console.log(`🏁 Finished: ${task}`);
    });
  }
}

if (isSequential) {
  console.log("🧱‍ Running tasks sequentially \n");

  for (const task of tasks) {
    console.log(`🏗️ Running: ${task}`);
    const command = `npm run ${task}`;
    childProcess.execSync(command);
    console.log(`🏁 Finished: ${task}`);
  }
}
