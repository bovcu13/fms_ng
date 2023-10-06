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
// 獲取DOM對象
    this.player = document.getElementById('videoElement');

    if (flvjs.default.isSupported()) {
      // 創建flvjs對象
      this.flvPlayer = flvjs.default.createPlayer({
        type: 'flv',        // 指定視頻類型
        isLive: true,       // 開啓直播
        hasAudio: false,    // 關閉聲音
        cors: true,         // 開啓跨域訪問
        url: 'http://203.70.231.9:12060/live.flv?devid=00710171C6&chl=1&st=1&audio=1',   // 指定流鏈接
      });

      // 將flvjs對象和DOM對象綁定
      this.flvPlayer.attachMediaElement(this.player);
      // 加載視頻
      this.flvPlayer.load();
      // 播放視頻
      this.flvPlayer.play();
    }

    console.log(flvjs.default.getFeatureList());
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
