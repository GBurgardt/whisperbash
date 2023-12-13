import chalk from "chalk";

class AudioVisualizer {
  constructor(startTime) {
    this.startTime = startTime;
  }

  visualizeAudio(data) {
    let audioBuffer = new Int16Array(
      data.buffer,
      data.byteOffset,
      data.byteLength / Int16Array.BYTES_PER_ELEMENT
    );

    let sum = 0;
    for (let i = 0; i < audioBuffer.length; i++) {
      sum += Math.abs(audioBuffer[i]);
    }
    let average = sum / audioBuffer.length;

    let maxAmplitude = 32768;
    let intensity = (average / maxAmplitude) * 300;
    intensity = Math.min(intensity, 50);

    let pattern = "• ".repeat(intensity).padStart(0, " ");

    const spaceBetwen = 130 - pattern.length;
    let secondsElapsed = ((Date.now() - this.startTime) / 1000)
      .toFixed(2)
      .padStart(spaceBetwen, " ");

    process.stdout.write(
      chalk.red(pattern) + " " + chalk.white(secondsElapsed + "s\n")
    );
  }
}

export default AudioVisualizer;
