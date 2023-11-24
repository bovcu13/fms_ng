import { Component, Input, OnInit, signal, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api'
import { CarService } from "../../../services/car.service";
import { mergeMap, switchMap, tap } from "rxjs/operators";
import { interval, of } from "rxjs";
import { Table } from "primeng/table";
import { driver_msg } from "../../../shared/data/products";
import { now } from "../../../shared/data/now";

declare var google: any;

interface Column {
  field: string;
  header: string;
}

interface StatusCount {
  [status: string]: number;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  // 溫度異常台數
  oddTem: number = 1;
  speed: number = 0;
  driver_msg = driver_msg;
  visible: boolean = true;

  constructor(private carServ: CarService) {
  }

  ngOnInit() {

    // 假資料
    this.transformedData = now
    this.mapInit();
    this.createMarkers();

    // Api資料
    // this.getAllNewGpsRequest()
    //     .pipe(
    //       switchMap(() => {
    //         // 資料取得後進行
    //         this.visible = false;
    //         this.afterGet()
    //         this.createMarkers()
    //         return of(null); // 使用 RxJS 的 of 函式返回一個 Observable 包裹的 null
    //       })
    //     )
    //     .subscribe();
    //
    // interval(15000)  // 每隔15秒
    //   .pipe(
    //     mergeMap(() => this.getAllNewGpsRequest()),  // 取得新資料
    //     tap(res => {
    //       // 資料取得後進行的動作
    //       this.afterGet();
    //       this.updateMarkers();
    //     })
    //   )
    //   .subscribe();
  }

  // 即時狀態資料表格 #dt1
  @ViewChild('dt1') dt1!: Table;

  // 篩選
  filterGlobal(event: any) {
    this.dt1.filterGlobal(event.target.value, 'contains')
  }

  // 作用在全景地圖按鈕
  setZoom7() {
    const centerLatLng = new google.maps.LatLng(23.83876, 120.9876);
    this.map.setCenter(centerLatLng);
    this.map.setZoom(7);
  }

  // 地圖 & 地圖設定
  map: any
  mapOptions: any
  // 標記
  markers: google.maps.Marker[] = [];
  // 線條
  poly = google.maps.Polyline;
  // 初始地圖地點
  center: google.maps.LatLngLiteral = {
    lat: 23.83876,
    lng: 120.9876
  };

  // draw
  drawingManager: any;

  // 地圖初始化
  mapInit() {
    // 定義地圖相關設定
    this.mapOptions = {
      zoom: 7,
      center: this.center,
      restriction: {
        strictBounds: false,
      },
      fullscreenControl: false,
      streetViewControl: false,
      scaleControl: true,
    };

    // 創建地圖實例
    this.map = new google.maps.Map(document.getElementById('map'), this.mapOptions);

    // draw
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.POLYGON,
        ],
      },
    });
  }

  products: any[] = [];
  selectedProduct: any;
  circle: any

  // 選取車輛後
  Select() {
    console.log('select: ', this.selectedProduct)
    this.speed = this.selectedProduct.speed;
    if (!this.circle) {
      this.circle = new google.maps.Marker({
        position: new google.maps.LatLng(this.selectedProduct.lat, this.selectedProduct.lng),
        map: this.map,
        icon: {
          url: 'assets/image/circle.png',
          scaledSize: new google.maps.Size(60, 60),
          anchor: new google.maps.Point(30, 30)
        },
        optimized: false,
        zIndex: 0
      });
    } else {
      this.circle.setPosition(new google.maps.LatLng(this.selectedProduct.lat, this.selectedProduct.lng));
    }

    this.map.setCenter(new google.maps.LatLng(this.selectedProduct.lat, this.selectedProduct.lng));
    this.map.setZoom(20);

  }

  // 計算距離
  recordDistances: google.maps.Marker[] = [];
  distanceText: string | null = null;
  addLatLng = (event: google.maps.MapMouseEvent) => {
    const path = this.poly.getPath();

    // 加入座標至地圖
    path.push(event.latLng as google.maps.LatLng);

    // 創建新的標記並將其存入陣列
    const marker = new google.maps.Marker({
      position: event.latLng,
      title: "#" + path.getLength(),
      map: this.map,
    });
    this.recordDistances.push(marker);

    // 如果陣列中有至少兩個標記，計算並顯示距離
    if (this.recordDistances.length >= 2) {
      let totalDistance = 0;
      for (let i = 0; i < this.recordDistances.length - 1; i++) {
        const startMarker = this.recordDistances[i];
        const endMarker = this.recordDistances[i + 1];
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          startMarker.getPosition(),
          endMarker.getPosition()
        );
        totalDistance += distance;
      }
      this.distanceText = `${totalDistance.toFixed(2)} 公尺`;
    }
  }

  // 測量模式是否開啟
  isRanging = false

  // 測量模式開關
  toggleIsRanging() {
    this.isRanging = !this.isRanging;
    // 啟用模式才可畫線
    if (this.isRanging) {
      this.drawingManager.setMap(this.map);
      // 設置線條紀錄距離
      this.poly = new google.maps.Polyline({
        strokeColor: "#000000",
        strokeOpacity: 1.0,
        strokeWeight: 3,
      });
      this.poly.setMap(this.map);
      this.map.addListener("click", this.addLatLng.bind(this));
    } else {
      // 如果按鈕被關閉，則移除點擊事件監聽器
      google.maps.event.clearListeners(this.map, "click");
      this.drawingManager.setMap(null);
      this.poly.setMap(null);
      // 迭代並移除所有標記
      for (const marker of this.recordDistances) {
        marker.setMap(null);
      }
      // 清空陣列
      this.recordDistances = [];
    }
  }

  // 交通圖層
  trafficLayer = new google.maps.TrafficLayer();

  // 路況圖層開關
  toggleTraffic() {
    if (this.trafficLayer.getMap()) {
      // 如果交通圖層已經可見，則隱藏它
      this.trafficLayer.setMap(null);
    } else {
      // 如果交通圖層未可見，則顯示它
      this.trafficLayer.setMap(this.map);
    }
  }

  // 存轉換後api資料
  transformedData: any[] = [];

  // 取得即時狀態Api資料
  getAllNewGpsRequest() {
    return this.carServ.getAllNewGpsRequest().pipe(
      tap(res => {
        this.products = res.body.gps;
      })
    );
  }

  infowindow = new google.maps.InfoWindow();
  cars: any;
  carStatus: any;

  // Api資料取得後進行
  afterGet() {
    this.transformedData = this.products.map(item => ({
      ...item,
      url: this.getUrlByDirection(item.heading, item.status),
      addr: "",
      direction: this.parseHeading(item.heading)
    }));
    this.speed = this.transformedData[0].speed;
    this.cars = this.products.map(item => ({
      name: item.license_plate,
      code: item.license_plate
    }));
    this.carStatus = this.products.map(item => ({
      status: item.status,
    }));
    this.calculationCarStatus(this.carStatus);
    // 轉換成中文地址
    // this.geocodePositions();
    console.log("資料:", this.transformedData)
  }

  statusCount: StatusCount = {};

  // 統計車輛狀態
  calculationCarStatus(carStatus: any[]) {
    // 使用 reduce() 方法來統計每個狀態的類別數
    this.statusCount = carStatus.reduce((acc, curr) => {
      const status = curr.status;

      // 如果已經存在該狀態，則將計數加一，否則新增一個新的狀態並將計數設為一
      acc[status] = (acc[status] || 0) + 1;

      return acc;
    }, {} as StatusCount);
  }

  // 創標記
  createMarkers() {
    for (const location of this.transformedData) {
      //標記
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(location.lat, location.lng),
        map: this.map,
        title: location.address,
        icon: {
          url: location.url,
          scaledSize: new google.maps.Size(60, 60),
          anchor: new google.maps.Point(30, 30)
        },
        zIndex: 1
      });

      const licensePlate = location.license_plate;
      const driver = location.driver;
      const content = `
      <div class="text-center">
        <label>${licensePlate}</label>
        <br>
        <label>${driver}</label>
      </div>
    `;

      // 更新infowindow的内容
      this.infowindow = new google.maps.InfoWindow({
        content: content,
      });

      // 一開始就顯示資訊窗口
      this.infowindow.open(this.map, marker);

      this.markers.push(marker);

      // 點擊標記顯示info, 設定中心點
      google.maps.event.addListener(marker, 'click', () => {
        this.selectedProduct = location;
        this.Select();
      });
    }
  }

  // 更新標記
  updateMarkers() {
    for (let i = 0; i < this.transformedData.length; i++) {
      const location = this.transformedData[i];
      const marker = this.markers[i];

      // 檢查 marker 是否存在
      if (!marker) {
        continue;  // 若 marker 不存在，跳過這次迴圈
      }

      const currentPosition = marker.getPosition();

      // 檢查 currentPosition 是否存在
      if (currentPosition) {
        // 檢查位置是否有變化
        if (currentPosition.lat() !== location.lat || currentPosition.lng() !== location.lng) {
          // 更新 marker 位置
          const newPosition = new google.maps.LatLng(location.lat, location.lng);
          marker.setPosition(newPosition);
        }
      }

      // 檢查URL變化
      if (marker.getIcon() !== location.url) {
        // 更新URL
        marker.setIcon({
          url: location.url,
          scaledSize: new google.maps.Size(60, 60),
          anchor: new google.maps.Point(30, 30)
        });
      }
    }
  }

  // 依方位取得車輛圖片
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

    return directionUrlMap[direction] && directionUrlMap[direction][status] || 'assets/image/car1.png';
  }

  // 依方位取得方位文字
  parseHeading(heading: number) {
    const directions = ['北', '東北', '東', '東南', '南', '西南', '西', '西北'];
    const index = Math.floor(((heading + 22.5) % 360) / 45);
    return directions[index] || '未知方位';
  }

  addr: any[] = []

  // 轉換成中文地址
  geocodePositions() {
    const geocoder = new google.maps.Geocoder();

    this.transformedData.forEach(product => {
      const latlng = new google.maps.LatLng(product.lat, product.lng);
      geocoder.geocode({ location: latlng }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
        if (status === google.maps.GeocoderStatus.OK) {
          let addressFound = false;
          if (results && results.length > 0) {
            for (let i = 0; i < results.length; i++) {
              const formattedAddress = results[i].formatted_address;
              if (!formattedAddress.match(/\b\w+\+\w+\b/)) {
                product.addr = formattedAddress;
                addressFound = true;
                break; // 找到非 Plus Code 地址後跳出迴圈
              }
            }
          }
          if (!addressFound) {
            product.addr = '找不到地址';
          }
        } else {
          product.addr = '編碼錯誤';
        }
      });
    });
  }

}
