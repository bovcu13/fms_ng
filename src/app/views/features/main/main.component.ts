import { Component, OnInit, ViewChild } from '@angular/core';
import { products } from "../../../shared/data/products";
import { GoogleMap, MapInfoWindow, MapMarker } from "@angular/google-maps";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  startCoordinate: google.maps.LatLngLiteral = products[0].position;
  endCoordinate: google.maps.LatLngLiteral = products[products.length - 1].position;

  polyPath: google.maps.LatLngLiteral[] = [
    // this.startCoordinate, // 起點
    // this.endCoordinate, // 終點
    // { lat: 25.03280092118552, lng: 121.56348748779168 },// 起點：大安森林公園座標
    // { lat: 25.033452, lng:121.537594 },
    // { lat: 25.033681, lng:121.537606 },
    // { lat: 25.035251, lng:121.537610 },
    // { lat: 25.035475, lng:121.537576 },
    // { lat: 25.036092, lng:121.537452 },
    // { lat: 25.037408, lng:121.537468},
    // { lat: 25.037678, lng:121.537619 },
    // { lat: 25.038073, lng:121.537686 },
    // { lat: 25.048409, lng:121.536962 },
    // { lat: 25.048256, lng:121.543976 },
    // { lat: 25.048248, lng:121.546305 },
    // { lat: 25.048235, lng:121.546427 },
    // { lat: 25.048224, lng:121.547455 },
    // { lat: 25.048218, lng:121.547911 },
    // { lat: 25.048213, lng:121.548015 },
    // { lat: 25.048207, lng:121.553280 },
    // { lat: 25.048051, lng:121.556256 },
    // { lat: 25.048206, lng:121.557830},
    // { lat: 25.048696, lng:121.562705},
    // { lat: 25.049510, lng:121.569585},
    // { lat: 25.049749, lng:121.570170},
    // { lat: 25.049832, lng:121.570544},
    // { lat: 25.049889, lng:121.571996},
    // { lat: 25.049979, lng:121.572141},
    // { lat: 25.05011611459548, lng:121.57765111609234},
    // { lat: 25.050229, lng:121.577709},
    // { lat: 25.050580, lng:121.577659},
    // { lat: 25.050779, lng:121.577647},
    // { lat: 25.050862, lng:121.577665},
    // { lat: 25.050928, lng:121.577690}, // 終點：饒河街觀光夜市座標
  ];
  carPosition: google.maps.LatLngLiteral = this.startCoordinate; // 初始化為起點位置

  polyOptions: google.maps.PolylineOptions = {
    strokeColor: '#40809d',
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

    // 設定起點、終點和中途站點（產品座標）
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
        const routeCoordinates: google.maps.LatLngLiteral[] = result!.routes[0].overview_path.map(
          (latLng: google.maps.LatLng) => ({
            lat: latLng.lat(),
            lng: latLng.lng()
          })
        );
        // 更新 polyPath 以顯示實際路線
        this.polyPath = routeCoordinates;
        // 開始模擬車輛移動
        this.simulateCarMovement(routeCoordinates);
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
  }

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
    lat: 25.0336962,
    lng: 121.5643673
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
