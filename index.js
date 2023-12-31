#!/usr/bin/env node
import createSessionFolder from "./managers/SessionManager.js";
import { RecordingManager } from "./managers/RecordingManager.js";
import { VisualizerManager } from "./managers/VisualizerManager.js";
import { TranscriptionManager } from "./managers/TranscriptionManager.js";
import { PromptHandler } from "./managers/PromptHandler.js";
import { printResult, copyToClipboard } from "./managers/ResultManager.js";
import micConfig from "./micConfig.js";
import path from "path";

async function main() {
  const sessionFolder = createSessionFolder();
  let outputPath = path.join(sessionFolder, "audio.wav");

  const recordingManager = new RecordingManager(micConfig, outputPath);
  const visualizerManager = new VisualizerManager();
  const transcriptionManager = new TranscriptionManager(
    outputPath,
    sessionFolder
  );
  const promptHandler = new PromptHandler();

  recordingManager.startRecording();
  recordingManager.getAudioStream().on("data", data => {
    visualizerManager.visualizeAudio(data);
  });

  await promptHandler.askQuestion(
    "Presiona Enter para detener la grabación... \n"
  );
  recordingManager.stopRecording();

  const addCodeFlag = await promptHandler.askQuestion(
    "¿Quieres agregar código al final? (s/n) "
  );
  let codeToAdd = "";
  if (addCodeFlag.toLowerCase() === "s") {
    codeToAdd = await promptHandler.askQuestion(
      "Por favor, ingresa el código: \n"
    );
  }

  const improveFlag = await promptHandler.askQuestion(
    "¿Quieres mejorar la transcripción? (s/n) "
  );
  let numImprovements = 1;
  if (improveFlag.toLowerCase() === "s") {
    const num = await promptHandler.askQuestion(
      "¿Cuántas veces quieres mejorar la transcripción? "
    );
    numImprovements = parseInt(num) || 1;
  }

  let result = await transcriptionManager.transcribe();

  if (addCodeFlag.toLowerCase() === "s") {
    result += "\n\nCódigo:\n <<<CODE>>>";
  }

  if (improveFlag.toLowerCase() === "s") {
    result = await transcriptionManager.improveTranscription({
      numImprovements,
      transcription: result,
    });
  }

  if (addCodeFlag.toLowerCase() === "s") {
    result = result.replace("<<<CODE>>>", "<<<\n" + codeToAdd + "\n>>>");
  }

  copyToClipboard(result);
  printResult(result);
}

main().catch(err => {
  console.error("Error durante la ejecución: ", err);
  process.exit(1);
});
