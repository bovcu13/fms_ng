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
  totalItems: number = 8;
  rows: number = Math.ceil(Math.sqrt(this.totalItems)) + 1;
  cols: number = Math.ceil(this.totalItems / this.rows);
  layout: number[] = [];
  value: number = 4;
  height: string = 'h1-2'
  paymentOptions: any[] = [
    {name: '1', value: 0, row: 1, height: 'h1-1'},
    {name: '2', value: 1, row: 2, height: 'h1-1'},
    {name: '4', value: 2, row: 2, height: 'h1-2'},
    {name: '6', value: 3, row: 3, height: 'h1-2'},
    {name: '8', value: 4, row: 4, height: 'h1-2'},
    {name: '12', value: 5, row: 4, height: 'h1-3'},
    {name: '16', value: 6, row: 4, height: 'h1-4'}
  ];

  constructor() {
    console.log('每列 ' + this.rows + ' 個\n' + '共 ' + this.cols + ' 列')
    for (let i = 0; i < this.totalItems; i++) {
      this.layout.push(i);
    }
    console.log('layout ' + this.layout)
  }

  ngOnInit(): void {
    console.log(this.totalItems)
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

  // count() {
  //   this.rows = Math.ceil(Math.sqrt(this.totalItems));
  //   this.cols = Math.ceil(this.totalItems / this.rows);
  //   console.log('每列 ' + this.rows + ' 個\n' + '共 ' + this.cols + ' 列')
  // }

  plus() {
    if (this.totalItems < 16) {
      this.totalItems++;
      this.layout.push(this.totalItems - 1);
    }
    console.log(this.totalItems);
    console.log('layout ' + this.layout);
    // this.count();
  }

  minus() {
    if (this.totalItems > 0) {
      this.totalItems--;
      this.layout.pop();
    }
    console.log(this.totalItems)
    console.log('layout ' + this.layout)
    // this.count();
  }

  changeRow() {
    this.height = this.paymentOptions[this.value].height;
    this.rows = this.paymentOptions[this.value].row;
    this.cols = Math.ceil(this.totalItems / this.rows);
    console.log(' col: ' + this.cols + '\n row: ' + this.rows + '\n height: ' + this.height)
  }

}
