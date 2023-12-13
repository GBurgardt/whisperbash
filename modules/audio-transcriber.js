import ora from "ora";
import chalk from "chalk";
import { transcribeAudio } from "../transcriber.js";
import * as emoji from "node-emoji";

class AudioTranscriber {
  constructor(outputPath, isRecordingFinished) {
    this.outputPath = outputPath;
    this.isRecordingFinished = isRecordingFinished;
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
          if (
            err.code === "ENOENT" &&
            !this.isRecordingFinished &&
            retryCount < 3
          ) {
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
