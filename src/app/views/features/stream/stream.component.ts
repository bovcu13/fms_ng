import { Component, OnInit } from '@angular/core';
declare var JSMpeg: any;

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})

export class StreamComponent implements OnInit {
  ngOnInit(): void {
    this.initJsmpegPlayer();
  }

  constructor() {
  }

  initJsmpegPlayer(): void {
    const canvas = document.getElementById('videoCanvas') as HTMLCanvasElement;
    const url = 'ws://localhost:60278'; // rtsp websocket path
    const player = new JSMpeg.Player(url, { canvas });
  }
}
