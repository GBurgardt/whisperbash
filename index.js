import mic from "mic";
import fs from "fs";
import readline from "readline";
import { transcribeAudio } from "./transcriber.js";
import micConfig from "./micConfig.js";
import chalk from "chalk";
import ora from "ora";
import * as emoji from "node-emoji";

var micInstance = mic(micConfig);
var outputFileStream = fs.createWriteStream("output.wav");
var micInputStream = micInstance.getAudioStream();
var isRecordingFinished = false;

micInputStream.on("data", function (data) {
  console.log(
    chalk.blue(
      `Grabando... ${emoji.get("microphone")} [${data.length} bytes recibidos]`
    )
  );
});

micInputStream.pipe(outputFileStream);

console.log(
  chalk.green("Iniciando grabación... " + emoji.get("arrow_forward"))
);

const recordingSpinner = ora({
  text: "Grabando... Presiona ENTER para detener.",
  color: "yellow",
  spinner: "dots",
});

micInstance.start();
recordingSpinner.start();

micInstance.start();

console.log("Grabando... Presiona ENTER para detener.");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", () => {
  micInstance.stop();
  outputFileStream.end();
  recordingSpinner.succeed("Finalizando grabación, procesando audio...");
  isRecordingFinished = true;
  tryTranscribe();
  rl.close();
});

function tryTranscribe() {
  if (!isRecordingFinished) {
    console.log(
      chalk.magenta("La grabación aún no ha terminado. Esperando...")
    );
    setTimeout(tryTranscribe, 1000);
    return;
  }

  transcribeAudio("output.wav")
    .then(transcription => {
      console.log("\n");
      console.log(chalk.cyan(transcription));
    })
    .catch(err => {
      if (err.code === "ENOENT") {
        console.error(
          chalk.red(
            "Error al transcribir: El archivo no existe. Verifique que la grabación haya terminado."
          )
        );
      } else {
        console.error(
          chalk.red("Error al transcribir: " + emoji.get("x"), err.message)
        );
        console.log(chalk.yellow("Reintentando transcripción..."));
        // setTimeout(tryTranscribe, 5000);
        setTimeout(tryTranscribe, 1000);
      }
    });
}
