import { Component, Input, OnInit } from '@angular/core';
import {products} from "../../../shared/data/products";
import {MenuItem} from 'primeng/api'
import {CarService} from "../../../services/car.service";

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

  products: any[] = products;
  selectedProduct: any;

  cols!: Column[];
  _selectedColumns!: Column[];

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
      this.center = this.selectedProduct;
      this.map.setCenter(new google.maps.LatLng(this.center.lat, this.center.lng));
    }
  }


  // 地圖
  map: any
  mapOptions: any
  // 標記
  markers: any[] = []
  // 線條
  poly = google.maps.Polyline;
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


  // 功能列
  items!: MenuItem[];

  // 按下右鍵的地標按鈕顯示
  landmarkButt = false;
  markDialog: boolean = false;

  showMarkDialog() {
    this.markDialog = true;
  }

  constructor(private carServ: CarService) {
  }

  ngOnInit(): void {
    // this.getAllGpsRequest("9901CA15")
    // this.geocodePositions()

    this.colsInit()

    this.itemInit()

    this.mapInit()

    // 建立 Directions Service
    this.createDirectionsService()

    this.getAllNewGpsRequest();

  }

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
      { field: 'state', header: '狀態' },
      { field: 'sid', header: '車牌' },
      { field: 'speed', header: '時速' },
      { field: 'vehicleName', header: '車輛名稱' },
      { field: 'name', header: '姓名' },
      { field: 'addr', header: '地址/地標' },
      { field: 'statusAccumulated', header: '狀態累積' },
      { field: 'departureTime', header: '出車時間' },
      { field: 'drivingTime', header: '開車時間' },
      { field: 'temperature1', header: '溫度1' },
      { field: 'direction', header: '方向' },
      { field: 'returnTime', header: '回傳時間' },
      { field: 'phoneNumber1', header: '手機號碼1' },
      { field: 'phoneNumber2', header: '手機號碼2' }
    ];

    this._selectedColumns = [
      { field: 'state', header: '狀態' },
      { field: 'sid', header: '車牌' },
      { field: 'speed', header: '時速' },
      { field: 'name', header: '姓名' },
      { field: 'addr', header: '地址/地標' },
    ]
  }

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
  }

  mapInit() {
    // 定義地圖相關設定
    this.mapOptions = {
      zoom: 14,
      center: this.center,
      mapTypeControl: true,
      scaleControl: true,
      // dark 模式
      // styles: [
      //   { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      //   { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      //   { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      //   {
      //     featureType: "administrative.locality",
      //     elementType: "labels.text.fill",
      //     stylers: [{ color: "#d59563" }],
      //   },
      //   {
      //     featureType: "poi",
      //     elementType: "labels.text.fill",
      //     stylers: [{ color: "#d59563" }],
      //   },
      //   {
      //     featureType: "poi.park",
      //     elementType: "geometry",
      //     stylers: [{ color: "#263c3f" }],
      //   },
      //   {
      //     featureType: "poi.park",
      //     elementType: "labels.text.fill",
      //     stylers: [{ color: "#6b9a76" }],
      //   },
      //   {
      //     featureType: "road",
      //     elementType: "geometry",
      //     stylers: [{ color: "#38414e" }],
      //   },
      //   {
      //     featureType: "road",
      //     elementType: "geometry.stroke",
      //     stylers: [{ color: "#212a37" }],
      //   },
      //   {
      //     featureType: "road",
      //     elementType: "labels.text.fill",
      //     stylers: [{ color: "#9ca5b3" }],
      //   },
      //   {
      //     featureType: "road.highway",
      //     elementType: "geometry",
      //     stylers: [{ color: "#746855" }],
      //   },
      //   {
      //     featureType: "road.highway",
      //     elementType: "geometry.stroke",
      //     stylers: [{ color: "#1f2835" }],
      //   },
      //   {
      //     featureType: "road.highway",
      //     elementType: "labels.text.fill",
      //     stylers: [{ color: "#f3d19c" }],
      //   },
      //   {
      //     featureType: "transit",
      //     elementType: "geometry",
      //     stylers: [{ color: "#2f3948" }],
      //   },
      //   {
      //     featureType: "transit.station",
      //     elementType: "labels.text.fill",
      //     stylers: [{ color: "#d59563" }],
      //   },
      //   {
      //     featureType: "water",
      //     elementType: "geometry",
      //     stylers: [{ color: "#17263c" }],
      //   },
      //   {
      //     featureType: "water",
      //     elementType: "labels.text.fill",
      //     stylers: [{ color: "#515c6d" }],
      //   },
      //   {
      //     featureType: "water",
      //     elementType: "labels.text.stroke",
      //     stylers: [{ color: "#17263c" }],
      //   },
      // ],
    };

    // 創建地圖實例
    this.map = new google.maps.Map(document.getElementById('map'), this.mapOptions);

    // 預設顯示所有 info window
    for (const location of products) {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(location.position.lat, location.position.lng),
        map: this.map,
        title: location.addr,
        icon: {url: location.url, scaledSize: new google.maps.Size(50, 50)},
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
      this.poly.setMap(null)
      // 迭代並移除所有標記
      for (const marker of this.recordDistances) {
        marker.setMap(null);
      }
      // 清空陣列
      this.recordDistances = [];
    }
  }

  // 建立 Directions Service
  createDirectionsService() {
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
      } else {
        console.error('獲取路線失敗：', status);
      }
    });
  }

  transformedData: any[] = []; // 存轉換後
  locations: { lat: number; lng: number }[] = []; // 存地址

  // 取得即時車輛位置
  getAllNewGpsRequest() {
    this.carServ.getAllNewGpsRequest().subscribe({
      next: res => {
        this.products = res.body.gps;
        console.log(res);
        this.transformedData = this.products.map(item => ({
          ...item,
          url: "assets/image/warehouse.png",
          addr: "",
          infoWindowContent: item.sid,
        }));
        // 轉換成中文地址
        this.geocodePositions();
        console.log(this.transformedData)
        // 預設顯示所有 info window
        for (const location of this.transformedData) {
          //標記
          const marker = new google.maps.Marker({
            position: new google.maps.LatLng(location.lat, location.lng),
            map: this.map,
            title: location.addr,
            icon: { url: location.url, scaledSize: new google.maps.Size(50, 50) },
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
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // 取得全部車輛歷史紀錄
  getAllGpsRequest(id: any) {
    this.carServ.getAllGpsRequest(id).subscribe({
      next: (res) => {
        this.products = res.body.gps;
        console.log("來源資料:", res.body.gps);
        this.transformedData = this.products.map(item => ({
          ...item,
          position: {
            lat: item.lat,
            lng: item.lon
          },
          url: "assets/image/warehouse.png",
          addr: "",
          lng: item.lon,
          infoWindowContent: "9901CA15",
        }));
        console.log("轉換後資料:", this.transformedData);

        // 提取經緯度 創建 locations 數組
        this.locations = this.transformedData.map(item => ({
          lat: item.position.lat,
          lng: item.position.lng
        }));
        // 轉換成中文地址
        this.geocodePositions();
      },
      error: (err) => {
        console.log(err);
      },
    });
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
      icon: {url: 'assets/image/sport-car.png', scaledSize: new google.maps.Size(50, 50)},
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

  addr: any[] = []

  // 加到addr
  geocodePositions() {
    const geocoder = new google.maps.Geocoder();

    this.transformedData.forEach(product => {
      const latlng = new google.maps.LatLng(product.lat, product.lng);
      console.log("latlng " + latlng);
      geocoder.geocode({location: latlng}, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
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

  // 只有lat, lng
  geocodeCoordinates() {
    const geocoder = new google.maps.Geocoder();

    const coordinatesToProcess = this.transformedData.map(item => ({
      lat: item.position.lat,
      lng: item.position.lng
    }));

    coordinatesToProcess.forEach(latlng => {
      geocoder.geocode({location: latlng}, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
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

  // 溫度異常台數
  oddTem: number = 1;

  markType: any[] = [
    {name: 'Home', icon: 'pi pi-home', code: 'Home'},
    {name: 'Star', icon: 'pi pi-star-fill', code: 'Star'},
    {name: 'Company', icon: 'pi pi-building', code: 'Company'},
  ];
}
