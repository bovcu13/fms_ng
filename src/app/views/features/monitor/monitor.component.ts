import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent implements OnInit {
  videoItems = [
    {
      name: 'Video one',
      src: 'assets/vdo/swimming.mp4',
      type: 'video/mp4'
    }
  ];
  activeIndex = 0;
  currentVideo = this.videoItems[this.activeIndex];
  data: any;

  totalItems: number = 4;
  rows: number = Math.ceil(Math.sqrt(this.totalItems));
  cols: number = Math.ceil(this.totalItems / this.rows);
  layout: number[] = [];

  constructor() {
    console.log('每列 ' + this.rows + ' 個\n' + '共 ' + this.cols + ' 列')
    for (let i = 0; i < this.rows * this.cols; i++) {
      this.layout.push(i);
    }
    console.log('layout ' + this.layout)
  }

  ngOnInit(): void {
  }

  videoPlayerInit(data: any) {
    this.data = data;
    this.data.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.initVdo.bind(this));
    this.data.getDefaultMedia().subscriptions.ended.subscribe(this.nextVideo.bind(this));
  }

  nextVideo() {
    this.activeIndex++;
    if (this.activeIndex === this.videoItems.length) {
      this.activeIndex = 0;
    }
    this.currentVideo = this.videoItems[this.activeIndex];
  }

  initVdo() {
    this.data.play();
  }

  startPlaylistVdo(item: any, index: number) {
    this.activeIndex = index;
    this.currentVideo = item;
  }

  count() {
    this.rows = Math.ceil(Math.sqrt(this.totalItems));
    this.cols = Math.ceil(this.totalItems / this.rows);
    console.log('每列 ' + this.rows + ' 個\n' + '共 ' + this.cols + ' 列')
  }

  plus() {
    if (this.totalItems < 16) {
      this.totalItems++;
      this.layout.push(this.totalItems - 1);
    }
    console.log(this.totalItems);
    console.log('layout ' + this.layout);
    this.count();
  }

  minus() {
    if (this.totalItems > 0) {
      this.totalItems--;
      this.layout.pop();
    }
    console.log(this.totalItems)
    console.log('layout ' + this.layout)
    this.count();
  }
}
