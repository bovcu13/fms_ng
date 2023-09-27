import { Component, OnInit } from '@angular/core';
import { MenuItem } from "primeng/api";
import { CarService } from "../../../../services/car.service";
import { products } from "../../../../shared/data/products";

declare var google: any;

@Component({
  selector: 'app-poly',
  templateUrl: './poly.component.html',
  styleUrls: ['./poly.component.scss']
})
export class PolyComponent implements OnInit {
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

  togglePlay() {
    if (!this.isPlaying) {

    } else {

    }
    this.isPlaying = !this.isPlaying;
  }

  products: any[] = products;
  selectedProduct: any;

  carGroups: any = [
    { name: '車隊(A)', code: 'A' },
    { name: '車隊(B)', code: 'B' },
    { name: '車隊(C)', code: 'C' },
    { name: '車隊(D)', code: 'D' },
  ]

  cars: any[] = [];

  Select() {
    if (this.selectedProduct) {
      console.log(this.selectedProduct)
      this.center = this.selectedProduct;
      this.map.setCenter(new google.maps.LatLng(this.center.lat, this.center.lng));
    }
  }

  car: google.maps.Marker[] = []

  // 用來儲存路線座標的變數
  routeCoordinates: google.maps.LatLngLiteral[] = [];

  //初始地圖地點 ->在南投
  center: google.maps.LatLngLiteral = {
    lat: 23.83876,
    lng: 120.9876
  };

  // 初始化車的位置為起點位置
  carPosition: google.maps.LatLngLiteral = this.routeCoordinates[0];

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

    this.itemInit()

    this.mapInit()

    this.getAllVehiclesRequest()

    this.getDefaultDate()
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
      center: this.center
    };

    // 創建地圖實例
    this.map = new google.maps.Map(document.getElementById('map'), this.mapOptions);

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
  }

  // 處理路徑需花費的時間
  calculatePathTime() {
    this.totalTime = this.routeCoordinates.length
    console.log('總時間：', this.formatTime(this.totalTime));
  }

  searchPath() {
    this.getAllGpsRequest("AA0000", { filter: { start_time: this.startDate, end_time: this.endDate } })
    console.log("開始：", this.startDate, "結束：", this.endDate)
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
        console.log(err);
      },
    });
  }

  historyPath: any; // 歷史路徑

  // 取得車輛歷史資料
  getAllGpsRequest(id: any, body: any) {
    this.carServ.getAllGpsRequest(id, body).subscribe({
      next: (res) => {
        this.products = res.body.gps;
        console.log("來源資料:", res.body.gps);
        this.transformedData = this.products.map(item => ({
          ...item,
          url: this.getUrlByDirection(item.heading),
          addr: "",
          direction: this.parseHeading(item.heading)
        }));
        // 單獨取得路徑
        this.routeCoordinates = this.products.map(item => ({
          lat: item.lat,
          lng: item.lng
        }));
        // 計算路徑時間
        this.calculatePathTime()

        console.log("轉換後資料:", this.transformedData);

        // 轉換成中文地址
        this.geocodePositions();


        const lineSymbol = {
          path: this.transformedData[0].url,
          scale: 8,
        };

        // 清除先前的路徑
        if (this.historyPath) {
          this.historyPath.setMap(null);
        }
        // 顯示路徑
        this.historyPath = new google.maps.Polyline({
          path: this.routeCoordinates,
          geodesic: true,
          strokeColor: "#77428D",
          strokeOpacity: 1.0,
          strokeWeight: 5,

          // icons: [
          //   {
          //     icon: lineSymbol,
          //     offset: "100%",
          //   }
          // ]
        });
        this.historyPath.setMap(this.map);

        // 创建虚拟标记，并将其添加到地图上
        const virtualMarker = new google.maps.Marker({
          icon: {
            url: this.transformedData[0].url, // 标记的图标路径
            scaledSize: new google.maps.Size(50, 50) // 标记图标的大小
          },
          position: this.routeCoordinates[0],
          map: this.map
        });

        // 初始化变量
        let index = 0;
        let progress = 0;
        const totalFrames = 100; // 总帧数
        const frameDuration = 2000 / totalFrames; // 每帧持续时间

        // 计算每帧移动的步长
        const step = 1 / totalFrames;

        const animateMarker = () => {
          progress += step;
          if (progress < 1) {
            const newPosition = google.maps.geometry.spherical.interpolate(
              this.routeCoordinates[index],
              this.routeCoordinates[index + 1],
              progress
            );
            virtualMarker.setPosition(newPosition);
          } else {
            // Move to the next segment of the route
            index++;
            if (index < this.routeCoordinates.length - 1) {
              progress = 0;
            } else {
              clearInterval(markerMovementInterval);
            }
          }
        };

        // 然后，使用 setInterval 定时器来模拟标记在折线上的流畅移动
        const markerMovementInterval = setInterval(animateMarker, frameDuration);

        // 啟動播放鈕
        this.playable = false
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  animateMarkers(line: google.maps.Polyline) {
    let count = 0;

    window.setInterval(() => {
      count = (count + 1) % 200;

      const icons = line.get("icons");

      icons[0].offset = count / 2 + "%";
      line.set("icons", icons);
    }, 20);
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
