import AudioTranscriber from "../modules/audio-transcriber.js";
import PromptAgent from "../modules/prompt-agent.js";

export class TranscriptionManager {
  constructor(outputPath, sessionFolder) {
    this.audioTranscriber = new AudioTranscriber(outputPath, sessionFolder);
    this.promptAgent = new PromptAgent();
  }
  async transcribe() {
    let result = await this.audioTranscriber.transcribe();

    return result;
  }

  async improveTranscription({ numImprovements, transcription }) {
    for (let i = 0; i < numImprovements; i++) {
      transcription = await this.promptAgent.improveAgent1({
        prompt: transcription,
      });
    }

    return transcription;
  }
}
