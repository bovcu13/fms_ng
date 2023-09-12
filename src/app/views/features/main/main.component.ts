import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {products} from "../../../shared/data/products";
import {MapInfoWindow, MapMarker} from "@angular/google-maps";
import {interval, Subscription} from 'rxjs';
import {MenuItem} from 'primeng/api'
import {CarService} from "../../../services/car.service";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  @ViewChild(MapInfoWindow, {static: false}) info!: MapInfoWindow
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  @ViewChild('map', {static: false}) map: any;

  //功能列
  items!: MenuItem[];

  //倒數
  countdownSeconds = 30;
  countdownSubscription: Subscription | undefined;

  //起點、終點
  startCoordinate: google.maps.LatLngLiteral = products[0].position;
  endCoordinate: google.maps.LatLngLiteral = products[products.length - 1].position;

  // 定義用來儲存路線座標的變數
  routeCoordinates: google.maps.LatLngLiteral[] = [];

  // 初始化車車的位置為起點位置
  carPosition: google.maps.LatLngLiteral = this.startCoordinate;

  //路徑
  polyPath: google.maps.LatLngLiteral[] = [];
  //路徑樣式
  polyOptions: google.maps.PolylineOptions = {
    strokeColor: '#06b0ff',
    strokeOpacity: 1,
    strokeWeight: 5,
  };

  markers: any[] = []

  products: any[] = products;
  transformedData: any[] = [];
  selectedProduct: any;

  carGroups: any = [
    {name: '車隊(A)', code: 'A'},
    {name: '車隊(B)', code: 'B'},
    {name: '車隊(C)', code: 'C'},
    {name: '車隊(D)', code: 'D'},
  ]
  cars: any = [
    {name: 'A-123', code: 'A'},
    {name: 'B-123', code: 'B'},
    {name: 'C-123', code: 'C'},
    {name: 'D-123', code: 'D'},
  ]

  Select() {
    if (this.selectedProduct) {
      this.center = this.selectedProduct.position;
    }
  }

  //開啟標記標籤的內容
  openInfo(marker: MapMarker, content: string) {
    this.infoContent = content;
    this.info.open(marker)
  }

  constructor(private carServ: CarService) {
  }

  ngOnInit(): void {
    this.getAllGpsRequest('9901CA15');
    this.items = [
      {
        icon: 'pi pi-truck',
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
    // 初始化標記
    this.markers = this.transformedData.map(product => ({
      position: product.position,
      icon: {url: product.url, scaledSize: new google.maps.Size(50, 50)},
      // label: {text: product.label.text},
      // infoWindowContent: product.label.text
    }));
    console.log(this.markers)

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
      icon: {url: 'assets/image/sport-car.png', scaledSize: new google.maps.Size(50, 50)}
    });

    console.log(this.markers)

    //30s更新一次
    this.startMapUpdateTimer();
  }

  // 取得全部車輛狀態
  getAllGpsRequest(id: any) {
    this.carServ.getAllGpsRequest(id).subscribe({
      next: (res) => {
        this.products = res.body.gps;
        console.log(res.body.gps);
        this.transformedData = this.products.map(item => ({
          ...item,
          position: {
            lat: item.lat,
            lng: item.lon
          },
          url: 'assets/image/warehouse.png',
          addr:'',
        }));
        console.log(this.transformedData);
        this.geocodePositions();
      },
      error: (err) => {
        console.log(err);
      },
    });
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

  trafficVisable: boolean = false;

  //開啟或關閉路況
  toggleTraffic() {
    this.trafficVisable = !this.trafficVisable
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
  infoContent: any = ''

  geocodePositions() {
    const geocoder = new google.maps.Geocoder();
    this.transformedData.forEach(product => {
      const latlng = new google.maps.LatLng(product.position.lat, product.position.lng);
      geocoder.geocode({location: latlng}, (results, status) => {
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

  //點擊地圖會在中間
  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = (event.latLng.toJSON());
  }

  display: any

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  oddTem: number = 1;
}
