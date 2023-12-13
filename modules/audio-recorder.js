import mic from "mic";
import fs from "fs";

class AudioRecorder {
  constructor(micConfig, outputPath) {
    this.micInstance = mic(micConfig);
    this.outputFileStream = fs.createWriteStream(outputPath);
    this.micInputStream = this.micInstance.getAudioStream();
  }

  startRecording() {
    this.micInputStream.pipe(this.outputFileStream);
    this.micInstance.start();
  }

  stopRecording() {
    this.micInstance.stop();
    this.outputFileStream.end();
  }

  getAudioStream() {
    return this.micInputStream;
  }
}

export default AudioRecorder;
