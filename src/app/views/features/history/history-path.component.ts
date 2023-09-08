import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { products } from "../../../shared/data/products";

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

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600); // 計算小時數
    const minutes = Math.floor((seconds % 3600) / 60); // 計算分鐘數
    const remainingSeconds = seconds % 60; // 計算剩餘的秒數

    // 格式化時間，確保分鐘和秒數始終有兩位數
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  togglePlay() {
    if (!this.isPlaying) { // false, icon為播放,點下會暫停
      clearInterval(this.intervalId);
      this.pauseCarMovement();
    } else {
      // 如果未播放，則開始播放
      this.intervalId = setInterval(() => {
        this.sliderValue++;
        if (this.sliderValue > this.totalTime) {
          clearInterval(this.intervalId);
          this.isPlaying = false;
        }
      }, 100); // 每秒更新
      // 開始模擬車輛移動
      this.simulateCarMovement(this.routeCoordinates);
    }
    this.isPlaying = !this.isPlaying; // 切換按鈕狀態
  }

  //起點、終點
  startCoordinate: google.maps.LatLngLiteral = products[0].position;
  endCoordinate: google.maps.LatLngLiteral = products[products.length - 1].position;
  // 初始化車車的位置為起點位置
  carPosition: google.maps.LatLngLiteral = {
    lat: this.startCoordinate.lat,
    lng: this.startCoordinate.lng,
  }
  // 定義用來儲存路線座標的變數
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

  constructor(private renderer: Renderer2, private el: ElementRef) {
  }

  ngOnInit(): void {
    this.geocodePositions()
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

    // 定義地圖相關設定
    this.mapOptions = {
      zoom: 14,
      center: this.center,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // 創建地圖實例
    this.map = new google.maps.Map(document.getElementById('map'), this.mapOptions);

    // 資訊窗口
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
        this.map.setZoom(14);
        this.map.setCenter(marker.getPosition() as google.maps.LatLng);
      });

      //可以按兩下
      this.map.addListener("click", (e: any) => {
        this.placeMarkerAndPanTo(e.latLng, this.map);
      });

      // 一開始就顯示資訊窗口
      infowindow.open(this.map, marker);

      this.markers.push(marker);
    }

    // this.geocodePositions()

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
        // 顯示路線
        directionsRenderer.setDirections(result);
        // 獲取總時間
        this.totalTime = result.routes[0].legs.reduce(
          (total, leg) => total + (leg.duration?.value || 0), // 使用可選鏈接運算符處理可能為 undefined 的情況
          0
        );

        console.log('總時間：', this.formatTime(this.totalTime));
      }
    });
  }

  //車輛更新
  carMovementInterval: any; // 存儲車輛定時器ID
  car: google.maps.Marker | null = null; // 存儲車輛標記
  index: number = 0; //記錄位置
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
        this.carPosition = routeCoordinates[this.index];
        this.car?.setPosition(this.carPosition); // 更新車輛位置
        this.index++;
      } else {
        clearInterval(this.carMovementInterval); // 所有座標都跑完，清除定時器
      }
    }, 100); // 每隔1秒更新一次位置
  }

  // 暫停車輛
  pauseCarMovement(): void {
    clearInterval(this.carMovementInterval);
  }

  private previousMarker: google.maps.Marker | null = null;

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

  geocodePositions() {
    const geocoder = new google.maps.Geocoder();

    this.products.forEach(product => {
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

  oddTem: number = 1;
}
