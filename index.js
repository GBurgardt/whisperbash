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

// Inicia un contador de tiempo
var startTime = Date.now();

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
  let intensity = (average / maxAmplitude) * 300; // Ajustar la intensidad para que sea menor y comience desde el extremo
  intensity = Math.min(intensity, 50); // Asegurarse de que no sobrepase el nuevo límite establecido

  // Patrón que se expande hacia un lado según la intensidad
  let pattern = "• ".repeat(intensity).padStart(0, " ");

  readline.cursorTo(process.stdout, 0);
  readline.clearLine(process.stdout, 0); // Limpia la línea antes de escribir la nueva salida

  // Calcula los segundos transcurridos desde que se inició la grabación
  const spaceBetwen = 80 - pattern.length;
  let secondsElapsed = ((Date.now() - startTime) / 1000)
    .toFixed(2)
    .padStart(spaceBetwen, " ");

  // Escribe solo el patrón de puntos rojos y los segundos transcurridos al final
  process.stdout.write(
    chalk.red(pattern) + " " + chalk.white(secondsElapsed + "s\n")
  );
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

// var micInstance = mic(micConfig);
// var outputFileStream = fs.createWriteStream("output.wav");
// var micInputStream = micInstance.getAudioStream();
// var isRecordingFinished = false;

// console.clear();

// micInputStream.on("data", function (data) {
//   let audioBuffer = new Int16Array(
//     data.buffer,
//     data.byteOffset,
//     data.byteLength / Int16Array.BYTES_PER_ELEMENT
//   );

//   let sum = 0;
//   for (let i = 0; i < audioBuffer.length; i++) {
//     sum += Math.abs(audioBuffer[i]);
//   }
//   let average = sum / audioBuffer.length;

//   let maxAmplitude = 32768;
//   let intensity = (average / maxAmplitude) * 250; // Ajustar la intensidad para que sea menor y comience desde el extremo
//   intensity = Math.min(intensity, 50); // Asegurarse de que no sobrepase el nuevo límite establecido

//   // Patrón que se expande hacia un lado según la intensidad
//   let pattern = "• ".repeat(intensity).padStart(0, " ");

//   readline.cursorTo(process.stdout, 0);
//   readline.clearLine(process.stdout, 0); // Limpia la línea antes de escribir la nueva salida
//   // Escribe solo el patrón de puntos rojos
//   process.stdout.write(chalk.red(pattern) + "\n");
// });

// micInputStream.pipe(outputFileStream);

// console.log(chalk.green("Recording... " + emoji.get("arrow_forward")));

// console.log("\n");
// micInstance.start();

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// rl.on("line", () => {
//   micInstance.stop();
//   outputFileStream.end();
//   console.log("\n");
//   const spinner = ora("Processing...").start();
//   spinner.color = "yellow";
//   isRecordingFinished = true;
//   tryTranscribe();
//   rl.close();
// });

// function tryTranscribe() {
//   if (!isRecordingFinished) {
//     console.log(
//       chalk.magenta("La grabación aún no ha terminado. Esperando...")
//     );
//     setTimeout(tryTranscribe, 1000);
//     return;
//   }

//   transcribeAudio("output.wav")
//     .then(transcription => {
//       console.log("\n");
//       console.log(chalk.cyan(transcription));
//       console.log("\n");
//       console.log("\n");

//       console.log(chalk.green("Transcription copied to clipboard"));
//     })
//     .catch(err => {
//       if (err.code === "ENOENT") {
//         console.error(
//           chalk.red(
//             "Error al transcribir: El archivo no existe. Verifique que la grabación haya terminado."
//           )
//         );
//       } else {
//         console.error(
//           chalk.red("Error al transcribir: " + emoji.get("x"), err.message)
//         );
//         console.log(chalk.yellow("Reintentando transcripción..."));
//         setTimeout(tryTranscribe, 1000);
//       }
//     });
// }

// var micInstance = mic(micConfig);
// var outputFileStream = fs.createWriteStream("output.wav");
// var micInputStream = micInstance.getAudioStream();
// var isRecordingFinished = false;

// console.clear();

// micInputStream.on("data", function (data) {
//   let audioBuffer = new Int16Array(
//     data.buffer,
//     data.byteOffset,
//     data.byteLength / Int16Array.BYTES_PER_ELEMENT
//   );

//   let sum = 0;
//   for (let i = 0; i < audioBuffer.length; i++) {
//     sum += Math.abs(audioBuffer[i]) * 10;
//   }
//   let average = sum / audioBuffer.length;

//   let maxAmplitude = 32768;
//   let intensity = (average / maxAmplitude) * 75; // Ajustar la intensidad a la mitad de la consola
//   intensity = Math.min(intensity, 75); // Asegurarse de que no sobrepase la mitad de la consola

//   // Patrón que se expande y contrae según la intensidad, centrado
//   let leftPattern = "• ".repeat(intensity).padStart(75, " ");
//   let rightPattern = "• ".repeat(intensity).padEnd(75, " ");

//   readline.cursorTo(process.stdout, 0);
//   readline.clearLine(process.stdout, 0); // Limpia la línea antes de escribir la nueva salida
//   // Combina los patrones con colores diferentes para el efecto de espejo
//   process.stdout.write(
//     chalk.blue(leftPattern) + chalk.red(rightPattern) + "\n"
//   );
// });

// micInputStream.pipe(outputFileStream);

// console.log(chalk.green("Recording... " + emoji.get("arrow_forward")));

// console.log("\n");
// micInstance.start();

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// rl.on("line", () => {
//   micInstance.stop();
//   outputFileStream.end();
//   console.log("\n");
//   const spinner = ora("Processing...").start();
//   isRecordingFinished = true;
//   tryTranscribe();
//   rl.close();
// });

// function tryTranscribe() {
//   if (!isRecordingFinished) {
//     console.log(
//       chalk.magenta("La grabación aún no ha terminado. Esperando...")
//     );
//     setTimeout(tryTranscribe, 1000);
//     return;
//   }

//   transcribeAudio("output.wav")
//     .then(transcription => {
//       console.log("\n");
//       console.log(chalk.cyan(transcription));
//       console.log("\n");
//       console.log("\n");

//       console.log(chalk.green("Transcription copied to clipboard"));
//     })
//     .catch(err => {
//       if (err.code === "ENOENT") {
//         console.error(
//           chalk.red(
//             "Error al transcribir: El archivo no existe. Verifique que la grabación haya terminado."
//           )
//         );
//       } else {
//         console.error(
//           chalk.red("Error al transcribir: " + emoji.get("x"), err.message)
//         );
//         console.log(chalk.yellow("Reintentando transcripción..."));
//         setTimeout(tryTranscribe, 1000);
//       }
//     });
// }
