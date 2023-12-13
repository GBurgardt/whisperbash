#!/usr/bin/env node
import readline from "readline";
import micConfig from "./micConfig.js";
import chalk from "chalk";
import fs from "fs";
import path from "path";

import AudioRecorder from "./modules/audio-recorder.js";
import AudioVisualizer from "./modules/audio-visualizer.js";
import AudioTranscriber from "./modules/audio-transcriber.js";

// Crear una carpeta de sesión
function createSessionFolder() {
  const sessionFolder = `recordings/session_${new Date()
    .toISOString()
    .replace(/:/g, "")
    .replace(/\..+/, "")}`;
  fs.mkdirSync(sessionFolder, { recursive: true });
  return sessionFolder;
}

// Configuración inicial
const sessionFolder = createSessionFolder();
let outputPath = path.join(sessionFolder, "audio.wav");

let audioRecorder = new AudioRecorder(micConfig, outputPath);
let audioVisualizer = new AudioVisualizer(Date.now());
let audioTranscriber = new AudioTranscriber(outputPath, sessionFolder);

// Iniciar grabación y visualización
audioRecorder.startRecording();
console.log(chalk.green("Recording... "));

audioRecorder.getAudioStream().on("data", function (data) {
  audioVisualizer.visualizeAudio(data);
});

// Manejo de la entrada del usuario para detener la grabación
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", async () => {
  audioRecorder.stopRecording();
  try {
    await audioTranscriber.transcribe();
    process.exit(0);
  } catch (err) {
    console.error(chalk.red("Error during transcription: "), err);
    process.exit(1);
  }
});

// #!/usr/bin/env node
// import readline from "readline";
// import micConfig from "./micConfig.js";
// import chalk from "chalk";

// import AudioRecorder from "./modules/audio-recorder.js";
// import AudioVisualizer from "./modules/audio-visualizer.js";
// import AudioTranscriber from "./modules/audio-transcriber.js";

// // Configuración inicial
// let outputPath = "output.wav";

// let audioRecorder = new AudioRecorder(micConfig, outputPath);
// let audioVisualizer = new AudioVisualizer(Date.now());
// let audioTranscriber = new AudioTranscriber(outputPath);

// // Iniciar grabación y visualización
// audioRecorder.startRecording();
// console.log(chalk.green("Recording... "));

// audioRecorder.getAudioStream().on("data", function (data) {
//   audioVisualizer.visualizeAudio(data);
// });

// // Manejo de la entrada del usuario para detener la grabación
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// rl.on("line", async () => {
//   audioRecorder.stopRecording();
//   try {
//     await audioTranscriber.transcribe();
//     process.exit(0);
//   } catch (err) {
//     console.error(chalk.red("Error during transcription: "), err);
//     process.exit(1);
//   }
// });
