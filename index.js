import mic from "mic";
import fs from "fs";
import readline from "readline";
import { transcribeAudio } from "./transcriber.js";
import micConfig from "./micConfig.js";

var micInstance = mic(micConfig);
var outputFileStream = fs.createWriteStream("output.wav");
var micInputStream = micInstance.getAudioStream();

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

rl.on("line", input => {
  micInstance.stop();
  console.log("Finalizando grabación, procesando audio...");

  transcribeAudio("output.wav")
    .then(transcription => {
      console.log("\n");
      console.log(transcription);
    })
    .catch(err => {
      console.error("Error al transcribir: ", err.message);
    });
  rl.close();
});
