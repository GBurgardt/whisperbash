import AudioVisualizer from "../modules/audio-visualizer.js";

export class VisualizerManager {
  constructor() {
    this.audioVisualizer = new AudioVisualizer(Date.now());
  }
  visualizeAudio(data) {
    this.audioVisualizer.visualizeAudio(data);
  }
}
