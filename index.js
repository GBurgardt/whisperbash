#!/usr/bin/env node
import readline from "readline";
import micConfig from "./micConfig.js";
import chalk from "chalk";
import fs from "fs";
import path from "path";

import AudioRecorder from "./modules/audio-recorder.js";
import AudioVisualizer from "./modules/audio-visualizer.js";
import AudioTranscriber from "./modules/audio-transcriber.js";
import PromptAgent from "./modules/prompt-agent.js";
import { exec } from "child_process";

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
const promptAgent = new PromptAgent();

// Comprobar si el argumento -i está presente
const improveFlag = process.argv.includes("-i");
const improveFlag2 = process.argv.includes("-h");

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
    const initialPrompt = await audioTranscriber.transcribe();

    if (improveFlag) {
      const resultAgent1 = await promptAgent.improveAgent1({
        prompt: initialPrompt,
      });

      let result;

      if (improveFlag2) {
        console.log("imp2: ", true);

        const respAgent2 = await promptAgent.improveAgent2({
          prompt: initialPrompt,
          respImproveAgent1: resultAgent1,
        });

        result = await promptAgent.improveAgent3({
          prompt_final: respAgent2,
          pedido_inicial: initialPrompt,
          respuesta_inicial: resultAgent1,
        });
      } else {
        result = resultAgent1;
      }

      exec(`echo ${result} | pbcopy`);
      console.log("\n");
      console.log(chalk.cyan(result));
    } else {
      console.log("\n");
      console.log(chalk.cyan(initialPrompt));
      console.log("\n");
    }

    console.log("\n");
    console.log(chalk.green("Transcription copied to clipboard"));

    process.exit(0);
  } catch (err) {
    console.error(chalk.red("Error during transcription: "), err);
    process.exit(1);
  }
});
