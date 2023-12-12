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

console.clear();

micInputStream.on("data", function (data) {
  let audioBuffer = new Int16Array(
    data.buffer,
    data.byteOffset,
    data.byteLength / Int16Array.BYTES_PER_ELEMENT
  );

  let sum = 0;
  for (let i = 0; i < audioBuffer.length; i++) {
    sum += Math.abs(audioBuffer[i]);
  }
  let average = sum / audioBuffer.length;

  let maxAmplitude = 32768;
  let intensity = (average / maxAmplitude) * 100; // Asegúrate de que este valor es <= 10

  let intensityBarFilled = chalk.green("█").repeat(intensity);
  let intensityBarEmpty = chalk.grey("▁").repeat(23 - intensity);

  readline.cursorTo(process.stdout, 0);
  process.stdout.write(`[${intensityBarFilled}${intensityBarEmpty}] `);
});

micInputStream.pipe(outputFileStream);

console.log(chalk.green("Recording... " + emoji.get("arrow_forward")));

console.log("\n");
micInstance.start();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", () => {
  micInstance.stop();
  outputFileStream.end();
  console.log("\n");
  const spinner = ora("Processing...").start();
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
      console.log("\n");
      console.log("\n");

      console.log(chalk.green("Transcription copied to clipboard"));
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
        setTimeout(tryTranscribe, 1000);
      }
    });
}
