import { exec } from "child_process";
import chalk from "chalk";

export function printResult(result) {
  console.log(chalk.cyan(result));
}

export function copyToClipboard(result) {
  exec(`echo ${result} | pbcopy`);
}
