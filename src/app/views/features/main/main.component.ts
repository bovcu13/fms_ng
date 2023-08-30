import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { products } from "../../../shared/data/products";
import { GoogleMap, MapInfoWindow, MapMarker } from "@angular/google-maps";
import { Subscription, interval } from 'rxjs';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit,OnDestroy {
  countdownSeconds = 30;
  countdownSubscription: Subscription | undefined;

  startCoordinate: google.maps.LatLngLiteral = products[0].position;
  endCoordinate: google.maps.LatLngLiteral = products[products.length - 1].position;
  // 定義用來儲存路線座標的變數
  routeCoordinates: google.maps.LatLngLiteral[] = [];

  polyPath: google.maps.LatLngLiteral[] = [];
  carPosition: google.maps.LatLngLiteral = this.startCoordinate; // 初始化為起點位置

  polyOptions: google.maps.PolylineOptions = {
    strokeColor: '#06b0ff',
    strokeOpacity: 1,
    strokeWeight: 5,
    // icons: [
    //   {
    //     icon: {
    //       path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    //     },
    //     offset: '100%',
    //   },
    // ],
  };
  @ViewChild(MapInfoWindow, { static: false }) info!: MapInfoWindow
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  products: any = products;
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
  markers: any[] = []

  Select() {
    if (this.selectedProduct) {
      this.center = this.selectedProduct.position;
    }
  }

  ngOnInit(): void {
    // 初始化標記
    this.markers = products.map(product => ({
      position: product.position,
      icon: { url: product.url, scaledSize: new google.maps.Size(50, 50) },
      label: { text: product.label.text }
    }));

    // 建立 Directions Service
    const directionsService = new google.maps.DirectionsService();

    // 設定起點、終點和中途站點
    const waypoints: google.maps.DirectionsWaypoint[] = products.map(product => ({
      location: new google.maps.LatLng(product.position.lat, product.position.lng),
      stopover: true
    }));

    // 設定 Directions Request
    const request: google.maps.DirectionsRequest = {
      origin: this.startCoordinate,
      destination: this.endCoordinate,
      waypoints: waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    // 發送 Directions Request
    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        // 取得路線資料
        this.routeCoordinates = result!.routes[0].overview_path.map(
          (latLng: google.maps.LatLng) => ({
            lat: latLng.lat(),
            lng: latLng.lng()
          })
        );
        // 更新 polyPath 以顯示實際路線
        this.polyPath = this.routeCoordinates;
        // 開始模擬車輛移動
        this.simulateCarMovement(this.routeCoordinates);
      }
    });


    // 初始化車輛標記
    this.markers.push({
      position: this.carPosition,
      icon: { url: 'assets/image/sport-car.png', scaledSize: new google.maps.Size(50, 50) }
    });

    // this.http.get('https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js').subscribe({
    //   next: res => {
    //     console.log(res)
    //   },
    //   error: error => {
    //     console.log(error);
    //   }
    // });

    // this.markers = products.map(product => ({
    //   position: { lat: product.position.lat, lng: product.position.lng }, // 假設 products 有經緯度資訊
    //   title: product.label.text, // 使用產品名稱作為標記/標題
    //   icon: { url: product.url, scaledSize: new google.maps.Size(50, 50) },
    //   label: { text: product.label.text } // 使用產品描述作為標記標籤內容
    // }));

    // this.markers = [
    // new google.maps.Polygon({paths: [
    //     {lat: 25.0339, lng: 121.5774}, {lat: 25.0335, lng: 121.5764}, {lat: 25.0328, lng: 121.5769}, {lat: 25.0332, lng: 121.5780}
    //   ], strokeOpacity: 0.5, strokeWeight: 1, fillColor: '#1976D2', fillOpacity: 0.35
    // }),
    // new google.maps.Circle({center: {lat: 25.03396, lng: 121.56446}, fillColor: '#1976D2', fillOpacity: 0.35, strokeWeight: 1, radius: 1500}),
    // new google.maps.Polyline({path: [{lat: 25.03421, lng: 121.57612}, {lat: 25.03351, lng: 121.58693}], geodesic: true, strokeColor: '#FF0000', strokeOpacity: 0.5, strokeWeight: 2})
    // ];

    console.log(this.markers)

    //30s更新一次
    this.startMapUpdateTimer();
  }

  startMapUpdateTimer(): void {
    this.updateMap(); // 第一次更新地圖
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.countdownSeconds--;
      if (this.countdownSeconds === 0) {
        this.countdownSeconds = 30;
        this.updateMap(); // 每30秒更新地圖
      }
    });
  }

  updateMap(): void {
    // 更新地圖的程式碼，包括模擬車輛位置等

    // 模擬車輛每一秒更新一次位置
  }

  ngOnDestroy(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  //車輛更新
  simulateCarMovement(routeCoordinates: google.maps.LatLngLiteral[]): void {
    let index = 0;

    setInterval(() => {
      if (index < routeCoordinates.length) {
        this.carPosition = routeCoordinates[index];
        this.markers[this.markers.length - 1].position = this.carPosition; // 更新車輛標記位置
        index++;
      }
    }, 1000); // 每隔1秒更新一次位置
  }


  //初始地圖地點
  center: google.maps.LatLngLiteral = {
    lat: 25.11450302362639,
    lng: 121.5222738032652
  };
  options: google.maps.MapOptions = {
    //google map提供的放大縮小
    zoomControl: true,
    //按ctrl是否可以放大縮小
    scrollwheel: true,
    //點兩下地圖是否可以放大縮小
    disableDoubleClickZoom: true,
    mapTypeId: 'terrain',
    maxZoom: 18,
    minZoom: 12,
  }
  zoom = 15;
  infoContent = ''

  //開啟標記標籤的內容
  openInfo(marker: MapMarker, content: string) {
    this.infoContent = content;
    this.info.open(marker)
  }

  //點擊地圖會在中間
  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = (event.latLng.toJSON());
  }

  display: any

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }
}
