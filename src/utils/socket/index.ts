import {Socket} from 'socket.io';
import {AudioIn} from './types';
import wav from 'wav';

class SocketManager {
  wavWriter: wav.FileWriter | null = null;

  constructor(private socket: Socket) {
    this.addListeners();
  }

  private onAudioIn(audioData: AudioIn): void {
    console.log(audioData.length, 'bytes received');
    this.socket.emit('message', `Received ${audioData.length} bytes of audio`);

    if (this.wavWriter) {
      const buffer = Buffer.from(new Int32Array(audioData).buffer);
      this.wavWriter.write(buffer);
    }
  }

  private addListeners(): void {
    this.socket.on('audio:in', (data: AudioIn) => {
      this.onAudioIn(data);
    });

    this.socket.on('audio:config', data => {
      console.log(`Received config ${data}`);
      const filename = `data/recs/recording_${Date.now()}.wav`;
      this.wavWriter = new wav.FileWriter(filename, {
        channels: data.channels,
        sampleRate: data.rate,
        bitDepth: 32,
      });
    });
  }
}

export default SocketManager;
