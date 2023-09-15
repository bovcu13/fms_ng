import {Component, OnInit} from '@angular/core';
import * as flvjs from 'flv.js';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})

export class StreamComponent implements OnInit {

  constructor() {
  }

  title = 'app';
  player: any;
  flvPlayer: any;
  isPlay: boolean = false;

  ngOnInit(): void {

  }

  control(): void {
    if(this.isPlay){
      this.flvPlayer.pause();
      this.isPlay = !this.isPlay;
    }
    else{
      this.flvPlayer.play();
      this.isPlay = !this.isPlay;
    }
  }

  stop(): void {
    this.flvPlayer.pause();
    this.flvPlayer.unload();
    // 卸載DOM對象
    this.flvPlayer.detachMediaElement();
    // 銷燬flvjs對象
    this.flvPlayer.destroy();
  }
}
