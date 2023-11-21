import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MapInfoWindow, MapMarker } from "@angular/google-maps";
import { monitorStatus } from "../../../shared/data/monitor";
import * as flvjs from 'flv.js';
import { CarService } from "../../../services/car.service";
import { Table } from "primeng/table";

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent implements AfterViewInit ,OnInit {

  monitorStatus: any = monitorStatus;
  sidebarRightOpen = true;
  mapOpen = true;
  data: any;
  totalItems: number = 8;
  rows: number = Math.ceil(Math.sqrt(this.totalItems)) + 1;
  cols: number = Math.ceil(this.totalItems / this.rows);
  layout: number[] = [];
  value: number = 4;
  height: string = 'h1-2'
  selectedCar: any = [];
  scrollHeight: string = '40vh';
  markers: any[] = [];
  player: any;
  flvPlayer: any;
  isPlay: boolean = false;
  trafficVisable: boolean = false;

  // 調整視窗顯示排版 & 高度
  paymentOptions: any[] = [
    {
      name: '1',
      value: 0,
      row: 1,
      height: 'h1-1'
    },
    {
      name: '2',
      value: 1,
      row: 2,
      height: 'h1-1'
    },
    {
      name: '4',
      value: 2,
      row: 2,
      height: 'h1-2'
    },
    {
      name: '6',
      value: 3,
      row: 3,
      height: 'h1-2'
    },
    {
      name: '8',
      value: 4,
      row: 4,
      height: 'h1-2',
    },
    {
      name: '12',
      value: 5,
      row: 4,
      height: 'h1-3',
      command:() =>{
        this.totalItems = 12
        this.layout.push(this.totalItems - 1);
      },
    },
    {
      name: '16',
      value: 6,
      row: 4,
      height: 'h1-4'
    }
  ];

  carGroups: any = [
    { name: '車隊(A)', code: 'A' },
    { name: '車隊(B)', code: 'B' },
    { name: '車隊(C)', code: 'C' },
    { name: '車隊(D)', code: 'D' },
  ]

  @ViewChild('dt1') dt1!: Table;
  @ViewChild(MapInfoWindow, { static: false }) info!: MapInfoWindow
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  @ViewChild('map', { static: false }) map: any;

  // google map
  polyPath: google.maps.LatLngLiteral[] = [
    { lat: 25.03280092118552, lng: 121.56348748779168 },
    { lat: 25.03587797931996, lng: 121.56351157458673 },
    { lat: 25.03583432131525, lng: 121.56543846794476 },
    { lat: 25.033019138809674, lng: 121.56546250540032 },
    { lat: 25.033062791203154, lng: 121.56201826717597 },
  ];
  center: google.maps.LatLngLiteral = {
    lat: 25.0336962,
    lng: 121.5643673,
  };
  zoom = 17;
  options: google.maps.MapOptions = {
    disableDefaultUI: true,
    backgroundColor: '#126df5',
    clickableIcons: false,
    disableDoubleClickZoom: true,
    draggable: true,
    zoomControl: true,
  };

  constructor(
    private carServ: CarService,

  ) {
    console.log('每列 ' + this.rows + ' 個\n' + '共 ' + this.cols + ' 列')
    for (let i = 0; i < this.totalItems; i++) {
      this.layout.push(i);
    }
    console.log('layout ' + this.layout)
  }

  ngAfterViewInit(): void {
    // 獲取DOM對象
    this.player = document.getElementById('videoElement');

    if (flvjs.default.isSupported()) {
      // 創建flvjs對象
      this.flvPlayer = flvjs.default.createPlayer({
        type: 'flv',        // 指定視頻類型
        isLive: true,       // 開啓直播
        hasAudio: false,    // 關閉聲音
        cors: true,         // 開啓跨域訪問
        url: 'http://34.212.71.99:12060/live.flv?devid=00710171C6&chl=1&st=1&audio=1',   // 指定流鏈接
      });
      // 將flvjs對象和DOM對象綁定
      this.flvPlayer.attachMediaElement(this.player);
      // 加載視頻
      this.flvPlayer.load();
      // 播放視頻
      this.flvPlayer.play()
    }
    console.log(flvjs.default.getFeatureList());
  }

  ngOnInit(): void {
    this.getAllNewGpsRequest();
    // console.log(this.totalItems)
    // this.geocodePositions();
    // this.markers = monitorStatus.map((car: { position: any; url: any; label: { text: any; }; }) => ({
    //   position: car.position,
    //   icon: { url: car.url, scaledSize: new google.maps.Size(50, 50) },
    //   label: { text: car.label.text },
    //   infoWindowContent: car.label.text
    // }));
  }

  products: any[] = [];
  loading = true;
  getAllNewGpsRequest() {
    this.carServ.getAllNewGpsRequest().subscribe({
      next: (res) => {
        this.products = res.body.gps.map((item: any) => ({
          ...item,
          position: {
            lat: item.lat,
            lng: item.lng
          },
          url: this.getUrlByDirection(item.heading, item.status),
          direction: this.parseHeading(item.heading)
        }));
        console.log("來源資料:", this.products);
        this.loading = false;

        this.markers = this.products.map((product: any) => ({
          position: product.position,
          icon: {
            url: product.url,
            scaledSize: new google.maps.Size(50, 50)
          },
          infoWindowContent: product.address,
        }));
        console.log(this.markers)
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  vedioInit() {
    // 獲取DOM對象
    this.player = document.getElementById('videoElement');

    if (flvjs.default.isSupported()) {
      // 創建flvjs對象
      this.flvPlayer = flvjs.default.createPlayer({
        type: 'flv',        // 指定視頻類型
        isLive: true,       // 開啓直播
        hasAudio: false,    // 關閉聲音
        cors: true,         // 開啓跨域訪問
        url: 'http://34.212.71.99:12060/live.flv?devid=00710171C6&chl=1&st=1&audio=1',   // 指定流鏈接
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

  // 點擊表格內容，地圖跳轉到該地點
  Select() {
    if (this.selectedCar) {
      this.center = this.selectedCar.position;
    }
  }

  // count() {
  //   this.rows = Math.ceil(Math.sqrt(this.totalItems));
  //   this.cols = Math.ceil(this.totalItems / this.rows);
  //   console.log('每列 ' + this.rows + ' 個\n' + '共 ' + this.cols + ' 列')
  // }

  // 點擊 Add
  plus() {
    if (this.totalItems < 16) {
      this.totalItems++;
      this.layout.push(this.totalItems - 1);
    }
    console.log(this.totalItems);
    console.log('layout ' + this.layout);
    // this.count();
  }

  // 點擊 Remove
  minus() {
    if (this.totalItems > 0) {
      this.totalItems--;
      this.layout.pop();
    }
    console.log(this.totalItems)
    console.log('layout ' + this.layout)
    // this.count();
  }

  // 選擇 selectButton
  changeRow() {
    if (this.paymentOptions[this.value].name == 12) {
      this.totalItems = 12
      this.layout=[]
      for (let i = 0; i < this.totalItems; i++) {
        this.layout.push(this.totalItems - 1);
      }
    }
    if (this.paymentOptions[this.value].name == 16) {
      this.totalItems = 16
      this.layout=[]
      for (let i = 0; i < this.totalItems; i++) {
        this.layout.push(this.totalItems - 1);
      }
    }
    this.height = this.paymentOptions[this.value].height;
    this.rows = this.paymentOptions[this.value].row;
    this.cols = Math.ceil(this.totalItems / this.rows);
    console.log(' col: ' + this.cols + '\n row: ' + this.rows + '\n height: ' + this.height)
  }

  // 開合側邊欄按鈕
  toggleSidebar() {
    this.sidebarRightOpen = !this.sidebarRightOpen;
  }

  // 開合地圖按鈕
  toggleMap() {
    this.mapOpen = !this.mapOpen;
    if (this.mapOpen) {
      this.scrollHeight = '40vh'
    } else {
      this.scrollHeight = '70vh'
    }
  }

  // 配合側邊欄開關調整寬度
  getMiddleDivClass() {
    if (this.sidebarRightOpen) {
      return 'col-12 md:col-12 lg:col-8';
    } else {
      return 'col-12 md:col-12 lg:col-12';
    }
  }

  // 點擊地圖會在中間
  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = (event.latLng.toJSON());
  }

  display: any

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  infoContent: any = ''

  // 開啟標記標籤的內容
  openInfo(marker: MapMarker, content: string) {
    this.infoContent = content;
    this.info.open(marker)
  }

  // 將座標轉為地址
  geocodePositions() {
    const geocoder = new google.maps.Geocoder();

    this.monitorStatus.forEach((car: {
      position: {
        lat: number | google.maps.LatLngLiteral | google.maps.LatLng;
        lng: number | boolean | null | undefined;
      };
      addr: string;
    }) => {
      const latlng = new google.maps.LatLng(car.position.lat, car.position.lng);

      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          let addressFound = false;
          if (results && results.length > 0) {
            for (let i = 0; i < results.length; i++) {
              const formattedAddress = results[i].formatted_address;
              if (!formattedAddress.match(/\b\w+\+\w+\b/)) {
                car.addr = formattedAddress;
                addressFound = true;
                break; // 找到非 Plus Code 地址後跳出迴圈
              }
            }
          }
          if (!addressFound) {
            car.addr = '找不到地址';
          }
        } else {
          car.addr = '編碼錯誤';
        }
      });
    });
  }

  filterGlobal(event: any) {
    this.dt1.filterGlobal(event.target.value, 'contains')
  }

  getUrlByDirection(heading: number, status: string) {
    let direction = this.parseHeading(heading);

    let directionUrlMap: { [key: string]: { [status: string]: string } } = {
      '北': {
        '熄火': 'assets/car/off_n.png',
        '失聯': 'assets/car/missing_n.png',
        '行駛': 'assets/car/normal_n.png',
        '怠停': 'assets/car/stall_n.png',
        '久停': 'assets/car/stop_n.png'
      },
      '東北': {
        '熄火': 'assets/car/off_ne.png',
        '失聯': 'assets/car/missing_ne.png',
        '行駛': 'assets/car/normal_ne.png',
        '怠停': 'assets/car/stall_ne.png',
        '久停': 'assets/car/stop_ne.png'
      },
      '東': {
        '熄火': 'assets/car/off_e.png',
        '失聯': 'assets/car/missing_e.png',
        '行駛': 'assets/car/normal_e.png',
        '怠停': 'assets/car/stall_e.png',
        '久停': 'assets/car/stop_e.png'
      },
      '東南': {
        '熄火': 'assets/car/off_se.png',
        '失聯': 'assets/car/missing_se.png',
        '行駛': 'assets/car/normal_se.png',
        '怠停': 'assets/car/stall_se.png',
        '久停': 'assets/car/stop_se.png'
      },
      '南': {
        '熄火': 'assets/car/off_s.png',
        '失聯': 'assets/car/missing_s.png',
        '行駛': 'assets/car/normal_s.png',
        '怠停': 'assets/car/stall_s.png',
        '久停': 'assets/car/stop_s.png'
      },
      '西南': {
        '熄火': 'assets/car/off_sw.png',
        '失聯': 'assets/car/missing_sw.png',
        '行駛': 'assets/car/normal_sw.png',
        '怠停': 'assets/car/stall_sw.png',
        '久停': 'assets/car/stop_sw.png'
      },
      '西': {
        '熄火': 'assets/car/off_w.png',
        '失聯': 'assets/car/missing_w.png',
        '行駛': 'assets/car/normal_w.png',
        '怠停': 'assets/car/stall_w.png',
        '久停': 'assets/car/stop_w.png'
      },
      '西北': {
        '熄火': 'assets/car/off_nw.png',
        '失聯': 'assets/car/missing_nw.png',
        '行駛': 'assets/car/normal_nw.png',
        '怠停': 'assets/car/stall_nw.png',
        '久停': 'assets/car/stop_nw.png'
      }
    };

    return directionUrlMap[direction] && directionUrlMap[direction][status] || 'assets/image/warehouse.png';
  }

  parseHeading(heading: number) {
    const directions = ['北', '東北', '東', '東南', '南', '西南', '西', '西北'];
    const index = Math.floor(((heading + 22.5) % 360) / 45);
    return directions[index] || '未知方位';
  }
}
