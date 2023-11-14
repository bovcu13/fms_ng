import { Component, Input, OnInit, signal } from '@angular/core';
import { MenuItem } from 'primeng/api'
import { CarService } from "../../../services/car.service";
import { mergeMap, switchMap, tap } from "rxjs/operators";
import { interval, of } from "rxjs";

declare var google: any;

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  // 溫度異常台數
  oddTem: number = 1;

  constructor(private carServ: CarService) {
  }

  ngOnInit() {
    this.mapInit();
    this.colsInit();
    this.itemInit();

    this.getAllNewGpsRequest()
        .pipe(
          switchMap(() => {
            // 資料取得後進行
            this.afterGet()
            this.createMarkers()
            return of(null); // 使用 RxJS 的 of 函式返回一個 Observable 包裹的 null
          })
        )
        .subscribe();

    interval(7000)  // 每隔15秒
      .pipe(
        mergeMap(() => this.getAllNewGpsRequest()),  // 取得新資料
        tap(res => {
          // 資料取得後進行的動作
          this.afterGet();
          this.updateMarkers();
        })
      )
      .subscribe();
  }

  // 顯示欄位
  cols!: Column[];
  _selectedColumns!: Column[];
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  clearMultiSelect() {
    // onClear事件
    this._selectedColumns = [];
  }

  colsInit() {
    this.cols = [
      { field: 'phone', header: '電話' },
      { field: 'date_time', header: '回傳時間' },
      { field: 'speed', header: '速度' },
      { field: 'direction', header: '方向' },
      { field: 'addr', header: '位置' },
      { field: 'vehicle_name', header: '車輛名稱' },
      { field: 'statusAccumulated', header: '狀態累積' },
      { field: 'departureTime', header: '出車時間' },
      { field: 'drivingTime', header: '開車時間' },
      { field: 'temp', header: '溫度' },
      { field: 'progress', header: '裝卸進度' },
    ];

    this._selectedColumns = [
      { field: 'progress', header: '裝卸進度' },
    ]
  }

  // 功能列
  items!: MenuItem[];

  itemInit() {
    this.items = [
      {
        icon: 'pi pi-truck',
        tooltipOptions: {
          tooltipLabel: "路況顯示",
          tooltipPosition: "bottom"
        },
        command: () => {
          this.toggleTraffic()
        }
      },
      {
        icon: 'fas fa-compress-arrows-alt',
        tooltipOptions: {
          tooltipLabel: "全景地圖",
          tooltipPosition: "bottom"
        },
        command: () => {
          const centerLatLng = new google.maps.LatLng(23.83876, 120.9876);
          this.map.setCenter(centerLatLng);
          this.map.setZoom(8);
        }
      }
    ];
  }

  // 地圖
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
  // 地圖邊界
  TAIWAN_BOUNDS = {
    north: 25.36,
    south: 21.86,
    west: 118.18,
    east: 123.78,
  };

  // 按下右鍵的地標按鈕顯示
  landmarkButt = false;
  markDialog: boolean = false;

  // draw
  drawingManager: any;

  showMarkDialog() {
    this.markDialog = true;
  }

  markType: any[] = [
    { name: 'Home', icon: 'pi pi-home', code: 'Home' },
    { name: 'Star', icon: 'pi pi-star-fill', code: 'Star' },
    { name: 'Company', icon: 'pi pi-building', code: 'Company' },
  ];

  mapInit() {
    // 定義地圖相關設定
    this.mapOptions = {
      zoom: 7,
      center: this.center,
      restriction: {
        latLngBounds: this.TAIWAN_BOUNDS,
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

    // 點右鍵生成標記以新增地標
    this.map.addListener("contextmenu", (e: any) => {
      this.placeMarkerAndPanTo(e.latLng, this.map);
      const customButton = document.getElementById('custom-button');
      // 檢查 customButton 是否為 null
      if (customButton) {
        customButton.style.display = 'block';

        // 設定按鈕位置在地圖中心點的下方
        const buttonLeft = (this.map.getDiv().offsetWidth / 2 - 45) + 'px';
        const buttonTop = (this.map.getDiv().offsetHeight / 2 + 50) + 'px';

        customButton.style.left = buttonLeft;
        customButton.style.top = buttonTop;

        // 設定 landmarkButt 為 true
        this.landmarkButt = true;
      }
    });

    // 監聽地圖的點擊事件，清空地標
    this.map.addListener("click", (e: any) => {
      // 清除之前的標記
      if (this.previousMarker) {
        this.previousMarker.setMap(null);
        this.previousMarker.setPosition(null);
      }
      // 檢查 landmarkButt 是否為 true，如果是就隱藏座標和按鈕
      if (this.landmarkButt) {
        const customButton = document.getElementById('custom-button');
        if (customButton) {
          customButton.style.display = 'none';
        }
        // 將 landmarkButt 設定為 false
        this.landmarkButt = false;
      }
    });

    // 監聽地圖的拖動事件，清空地標
    this.map.addListener("drag", () => {
      // 清除之前的標記
      if (this.previousMarker) {
        this.previousMarker.setMap(null);
        this.previousMarker.setPosition(null);
      }
      // 檢查 landmarkButt 是否為 true，如果是就隱藏座標和按鈕
      if (this.landmarkButt) {
        const customButton = document.getElementById('custom-button');
        if (customButton) {
          customButton.style.display = 'none';
        }
        // 將 landmarkButt 設定為 false
        this.landmarkButt = false;
      }
    });

    // 右鍵新增的標記顯示在中間
    this.map.addListener("center_changed", () => {
      window.setTimeout(() => {
        if (this.previousMarker) {
          this.map.panTo(this.previousMarker.getPosition() as google.maps.LatLng);
        }
      }, 0);
    });
  }

  // 選取車輛
  products: any[] = [];
  selectedProduct: any;
  circle: any

  Select() {
    if (this.selectedProduct) {
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

  // 路況圖層開關
  trafficLayer = new google.maps.TrafficLayer();

  toggleTraffic() {
    if (this.trafficLayer.getMap()) {
      // 如果交通圖層已經可見，則隱藏它
      this.trafficLayer.setMap(null);
    } else {
      // 如果交通圖層未可見，則顯示它
      this.trafficLayer.setMap(this.map);
    }
  }

  poiMarker = google.maps.LatLngLiteral

  //新增地標的按鈕
  addLandMark() {
    const svgMarker = {
      path: "M19,11v9h-5v-6h-4v6H5v-9H3.6L12,3.4l8.4,7.6H19z",
      fillColor: "red",
      fillOpacity: 0.8,
      strokeWeight: 0,
      rotation: 0,
      scale: 1,
      anchor: new google.maps.Point(0, 20),
    };

    this.poiMarker = this.previousMarker
    // 創建新的標記
    const marker = new google.maps.Marker({
      position: this.poiMarker.getPosition(),
      map: this.map,
      label: {
        text: "\ue88a", // codepoint from https://fonts.google.com/icons
        fontFamily: "Material Icons",
        color: "#ffffff",
        fontSize: "18px",
      },
    });

    this.markDialog = false;
    // 清除之前的標記
    if (this.previousMarker) {
      this.previousMarker.setMap(null);
      this.previousMarker.setPosition(null);
    }
    // 檢查 landmarkButt 是否為 true，如果是就隱藏座標和按鈕
    if (this.landmarkButt) {
      const customButton = document.getElementById('custom-button');
      if (customButton) {
        customButton.style.display = 'none';
      }
      // 將 landmarkButt 設定為 false
      this.landmarkButt = false;
    }
  }

  previousMarker: google.maps.Marker | null = null;

  // 點擊地圖座標跑至中心
  placeMarkerAndPanTo(latLng: google.maps.LatLng, map: google.maps.Map) {
    // 清除之前的標記
    if (this.previousMarker) {
      this.previousMarker.setMap(null);
    }

    // 創建新的標記
    const marker = new google.maps.Marker({
      position: latLng,
      map: map,
    });

    // 設定地圖中心為新位置
    map.panTo(latLng);

    // 將新標記設為上一個標記
    this.previousMarker = marker;
  }

  addr: any[] = []

  // 加到addr
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

  transformedData: any[] = []; // 存轉換後api資料

  getAllNewGpsRequest() {
    return this.carServ.getAllNewGpsRequest().pipe(
      tap(res => {
        this.products = res.body.gps;
        console.log("來源資料:", res);
      })
    );
  }

  infowindow = new google.maps.InfoWindow();
  cars: any;
  carStatus: any[] = [];

  afterGet() {
    this.transformedData = this.products.map(item => ({
      ...item,
      url: this.getUrlByDirection(item.heading, item.status),
      addr: "",
      infoWindowContent: item.license_plate + '' + item.driver,
      direction: this.parseHeading(item.heading)
    }));
    this.cars = this.products.map(item => ({
      name: item.license_plate,
      code: item.license_plate
    }));
    this.carStatus = this.products.map(item => ({
      status: item.status,
    }));
    this.calculationCarStatus(this.carStatus);
    // 轉換成中文地址
    this.geocodePositions();
    console.log("轉換後資料:", this.transformedData)
    console.log("車輛狀態:", this.carStatus)
  }

  calculationCarStatus(carStatus: any[]) {

    // 使用 reduce() 方法來統計每個狀態的類別數
    const statusCount = carStatus.reduce((acc, curr) => {
      const status = curr.status;

      // 如果已經存在該狀態，則將計數加一，否則新增一個新的狀態並將計數設為一
      acc[status] = (acc[status] || 0) + 1;

      return acc;
    }, {});

    // statusCount 現在包含了每個狀態的類別數
    console.log(statusCount);
  }

  createMarkers() {
    for (const location of this.transformedData) {
      //標記
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(location.lat, location.lng),
        map: this.map,
        title: location.addr,
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

  updateMarkers() {
    // this.markers = [];
    // for (const location of this.transformedData) {
    //   //標記
    //   const marker = new google.maps.Marker({
    //     position: new google.maps.LatLng(location.lat, location.lng),
    //     map: this.map,
    //     title: location.addr,
    //     icon: {
    //       url: location.url,
    //       scaledSize: new google.maps.Size(60, 60),
    //       anchor: new google.maps.Point(30, 30)
    //     },
    //     zIndex: 1
    //   });
    //
    //   const licensePlate = location.license_plate;
    //   const driver = location.driver;
    //   const content = `
    //   <div class="text-center">
    //     <label>${licensePlate}</label>
    //     <br>
    //     <label>${driver}</label>
    //   </div>
    // `;
    //
    //   // 更新infowindow的内容
    //   this.infowindow.setContent(content);
    //
    //   // 一開始就顯示資訊窗口
    //   this.infowindow.open(this.map, marker);
    //
    //   this.markers.push(marker);
    //
    //   // 點擊標記顯示info, 設定中心點
    //   google.maps.event.addListener(marker, 'click', () => {
    //     this.selectedProduct = location;
    //     this.Select();
    //   });
    // }
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
