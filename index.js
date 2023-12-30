#!/usr/bin/env node
import readline from "readline";
import micConfig from "./micConfig.js";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import os from "os";
import { exec } from "child_process";

import AudioRecorder from "./modules/audio-recorder.js";
import AudioVisualizer from "./modules/audio-visualizer.js";
import AudioTranscriber from "./modules/audio-transcriber.js";
import PromptAgent from "./modules/prompt-agent.js";

// Crear una carpeta de sesión
function createSessionFolder() {
  const sessionFolder = `${os.homedir()}/recordings/session_${new Date()
    .toISOString()
    .replace(/:/g, "")
    .replace(/\..+/, "")}`;
  fs.mkdirSync(sessionFolder, { recursive: true });
  return sessionFolder;
}

const sessionFolder = createSessionFolder();
let outputPath = path.join(sessionFolder, "audio.wav");

let audioRecorder = new AudioRecorder(micConfig, outputPath);
let audioVisualizer = new AudioVisualizer(Date.now());
let audioTranscriber = new AudioTranscriber(outputPath, sessionFolder);
const promptAgent = new PromptAgent();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  audioRecorder.startRecording();

  audioRecorder.getAudioStream().on("data", function (data) {
    audioVisualizer.visualizeAudio(data);
  });

  await askQuestion("Presiona Enter para detener la grabación... \n");

  audioRecorder.stopRecording();

  const improveFlag = await askQuestion(
    "¿Quieres mejorar la transcripción? (s/n) "
  );
  let numImprovements = 1;

  if (improveFlag.toLowerCase() === "s") {
    const num = await askQuestion(
      "¿Cuántas veces quieres mejorar la transcripción? "
    );
    numImprovements = parseInt(num) || 1;
  }

  const transcribeAndPrint = async () => {
    const initialPrompt = await audioTranscriber.transcribe();
    let result = initialPrompt;

    if (improveFlag.toLowerCase() === "s") {
      for (let i = 0; i < numImprovements; i++) {
        result = await promptAgent.improveAgent1({ prompt: result });
      }
    }

    exec(`echo ${result} | pbcopy`);
    printResult(result);

    return result;
  };

  const printResult = result => {
    console.log(chalk.cyan(result));
  };

  try {
    await transcribeAndPrint();
    process.exit(0);
  } catch (err) {
    console.error(chalk.red("Error durante la transcripción: "), err);
    process.exit(1);
  }
}

main();
