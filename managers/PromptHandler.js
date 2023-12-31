import readline from "readline";

export class PromptHandler {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }
  async askQuestion(query) {
    return new Promise(resolve => this.rl.question(query, resolve));
  }
}
