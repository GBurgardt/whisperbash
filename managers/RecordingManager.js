import AudioRecorder from "../modules/audio-recorder.js";

export class RecordingManager {
  constructor(micConfig, outputPath) {
    this.audioRecorder = new AudioRecorder(micConfig, outputPath);
  }
  startRecording() {
    this.audioRecorder.startRecording();
  }
  stopRecording() {
    this.audioRecorder.stopRecording();
  }
  getAudioStream() {
    return this.audioRecorder.getAudioStream();
  }
}
