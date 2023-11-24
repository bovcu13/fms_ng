import { Component, OnInit } from '@angular/core';
import { products } from "../../../shared/data/products";
import { MenuItem } from 'primeng/api'
import { CarService } from "../../../services/car.service";
import { HttpClient } from "@angular/common/http";

// declare var google: any;

@Component({
  selector: 'app-history',
  templateUrl: './history-path.component.html',
  styleUrls: ['./history-path.component.scss']
})
export class HistoryPathComponent implements OnInit {
  sliderValue: number = 0; // 初始化滑塊的值
  totalTime: number = 0;
  isPlaying: boolean = true;
  intervalId: any;

  //num -> 時間 小時：分鐘：秒
  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600); // 計算小時數
    const minutes = Math.floor((seconds % 3600) / 60); // 計算分鐘數
    const remainingSeconds = seconds % 60; // 計算剩餘的秒數

    // 格式化時間，確保分鐘和秒數始終有兩位數
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  playable: boolean = true

  // togglePlay() {
  //   if (!this.isPlaying) {
  //     this.pauseCarMovement()
  //     clearInterval(this.intervalId);
  //   } else {
  //     this.intervalId = setInterval(() => {
  //       this.sliderValue++;
  //       if (this.sliderValue > this.totalTime) {
  //         this.clearIntervalAndPauseCarMovement();
  //       }
  //     }, this.speed);
  //     this.animateMarker(this.snappedCoordinates, this.car)
  //   }
  //   this.isPlaying = !this.isPlaying;
  // }

  speedRate: number = 1;
  speed: number = 1000;

  // changeSpeed() {
  //   const speedRates = [2, 5, 10, 0.5, 1];
  //   const currentIndex = speedRates.indexOf(this.speedRate);
  //   this.speedRate = speedRates[(currentIndex + 1) % speedRates.length];
  //   this.speed = 1000 / this.speedRate;
  //
  //   if (!this.isPlaying) {
  //     this.intervalId = setInterval(() => {
  //       this.sliderValue++;
  //       if (this.sliderValue > this.totalTime) {
  //         this.clearIntervalAndPauseCarMovement();
  //       }
  //     }, this.speed);
  //     this.animateMarker(this.snappedCoordinates, this.car)
  //   }
  // }

  clearIntervalAndPauseCarMovement() {
    clearInterval(this.intervalId);
    this.pauseCarMovement();
  }

  // onSliderChange(event: any) {
  //   this.selectedProduct = this.transformedData[event.value]
  //   const newIndex = event.value; // 取得slider的值作為新的index
  //   const route = this.snappedCoordinates;
  //
  //   // 更新marker的位置
  //   const newPosition = google.maps.geometry.spherical.interpolate(
  //     route[newIndex],
  //     route[newIndex + 1],
  //     0 // 初始進度為0，即起始位置
  //   );
  //   if (this.car) {
  //     this.car.setPosition(newPosition);
  //   }
  //
  //   // 更新播放狀態
  //   this.state.index = newIndex;
  //   this.state.progress = 0;
  // }

  products: any[] = products;
  selectedProduct: any;

  carGroups: any = [
    { name: '車隊(A)', code: 'A' },
    { name: '車隊(B)', code: 'B' },
    { name: '車隊(C)', code: 'C' },
    { name: '車隊(D)', code: 'D' },
  ]
  cars: any[] = [];

  selectedProductIndex: number = 0;

  // Select() {
  //   if (this.selectedProduct) {
  //     console.log('selected:',this.selectedProduct)
  //     this.center = this.selectedProduct;
  //     this.map.setCenter(new google.maps.LatLng(this.center.lat, this.center.lng));
  //   }
  //   if (this.selectedProduct) {
  //     // 找index
  //     const selectedIndex = this.transformedData.findIndex(
  //       product => product === this.selectedProduct
  //     );
  //
  //     // 是否被找到
  //     if (selectedIndex !== -1) {
  //       // 儲存index
  //       this.selectedProductIndex = selectedIndex;
  //       console.log('index:', this.selectedProductIndex);
  //       this.sliderValue = this.selectedProductIndex;
  //       const route = this.snappedCoordinates;
  //
  //       // 更新marker的位置
  //       const newPosition = google.maps.geometry.spherical.interpolate(
  //         route[selectedIndex],
  //         route[selectedIndex + 1],
  //         0 // 初始進度為0，即起始位置
  //       );
  //       if (this.car) {
  //         this.car.setPosition(newPosition);
  //       }
  //
  //       // 更新播放狀態
  //       this.state.index = selectedIndex;
  //       this.state.progress = 0;
  //
  //     } else {
  //       console.log('錯誤');
  //     }
  //   }
  // }

  //車
  // car: google.maps.Marker | null = null; // 車輛標記

  // 暫停車輛
  pauseCarMovement(): void {
    clearInterval(this.markerMoveInter);
  }

  state = {
    index: 0,
    progress: 0
  };

  markerMoveInter: any

  // animateMarker(route: any[], marker: any) {
  //   console.log('目前播放速度:',this.speedRate)
  //   const totalFrames = 50 / this.speedRate;
  //   const frameDuration = 1000 / this.speedRate / totalFrames;
  //   const step = 1 / totalFrames;
  //
  //   const animateMarker = () => {
  //     this.state.progress += step;
  //     if (this.state.progress < 1) {
  //       const newPosition = google.maps.geometry.spherical.interpolate(
  //         route[this.state.index],
  //         route[this.state.index + 1],
  //         this.state.progress
  //       );
  //       this.selectedProduct = this.transformedData[this.state.index]
  //       marker.setPosition(newPosition);
  //       marker.setIcon({
  //         url: this.snappedAngles[this.state.index].url,
  //         scaledSize: new google.maps.Size(50, 50),
  //         anchor: new google.maps.Point(25, 25)
  //       });
  //     } else {
  //       this.state.index++;
  //       if (this.state.index < route.length - 1) {
  //         this.state.progress = 0;
  //       } else {
  //         clearInterval(this.markerMoveInter);
  //       }
  //     }
  //     console.log('state.index:',this.state.index)
  //   };
  //
  //   this.markerMoveInter = setInterval(animateMarker, frameDuration);
  // }

  // // 儲存路線座標
  // routeCoordinates: google.maps.LatLngLiteral[] = [];
  //
  // //初始地圖地點 -> 在南投
  // center: google.maps.LatLngLiteral = {
  //   lat: 23.83876,
  //   lng: 120.9876
  // };

  map: any
  mapOptions: any

  // 功能列
  items!: MenuItem[];

  // 地標按鈕顯示
  landmarkButt = false;
  markDialog: boolean = false;

  showMarkDialog() {
    this.markDialog = true;
  }

  constructor(private carServ: CarService, private http: HttpClient) {
  }

  ngOnInit(): void {
    // this.itemInit()
    //
    // this.mapInit()

    this.getAllVehiclesRequest()

    this.getDefaultDate()
  }

  // itemInit() {
  //   this.items = [
  //     {
  //       icon: 'pi pi-truck',
  //       tooltipOptions: {
  //         tooltipLabel: "路況顯示",
  //         tooltipPosition: "bottom"
  //       },
  //       command: () => {
  //         this.toggleTraffic()
  //       }
  //     },
  //     {
  //       icon: 'fas fa-compress-arrows-alt',
  //       tooltipOptions: {
  //         tooltipLabel: "全景地圖",
  //         tooltipPosition: "bottom"
  //       },
  //       command: () => {
  //         const centerLatLng = new google.maps.LatLng(23.83876, 120.9876);
  //         this.map.setCenter(centerLatLng);
  //         this.map.setZoom(8);
  //       }
  //     }
  //   ];
  // }

  // mapInit() {
  //   // 定義地圖相關設定
  //   this.mapOptions = {
  //     zoom: 8,
  //     center: this.center
  //   };
  //
  //   // 創建地圖實例
  //   this.map = new google.maps.Map(document.getElementById('map'), this.mapOptions);
  //
  //   //建立點的按鈕 -> 右鍵生成地標
  //   this.map.addListener("contextmenu", (e: any) => {
  //     this.placeMarkerAndPanTo(e.latLng, this.map);
  //     const customButton = document.getElementById('custom-button');
  //     // 檢查 customButton 是否為 null
  //     if (customButton) {
  //       customButton.style.display = 'block';
  //
  //       // 設定按鈕位置在地圖中心點的下方
  //       const buttonLeft = (this.map.getDiv().offsetWidth / 2 - 45) + 'px';
  //       const buttonTop = (this.map.getDiv().offsetHeight / 2 + 50) + 'px';
  //
  //       customButton.style.left = buttonLeft;
  //       customButton.style.top = buttonTop;
  //
  //       // 設定 landmarkButt 為 true
  //       this.landmarkButt = true;
  //     }
  //   });
  //
  //   // 監聽地圖的點擊事件
  //   this.map.addListener("click", (e: any) => {
  //     // 清除之前的標記
  //     if (this.previousMarker) {
  //       this.previousMarker.setMap(null);
  //       this.previousMarker.setPosition(null);
  //     }
  //     // 檢查 landmarkButt 是否為 true，如果是就隱藏座標和按鈕
  //     if (this.landmarkButt) {
  //       const customButton = document.getElementById('custom-button');
  //       if (customButton) {
  //         customButton.style.display = 'none';
  //       }
  //       // 將 landmarkButt 設定為 false
  //       this.landmarkButt = false;
  //     }
  //   });
  //
  //   // 監聽地圖的拖動事件
  //   this.map.addListener("drag", () => {
  //     // 清除之前的標記
  //     if (this.previousMarker) {
  //       this.previousMarker.setMap(null);
  //       this.previousMarker.setPosition(null);
  //     }
  //     // 檢查 landmarkButt 是否為 true，如果是就隱藏座標和按鈕
  //     if (this.landmarkButt) {
  //       const customButton = document.getElementById('custom-button');
  //       if (customButton) {
  //         customButton.style.display = 'none';
  //       }
  //       // 將 landmarkButt 設定為 false
  //       this.landmarkButt = false;
  //     }
  //   });
  //
  //   //如果中心點偏移，會回到標記的位置
  //   this.map.addListener("center_changed", () => {
  //     window.setTimeout(() => {
  //       if (this.previousMarker) {
  //         this.map.panTo(this.previousMarker.getPosition() as google.maps.LatLng);
  //       }
  //     }, 0);
  //   });
  // }

  // 處理路徑需花費的時間
  calculatePathTime() {
    this.totalTime = this.snappedCoordinates.length
    console.log('總時間：', this.formatTime(this.totalTime));
  }

  // searchPath() {
  //   this.getAllGpsRequest(this.plate, { filter: { start_time: this.startDate, end_time: this.endDate } })
  //   console.log("開始：", this.startDate, "結束：", this.endDate)
  // }

  plate: any;

  selectCar(event: any) {
    console.log('選取車輛事件:',event)
    this.plate = event;
  }

  transformedData: any[] = []; // 存轉換後

  vehiclesData: any[] = []; // 存轉換後

  // 取得車牌
  getAllVehiclesRequest() {
    this.carServ.getAllVehiclesRequest().subscribe({
      next: res => {
        this.vehiclesData = res.body.vehicles;
        this.cars = this.vehiclesData.map(item => ({
          name: item.license_plate,
          code: item.license_plate
        }));
      },
      error: (err) => {
        console.log('getAllVehiclesRequestError:',err);
      },
    });
  }

  historyPath: any; // 歷史路徑

  // // 取得車輛歷史資料
  // getAllGpsRequest(id: any, body: any) {
  //   this.carServ.getAllGpsRequest(id, body).subscribe({
  //     next: (res) => {
  //       this.products = res.body.gps;
  //       console.log("來源資料:", res.body.gps);
  //
  //       // 根據資料來源新增url, addr, direction
  //       this.transformedData = this.products.map(item => ({
  //         ...item,
  //         lng: item.lon,
  //         url: this.getUrlByDirection(item.heading),
  //         direction: this.parseHeading(item.heading)
  //       }));
  //
  //       // 包裝路徑資料
  //       this.routeCoordinates = this.products.map(item => ({
  //         lat: item.lat,
  //         lng: item.lon
  //       }));
  //
  //       // 將路徑資料顯示在地圖上
  //       this.runSnapToRoad(this.routeCoordinates)
  //
  //       console.log("轉換後資料:", this.transformedData);
  //
  //       this.map.setCenter(this.routeCoordinates[0]);
  //       this.map.setZoom(20);
  //
  //       // 啟動播放鈕
  //       this.playable = false
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   });
  // }

  apiKey = 'AIzaSyB1hde-5CDelK8n5aMiRecPOcl4i_nx0EE';
  snappedCoordinates: google.maps.LatLngLiteral[] = [];

  // runSnapToRoad(path: any[]) {
  //   this.snappedCoordinates = [];
  //   this.snappedAngles = [];
  //
  //   // 移除重複的路徑點
  //   const uniquePath = this.removeDuplicates(path);
  //
  //   // 每個請求最多 100 個點
  //   const maxPointsPerRequest = 100;
  //   const pathValues = uniquePath.map(point => `${point.lat},${point.lng}`);
  //
  //   const segments = [];
  //   for (let i = 0; i < pathValues.length; i += maxPointsPerRequest) {
  //     segments.push(pathValues.slice(i, i + maxPointsPerRequest));
  //   }
  //
  //   for (const segment of segments) {
  //     // Google Road API
  //     const snapToRoadUrl = 'https://roads.googleapis.com/v1/snapToRoads';
  //     const params = {
  //       interpolate: 'true',
  //       key: this.apiKey,
  //       path: segment.join('|')
  //     };
  //
  //     this.http.get(snapToRoadUrl, { params }).subscribe({
  //       next: (data: any) => {
  //         const placeIdArray = [];
  //         for (let i = 0; i < data.snappedPoints.length; i++) {
  //           const coordinate = {
  //             lat: data.snappedPoints[i].location.latitude,
  //             lng: data.snappedPoints[i].location.longitude
  //           };
  //           this.snappedCoordinates.push(coordinate);
  //           placeIdArray.push(data.snappedPoints[i].placeId);
  //         }
  //
  //         // 處理重複的點
  //         this.snappedCoordinates = this.removeDuplicates(this.snappedCoordinates);
  //         // 計算路徑時間
  //         this.calculatePathTime();
  //         // 繪製校正後的折線
  //         this.drawSnappedPolyline(this.snappedCoordinates);
  //         // 計算角度
  //         this.calculateClockwiseAngles(this.snappedCoordinates);
  //
  //         console.log('snap', this.snappedCoordinates);
  //
  //         // Init Car Marker
  //         // 清除先前的車輛
  //         if (this.car !== null) {
  //           this.car.setMap(null);
  //         }
  //
  //         // 車輛 marker
  //         this.car = new google.maps.Marker({
  //           position: this.snappedCoordinates[0],
  //           map: this.map,
  //           icon: {
  //             url: this.snappedAngles[0].url,
  //             scaledSize: new google.maps.Size(50, 50),
  //             anchor: new google.maps.Point(25, 25)
  //           },
  //         });
  //
  //       },
  //       error: error => {
  //         console.error('Error fetching snap-to-road data:', error);
  //       }
  //     });
  //   }
  // }

  removeDuplicates(path: any[]): any[] {
    console.log('Original path:', path);

    const unique: any[] = [];

    path.forEach(point => {
      const exists = unique.some(coordinate => {
        return coordinate.lat === point.lat && coordinate.lng === point.lng;
      });

      if (!exists) {
        unique.push(point);
      }
    });

    console.log('Filtered path:', unique);
    return unique;
  }


  snappedAngles: any[] = [];

  calculateClockwiseAngles(coordinates: { lat: number, lng: number }[]) {
    this.snappedAngles = [];

    for (let i = 0; i < coordinates.length - 1; i++) {
      const point1 = coordinates[i];
      const point2 = coordinates[i + 1];

      // 計算向量
      const vector1 = { x: point1.lng, y: point1.lat };
      const vector2 = { x: point2.lng, y: point2.lat };

      // 計算角度，注意要轉換為弧度
      let angle = Math.atan2(vector2.y - vector1.y, vector2.x - vector1.x);

      // 將弧度轉換為角度，並四捨五入為整數
      angle = Math.round(angle * (180 / Math.PI));

      // 轉為正值並調整為順時針角度
      angle = (360 + 90 - angle) % 360;

      const url = this.getUrlByDirection(angle);

      this.snappedAngles.push({ heading: angle, url: url });
    }

    console.log('snappedAngles:',this.snappedAngles);
  }

  snappedBorder: any
  snappedPolyline: any
  // drawSnappedPolyline(path: any) {
  //   if (this.snappedPolyline) {
  //     this.snappedPolyline.setMap(null);
  //   }
  //
  //   if (this.snappedBorder) {
  //     this.snappedBorder.setMap(null);
  //   }
  //
  //   this.snappedBorder = new google.maps.Polyline({
  //     path: path,
  //     strokeColor: '#0E5763',
  //     strokeWeight: 8,
  //     strokeOpacity: 0.6,
  //   });
  //   this.snappedBorder.setMap(this.map);
  //
  //   this.snappedPolyline = new google.maps.Polyline({
  //     path: path,
  //     strokeColor: '#24DFFF',
  //     strokeWeight: 4,
  //   });
  //   this.snappedPolyline.setMap(this.map);
  // }

  getUrlByDirection(heading: number) {
    let directionUrlMap: { [key: string]: string } = {
      '北': 'assets/car/normal_n.png',
      '東北': 'assets/car/normal_ne.png',
      '東': 'assets/car/normal_e.png',
      '東南': 'assets/car/normal_se.png',
      '南': 'assets/car/normal_s.png',
      '西南': 'assets/car/normal_sw.png',
      '西': 'assets/car/normal_w.png',
      '西北': 'assets/car/normal_nw.png'
    };

    let direction = this.parseHeading(heading);
    return directionUrlMap[direction] || 'assets/image/warehouse.png'; // Default image if direction is unknown
  }

  parseHeading(heading: number) {
    const directions = ['北', '東北', '東', '東南', '南', '西南', '西', '西北', '未知方位'];
    const index = Math.round(((heading % 360) + 360) % 360 / 45) % 8;
    return directions[index];
  }

  //路況圖層開關
  // trafficLayer = new google.maps.TrafficLayer();

  // toggleTraffic() {
  //   if (this.trafficLayer.getMap()) {
  //     // 如果交通圖層已經可見，則隱藏它
  //     this.trafficLayer.setMap(null);
  //   } else {
  //     // 如果交通圖層未可見，則顯示它
  //     this.trafficLayer.setMap(this.map);
  //   }
  // }

  // poiMarker = google.maps.LatLngLiteral

  // //新增地標的按鈕
  // addLandMark() {
  //   const svgMarker = {
  //     path: "M19,11v9h-5v-6h-4v6H5v-9H3.6L12,3.4l8.4,7.6H19z",
  //     fillColor: "red",
  //     fillOpacity: 0.8,
  //     strokeWeight: 0,
  //     rotation: 0,
  //     scale: 1,
  //     anchor: new google.maps.Point(0, 20),
  //   };
  //
  //   this.poiMarker = this.previousMarker
  //   // 創建新的標記
  //   const marker = new google.maps.Marker({
  //     position: this.poiMarker.getPosition(),
  //     map: this.map,
  //     animation: google.maps.Animation.DROP,
  //     icon: svgMarker,
  //     // icon: {
  //     //   url: 'assets/image/car2.png',
  //     //   scaledSize: new google.maps.Size(50, 50)
  //     // }
  //   });
  //
  //   this.markDialog = false;
  //   // 清除之前的標記
  //   if (this.previousMarker) {
  //     this.previousMarker.setMap(null);
  //     this.previousMarker.setPosition(null);
  //   }
  //   // 檢查 landmarkButt 是否為 true，如果是就隱藏座標和按鈕
  //   if (this.landmarkButt) {
  //     const customButton = document.getElementById('custom-button');
  //     if (customButton) {
  //       customButton.style.display = 'none';
  //     }
  //     // 將 landmarkButt 設定為 false
  //     this.landmarkButt = false;
  //   }
  // }

  // previousMarker: google.maps.Marker | null = null;

  // // 點擊地圖座標跑至中心
  // placeMarkerAndPanTo(latLng: google.maps.LatLng, map: google.maps.Map) {
  //   // 清除之前的標記
  //   if (this.previousMarker) {
  //     this.previousMarker.setMap(null);
  //   }
  //
  //   // 創建新的標記
  //   const marker = new google.maps.Marker({
  //     position: latLng,
  //     map: map,
  //     animation: google.maps.Animation.DROP,
  //   });
  //
  //   // 設定地圖中心為新位置
  //   map.panTo(latLng);
  //
  //   // 將新標記設為上一個標記
  //   this.previousMarker = marker;
  // }

  addr: any[] = []

  // // 加到addr
  // geocodePositions() {
  //   const geocoder = new google.maps.Geocoder();
  //
  //   this.transformedData.forEach(product => {
  //     const latlng = new google.maps.LatLng(product.lat, product.lng);
  //
  //     geocoder.geocode({ location: latlng }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
  //       if (status === google.maps.GeocoderStatus.OK) {
  //         let addressFound = false;
  //         if (results && results.length > 0) {
  //           for (let i = 0; i < results.length; i++) {
  //             const formattedAddress = results[i].formatted_address;
  //             if (!formattedAddress.match(/\b\w+\+\w+\b/)) {
  //               product.addr = formattedAddress;
  //               addressFound = true;
  //               break; // 找到非 Plus Code 地址後跳出迴圈
  //             }
  //           }
  //         }
  //         if (!addressFound) {
  //           product.addr = '找不到地址';
  //         }
  //       } else {
  //         product.addr = '編碼錯誤';
  //       }
  //     });
  //   });
  // }

  oddTem: number = 1;

  markType: any[] = [
    { name: 'Home', icon: 'pi pi-home', code: 'Home' },
    { name: 'Star', icon: 'pi pi-star-fill', code: 'Star' },
    { name: 'Company', icon: 'pi pi-building', code: 'Company' },
  ];

  startDate: any
  endDate: any
  maxDate = new Date()

  getDefaultDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to 00:00:00.000
    this.startDate = today
    this.endDate = new Date();
  }

  onStartDateChange(event: any) {
    this.startDate = event;
  }

  onEndDateChange(event: any) {
    this.endDate = event;
  }
}
