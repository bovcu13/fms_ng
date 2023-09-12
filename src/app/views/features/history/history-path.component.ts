import { Component, OnInit } from '@angular/core';
import { products } from "../../../shared/data/products";
import { MenuItem } from 'primeng/api'
import { CarService } from "../../../services/car.service";

declare var google: any;

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

  togglePlay() {
    // if (!this.isPlaying) { // false, icon為播放,點下會暫停
    //   clearInterval(this.intervalId);
    //   this.pauseCarMovement();
    // } else {
    //   // 如果未播放，則開始播放
    //   this.intervalId = setInterval(() => {
    //     this.sliderValue++;
    //     if (this.sliderValue > this.totalTime) {
    //       clearInterval(this.intervalId);
    //       this.isPlaying = false;
    //     }
    //   }, 1000); // 每秒更新
    //   // 開始模擬車輛移動
    //   this.simulateCarMovement(this.routeCoordinates);
    // }
    // this.isPlaying = !this.isPlaying; // 切換按鈕狀態
    if (!this.isPlaying) {
      clearInterval(this.intervalId);
      this.pauseCarMovement();
    } else {
      // 計算新的間隔時間以達到所選的速率
      const newInterval = 1000 / this.speedRate;

      this.intervalId = setInterval(() => {
        this.sliderValue++;
        if (this.sliderValue > this.totalTime) {
          clearInterval(this.intervalId);
          this.isPlaying = false;
        }
      }, newInterval);

      this.simulateCarMovement(this.routeCoordinates);
    }
    this.isPlaying = !this.isPlaying;
  }

  speedRate: number = 1;
  changeSpeed() {
    // 切換速率
    switch (this.speedRate) {
      case 1:
        this.speedRate = 2;
        break;
      case 2:
        this.speedRate = 5;
        break;
      case 5:
        this.speedRate = 10;
        break;
      case 10:
        this.speedRate = 0.5;
        break;
      case 0.5:
        this.speedRate = 1;
        break;
      default:
        this.speedRate = 1;
        break;
    }
    if (!this.isPlaying) {
      clearInterval(this.intervalId);
      const newInterval = 1000 / this.speedRate;
      this.intervalId = setInterval(() => {
        this.sliderValue++;
        if (this.sliderValue > this.totalTime) {
          clearInterval(this.intervalId);
          this.isPlaying = false;
        }
      }, newInterval);
    }
  }

  onSliderChange(event: any) {
    // 清除之前的車輛標記
    if (this.car !== null) {
      this.car.setMap(null);
    }
    this.index = event.value;
    this.carPosition = this.routeCoordinates[this.index];
    this.car?.setPosition(this.carPosition); // 更新車輛位置
    // 建立新的車輛圖示
    this.car = new google.maps.Marker({
      position: this.carPosition,
      map: this.map,
      icon: { url: 'assets/image/sport-car.png', scaledSize: new google.maps.Size(50, 50) },
    });
  }

  //起點、終點
  startCoordinate: google.maps.LatLngLiteral = products[0].position;
  endCoordinate: google.maps.LatLngLiteral = products[products.length - 1].position;
  // 初始化車車的位置為起點位置
  carPosition: google.maps.LatLngLiteral = {
    lat: this.startCoordinate.lat,
    lng: this.startCoordinate.lng,
  }
  // 用來儲存路線座標的變數
  routeCoordinates: google.maps.LatLngLiteral[] = [];

  //初始地圖地點
  center: google.maps.LatLngLiteral = {
    lat: 25.11450302362639,
    lng: 121.5222738032652
  };

  // 創建標記
  markers: any[] = []

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

  constructor(private carServ: CarService) {
  }

  ngOnInit(): void {
    this.getAllGpsRequest("9901CA15")
    // this.geocodePositions()
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
        icon: 'pi pi-refresh',
        command: () => {
        }
      },
      {
        icon: 'pi pi-trash',
        command: () => {
        }
      }
    ];
    // // 創建標記
    // this.markers = products.map((location) => {
    //   const marker = {
    //     position: new google.maps.LatLng(location.position.lat, location.position.lng),
    //     title: location.addr,
    //     icon: { url: location.url, scaledSize: new google.maps.Size(50, 50) },
    //     infoWindowText: location.infoWindowContent, // info window 內容
    //     infoWindowOptions: { maxWidth: 200 }, // info window 選項
    //   };
    //
    //   return marker;
    // });

    this.mapInit()

    //建立點的按鈕 -> 右鍵生成地標
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

        // 此處可以為按鈕添加點擊事件處理程序，執行相應的操作
      }
    });

    // 監聽地圖的點擊事件
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

    // 監聽地圖的拖動事件
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

    //如果中心點偏移，會回到標記的位置
    this.map.addListener("center_changed", () => {
        window.setTimeout(() => {
          if (this.previousMarker) {
            this.map.panTo(this.previousMarker.getPosition() as google.maps.LatLng);
          }
        }, 0);

    });

    // 建立 Directions Service
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer(
      {
        suppressMarkers: true
      });

    // 添加到 map
    directionsRenderer.setMap(this.map);

    // 設定起點、終點和中途站點
    const waypoints: google.maps.DirectionsWaypoint[] = products.map(product => ({
      location: new google.maps.LatLng(product.position.lat, product.position.lng),
      stopover: true,
    }));

    // 設定 Directions Request
    const request = {
      origin: this.startCoordinate, // 起點
      destination: this.endCoordinate, // 終點
      waypoints: waypoints, // 中間站
      travelMode: google.maps.TravelMode.DRIVING, // 導航方式
    };

    // 發送 Directions Request
    directionsService.route(request, (result: google.maps.DirectionsResult, status: google.maps.DirectionsStatus) => {
      if (status === google.maps.DirectionsStatus.OK) {
        // 取得路線資料
        this.routeCoordinates = result!.routes[0].overview_path.map(
          (latLng: google.maps.LatLng) => ({
            lat: latLng.lat(),
            lng: latLng.lng()
          })
        );

        // 處理路線座標
        // this.geocodeCoordinates();
        console.log("轉換地址:",this.addr)

        // 顯示路線
        directionsRenderer.setDirections(result);
        // 獲取總時間
        // this.totalTime = result.routes[0].legs.reduce(
        //   (total, leg) => total + (leg.duration?.value || 0), // 使用可選鏈接運算符處理可能為 undefined 的情況
        //   0
        // );
        this.totalTime = this.routeCoordinates.length
        console.log('總時間：', this.formatTime(this.totalTime));
      } else {
        console.error('獲取路線失敗：', status);
      }
    });
  }

  mapInit() {
    // 定義地圖相關設定
    this.mapOptions = {
      zoom: 14,
      center: this.center,
      mapTypeControl: true,
      scaleControl: true,
    };

    // 創建地圖實例
    this.map = new google.maps.Map(document.getElementById('map'), this.mapOptions);

    // 預設顯示所有 info window
    for (const location of products) {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(location.position.lat, location.position.lng),
        map: this.map,
        title: location.addr,
        icon: { url: location.url, scaledSize: new google.maps.Size(50, 50) },
        // options: { animation: google.maps.Animation.BOUNCE },
      });

      const infowindow = new google.maps.InfoWindow({
        content: location.infoWindowContent
      });

      //開info
      google.maps.event.addListener(marker, 'click', () => {
        infowindow.open(this.map, marker);
        // this.map.setZoom(14);
        // this.map.setCenter(marker.getPosition() as google.maps.LatLng);
      });

      // 一開始就顯示資訊窗口
      infowindow.open(this.map, marker);

      this.markers.push(marker);
    }
  }

  transformedData: any[] = []; // 存轉換後
  locations: { lat: number; lng: number }[] = []; // 存地址
  // 取得全部車輛狀態
  getAllGpsRequest(id: any) {
    this.carServ.getAllGpsRequest(id).subscribe({
      next: (res) => {
        this.products = res.body.gps;
        console.log("來源資料:",res.body.gps);
        this.transformedData = this.products.map(item => ({
          ...item,
          position: {
            lat: item.lat,
            lng: item.lon
          },
          url: "assets/image/warehouse.png",
          addr:"",
          lng: item.lon
        }));
        console.log("轉換後資料:",this.transformedData);

        // 提取經緯度 創建 locations 數組
        this.locations = this.transformedData.map(item => ({
          lat: item.position.lat,
          lng: item.position.lng
        }));
        // 轉換成中文地址
        this.geocodePositions();

        //標記
        for (const location of this.transformedData) {
          const marker = new google.maps.Marker({
            position: new google.maps.LatLng(location.position.lat, location.position.lng),
            map: this.map,
            title: location.addr,
            // icon: { url: location.url, scaledSize: new google.maps.Size(50, 50) },
          });
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  //路況圖層開關
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

  //車車
  carMovementInterval: any; // 車車定時器ID
  car: google.maps.Marker | null = null; // 車輛標記
  index: number = 0; //記錄位置
  //車輛更新
  simulateCarMovement(routeCoordinates: google.maps.LatLngLiteral[]): void {
    // 清除之前的車輛標記
    if (this.car !== null) {
      this.car.setMap(null);
    }
    // 建立新的車輛圖示
    this.car = new google.maps.Marker({
      position: this.carPosition,
      map: this.map,
      icon: { url: 'assets/image/sport-car.png', scaledSize: new google.maps.Size(50, 50) },
    });
    //車輛移動
    this.carMovementInterval = setInterval(() => {
      if (this.index < routeCoordinates.length) {
        console.log(this.index)
        this.carPosition = routeCoordinates[this.index];
        this.car?.setPosition(this.carPosition); // 更新車輛位置
        this.index++;
      } else {
        clearInterval(this.carMovementInterval); // 所有座標都跑完，清除定時器
      }
    }, 1000); // 每隔1秒更新一次位置
  }

  // 暫停車輛
  pauseCarMovement(): void {
    clearInterval(this.carMovementInterval);
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
      animation: google.maps.Animation.DROP,
      icon: svgMarker,
      // icon: {
      //   url: 'assets/image/car2.png',
      //   scaledSize: new google.maps.Size(50, 50)
      // }
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
      animation: google.maps.Animation.DROP,
    });

    // 設定地圖中心為新位置
    map.panTo(latLng);

    // 將新標記設為上一個標記
    this.previousMarker = marker;
  }

  products: any[] = products;
  selectedProduct: any;

  carGroups: any = [
    { name: '車隊(A)', code: 'A' },
    { name: '車隊(B)', code: 'B' },
    { name: '車隊(C)', code: 'C' },
    { name: '車隊(D)', code: 'D' },
  ]
  cars: any = [
    { name: 'A-123', code: 'A' },
    { name: 'B-123', code: 'B' },
    { name: 'C-123', code: 'C' },
    { name: 'D-123', code: 'D' },
  ]

  Select() {
    if (this.selectedProduct) {
      this.center = this.selectedProduct.position;
      this.map.setCenter(new google.maps.LatLng(this.center.lat, this.center.lng));
    }
  }

  // geocodePositions(data: any[], callback: (data: any) => void) {
  //   const geocoder = new google.maps.Geocoder();
  //
  //   data.forEach(item => {
  //     let lat, lng;
  //     if (item.position) {
  //       lat = item.position.lat;
  //       lng = item.position.lng;
  //     } else if (item.lat && item.lng) {
  //       lat = item.lat;
  //       lng = item.lng;
  //     } else {
  //       item.addr = '缺少位置資訊';
  //       callback(item);
  //       return;
  //     }
  //
  //     const latlng = new google.maps.LatLng(lat, lng);
  //
  //     geocoder.geocode({ location: latlng }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
  //       if (status === google.maps.GeocoderStatus.OK) {
  //         let addressFound = false;
  //         if (results && results.length > 0) {
  //           for (let i = 0; i < results.length; i++) {
  //             const formattedAddress = results[i].formatted_address;
  //             if (!formattedAddress.match(/\b\w+\+\w+\b/)) {
  //               item.addr = formattedAddress;
  //               addressFound = true;
  //               break;
  //             }
  //           }
  //         }
  //         if (!addressFound) {
  //           item.addr = '找不到地址';
  //         }
  //       } else {
  //         item.addr = '編碼錯誤';
  //       }
  //       callback(item);
  //     });
  //   });
  // }

  // 加到addr
  geocodePositions() {
    const geocoder = new google.maps.Geocoder();

    this.transformedData.forEach(product => {
      const latlng = new google.maps.LatLng(product.position.lat, product.position.lng);

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

  addr: any[] = []

  // 只有lat, lng
  geocodeCoordinates() {
    const geocoder = new google.maps.Geocoder();

    const coordinatesToProcess = this.locations;

    coordinatesToProcess.forEach(latlng => {
      geocoder.geocode({ location: latlng }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            const address = results[0].formatted_address;
            this.addr.push(address)
          } else {
            console.error('找不到地址');
          }
        } else {
          console.error('地理編碼失敗，錯誤代碼：', status);
        }
      });
    });
  }

  oddTem: number = 1;

  markType: any[] = [
    { name: 'Home', icon: 'pi pi-home', code: 'Home' },
    { name: 'Star', icon: 'pi pi-star-fill', code: 'Star' },
    { name: 'Company', icon: 'pi pi-building', code: 'Company' },
  ];
}
