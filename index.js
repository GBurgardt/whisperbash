import mic from "mic";
import fs from "fs";
import readline from "readline";
import { transcribeAudio } from "./transcriber.js";
import micConfig from "./micConfig.js";

var micInstance = mic(micConfig);
var outputFileStream = fs.createWriteStream("output.wav");
var micInputStream = micInstance.getAudioStream();
var isRecordingFinished = false;

micInputStream.on("data", function (data) {
  console.log(`Grabando... [${data.length} bytes recibidos]`);
});

micInputStream.pipe(outputFileStream);

console.log("Iniciando grabación... Habla y presiona ENTER para finalizar.");

micInstance.start();

console.log("Grabando... Presiona ENTER para detener.");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", () => {
  micInstance.stop();
  outputFileStream.end(); // Asegurar que el stream del archivo se cierre
  console.log("Finalizando grabación, procesando audio...");
  isRecordingFinished = true;
  tryTranscribe();
  rl.close();
});

function tryTranscribe() {
  if (!isRecordingFinished) {
    console.log("La grabación aún no ha terminado. Esperando...");
    setTimeout(tryTranscribe, 1000); // Espera un segundo antes de reintentar
    return;
  }

  transcribeAudio("output.wav")
    .then(transcription => {
      console.log("\n");
      console.log(transcription);
    })
    .catch(err => {
      if (err.code === "ENOENT") {
        console.error(
          "Error al transcribir: El archivo no existe. Verifique que la grabación haya terminado."
        );
      } else {
        console.error("Error al transcribir: ", err.message);
        console.log("Reintentando transcripción...");
        setTimeout(tryTranscribe, 5000); // Espera 5 segundos antes de reintentar
      }
    });
}

// import mic from "mic";
// import fs from "fs";
// import readline from "readline";
// import { transcribeAudio } from "./transcriber.js";
// import micConfig from "./micConfig.js";

// var micInstance = mic(micConfig);
// var outputFileStream = fs.createWriteStream("output.wav");
// var micInputStream = micInstance.getAudioStream();

// micInputStream.on("data", function (data) {
//   console.log(`Grabando... [${data.length} bytes recibidos]`);
// });

// micInputStream.pipe(outputFileStream);

// console.log("Iniciando grabación... Habla y presiona ENTER para finalizar.");

// micInstance.start();

// console.log("Grabando... Presiona ENTER para detener.");

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// rl.on("line", input => {
//   micInstance.stop();
//   console.log("Finalizando grabación, procesando audio...");

//   transcribeAudio("output.wav")
//     .then(transcription => {
//       console.log("\n");
//       console.log(transcription);
//     })
//     .catch(err => {
//       console.error("Error al transcribir: ", err.message);
//     });
//   rl.close();
// });
