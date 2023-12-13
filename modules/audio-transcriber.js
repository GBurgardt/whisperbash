import ora from "ora";
import chalk from "chalk";
import { transcribeAudio } from "../transcriber.js";
import * as emoji from "node-emoji";
import path from "path";
import fs from "fs";

class AudioTranscriber {
  constructor(outputPath, sessionFolder) {
    this.outputPath = outputPath;
    this.sessionFolder = sessionFolder;
  }

  async transcribe() {
    console.log("\n");
    const spinner = ora("Processing...").start();

    try {
      const transcription = await this.tryTranscribe();
      spinner.stop();

      console.log("\n");
      console.log(chalk.cyan(transcription));
      console.log("\n");
      console.log(chalk.green("Transcription copied to clipboard"));

      const transcriptionPath = path.join(
        this.sessionFolder,
        "transcription.txt"
      );
      fs.writeFileSync(transcriptionPath, transcription, "utf8");
    } catch (err) {
      spinner.stop();
      console.error(chalk.red("Error during transcription: "), err);
    }
  }

  async tryTranscribe(retryCount = 0) {
    return new Promise((resolve, reject) => {
      transcribeAudio(this.outputPath)
        .then(resolve)
        .catch(err => {
          if (err.code === "ENOENT" && retryCount < 3) {
            console.log(chalk.yellow("Reintentando transcripción..."));
            setTimeout(() => {
              this.tryTranscribe(retryCount + 1)
                .then(resolve)
                .catch(reject);
            }, 1000);
          } else {
            console.error(
              chalk.red("Error al transcribir: " + emoji.get("x"), err.message)
            );
            reject(err);
          }
        });
    });
  }
}

export default AudioTranscriber;
