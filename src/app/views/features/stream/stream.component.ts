import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
declare var JSMpeg: any;

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})

export class StreamComponent implements OnInit {

  constructor() {
  }

  options = 'rtptransport=tcp&timeout=60&width=0&height=0&bitrate=0&rotation=0';
  streamDisplayStyle = 'none';

  ngOnInit(): void {
    // this.initJsmpegPlayer();
    const messageElement = document.getElementById('message');
    const streamElement = document.getElementById('stream');

    customElements.whenDefined('webrtc-streamer').then(() => {
      const params = new URLSearchParams(window.location.search);
      if (params.has('options')) {
        this.options = params.get('options')!;
      }

      const url = {
        video: params.get('video') || 'rtsp://localhost:554/test',
      };

      streamElement!.setAttribute('options', this.options);
      streamElement!.setAttribute('url', JSON.stringify(url));
      this.streamDisplayStyle = 'block';
    }).catch((e) => {
      messageElement!.innerText =
        'webrtc-streamer webcomponent fails to initialize error:' + e;
    });
  }

  // initJsmpegPlayer(): void {
  //   const canvas = document.getElementById('videoCanvas') as HTMLCanvasElement;
  //   const url = 'rtsp://localhost:554/test'; // rtsp websocket path
  //   const player = new JSMpeg.Player(url, { canvas });
  // }
}
