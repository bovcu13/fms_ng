import { Component, Input, OnInit, signal } from '@angular/core';
import { products } from "../../../shared/data/products";
import { MenuItem } from 'primeng/api'
import { CarService } from "../../../services/car.service";

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
    { name: '車隊(A)', code: 'A' },
    { name: '車隊(B)', code: 'B' },
    { name: '車隊(C)', code: 'C' },
    { name: '車隊(D)', code: 'D' },
  ]
  cars: any

  Select() {
    if (this.selectedProduct) {
      this.center = this.selectedProduct;
      this.map.setCenter(new google.maps.LatLng(this.center.lat, this.center.lng));
      this.map.setZoom(20);
    }
  }


  // 地圖
  map: any
  mapOptions: any
  // 標記
  markers: google.maps.Marker[] = [];
  // 線條
  poly = google.maps.Polyline;

  //初始地圖地點
  center: google.maps.LatLngLiteral = {
    lat: 23.83876,
    lng: 120.9876
  };


  // 功能列
  items!: MenuItem[];

  // 按下右鍵的地標按鈕顯示
  landmarkButt = false;
  markDialog: boolean = false;

  showMarkDialog() {
    this.markDialog = true;
  }

  // 溫度異常台數
  oddTem: number = 1;

  markType: any[] = [
    { name: 'Home', icon: 'pi pi-home', code: 'Home' },
    { name: 'Star', icon: 'pi pi-star-fill', code: 'Star' },
    { name: 'Company', icon: 'pi pi-building', code: 'Company' },
  ];

  constructor(private carServ: CarService) {
  }

  ngOnInit() {
    this.colsInit();
    this.itemInit();
    this.mapInit();
    this.getDefaultStartDate();
    this.getDefaultEndDate();

    this.getAllNewGpsRequest();

    // 每5秒get
    setInterval(() => {
      this.getAll20s();
    }, 5000);

    // 監聽陣列的變化
    this.dataSignal.subscribe((value: any) => {
      this.onDataChange();
    });
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
      { field: 'license_plate', header: '車牌' },
      { field: 'speed', header: '時速' },
      { field: 'vehicle_name', header: '車輛名稱' },
      { field: 'driver', header: '姓名' },
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
      { field: 'license_plate', header: '車牌' },
      { field: 'speed', header: '時速' },
      { field: 'driver', header: '姓名' },
      { field: 'direction', header: '方向' },
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

  mapInit() {
    // 定義地圖相關設定
    this.mapOptions = {
      zoom: 8,
      center: this.center,
    };

    // 創建地圖實例
    this.map = new google.maps.Map(document.getElementById('map'), this.mapOptions);

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
      // icon: svgMarker,
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

  startDate: any

  getDefaultStartDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to 00:00:00.000
    this.startDate = today
  }

  endDate: any

  getDefaultEndDate() {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to 23:59:59.999
    this.endDate = today
  }

  transformedData: any[] = []; // 存轉換後api資料

  // 使用 Signal 包裝 data 陣列
  dataSignal:any = signal<any[]>([]);

  onDataChange() {
    // 計算新增的資料
    const addedData = this.dataSignal.value.diff(this.transformedData);

    // 更新這些資料
    this.transformedData = this.transformedData.concat(addedData);
  }

  // init - 取得All車輛即時位置
  getAllNewGpsRequest() {
    this.carServ.getAllNewGpsRequest().subscribe({
      next: res => {
        this.products = res.body.gps;
        console.log("來源資料:", res);
        this.transformedData = this.products.map(item => ({
          ...item,
          url: this.getUrlByDirection(item.heading),
          addr: "",
          infoWindowContent: item.license_plate +''+ item.driver,
          direction: this.parseHeading(item.heading)
        }));
        this.cars = this.products.map(item => ({
          name: item.license_plate,
          code: item.license_plate
        }));
        // 轉換成中文地址
        this.geocodePositions();
        console.log("轉換後資料:", this.transformedData)

        if (this.transformedData.length > 0) {
          console.log("執行", this.transformedData)
          if (this.markers !== null) {
            for (const marker of this.markers) {
              marker.setMap(null);
              marker.setPosition(null);
            }
            this.markers = []
          }
          // 預設顯示所有 info window
          for (const location of this.transformedData) {
            //標記
            const marker = new google.maps.Marker({
              position: new google.maps.LatLng(location.lat, location.lng),
              map: this.map,
              title: location.addr,
              icon: { url: location.url, scaledSize: new google.maps.Size(75, 75) },
              center: this.center
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
            const infowindow = new google.maps.InfoWindow({
              content: content,
            });

            // 一開始就顯示資訊窗口
            infowindow.open(this.map, marker);

            this.markers.push(marker);

            // 點擊標記顯示info, 設定中心點
            google.maps.event.addListener(marker, 'click', () => {
              infowindow.open(this.map, marker);
              this.map.setZoom(20);
              this.map.setCenter(marker.getPosition() as google.maps.LatLng);
            });
          }
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }


  // 20s取得All車輛即時位置
  getAll20s() {
    this.carServ.getAllNewGpsRequest().subscribe({
      next: res => {
        this.products = res.body.gps;
        this.transformedData = this.products.map(item => ({
          ...item,
          url: this.getUrlByDirection(item.heading),
          addr: "",
          infoWindowContent: item.license_plate + item.driver,
          direction: this.parseHeading(item.heading)
        }));
        this.cars = this.products.map(item => ({
          name: item.license_plate,
          code: item.license_plate
        }));
        // 轉換成中文地址
        this.geocodePositions();

        if (this.transformedData.length > 0) {
          if (this.markers !== null) {
            for (const marker of this.markers) {
              marker.setMap(null);
              marker.setPosition(null);
            }
            this.markers = []
          }
          // 預設顯示所有 info window
          for (const location of this.transformedData) {
            //標記
            const marker = new google.maps.Marker({
              position: new google.maps.LatLng(location.lat, location.lng),
              map: this.map,
              title: location.addr,
              icon: { url: location.url, scaledSize: new google.maps.Size(60, 60) },
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
            const infowindow = new google.maps.InfoWindow({
              content: content,
            });

            // 一開始就顯示資訊窗口
            infowindow.open(this.map, marker);

            this.markers.push(marker);

            // 點擊標記顯示info, 設定中心點
            google.maps.event.addListener(marker, 'click', () => {
              infowindow.open(this.map, marker);
              this.map.setZoom(17);
              this.map.setCenter(marker.getPosition() as google.maps.LatLng);
            });
          }
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

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
    if ((heading >= 0 && heading < 22.5) || (heading >= 337.5 && heading <= 360)) {
      return '北';
    } else if (heading >= 22.5 && heading < 67.5) {
      return '東北';
    } else if (heading >= 67.5 && heading < 112.5) {
      return '東';
    } else if (heading >= 112.5 && heading < 157.5) {
      return '東南';
    } else if (heading >= 157.5 && heading < 202.5) {
      return '南';
    } else if (heading >= 202.5 && heading < 247.5) {
      return '西南';
    } else if (heading >= 247.5 && heading < 292.5) {
      return '西';
    } else if (heading >= 292.5 && heading < 337.5) {
      return '西北';
    } else {
      return '未知方位';
    }
  }

  // 取得全部車輛歷史紀錄
  // getAllGpsRequest(id: any) {
  //   this.carServ.getAllGpsRequest(id).subscribe({
  //     next: (res) => {
  //       this.products = res.body.gps;
  //       console.log("來源資料:", res.body.gps);
  //       this.transformedData = this.products.map(item => ({
  //         ...item,
  //         url: "assets/image/warehouse.png",
  //         addr: "",
  //         infoWindowContent: item.sid,
  //       }));
  //       // 轉換成中文地址
  //       this.geocodePositions();
  //       console.log("轉換後資料:", this.transformedData);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   });
  // }
}
