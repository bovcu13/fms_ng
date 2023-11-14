import { Component, OnInit } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-landmark',
  templateUrl: './landmark.component.html',
  styleUrls: ['./landmark.component.scss']
})
export class LandmarkComponent {

  ngOnInit() {
    this.initMap();
  }

  // 地圖
  map: any
  mapOptions: any
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
  // draw
  drawingManager: any

  // 按下右鍵的地標按鈕顯示
  landmarkButt = false;
  markDialog: boolean = false;

  showMarkDialog() {
    this.markDialog = true;
  }

  initMap() {
    // 定義地圖相關設定
    this.mapOptions = {
      zoom: 8,
      center: this.center,
      restriction: {
        // latLngBounds: this.TAIWAN_BOUNDS,
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
    this.drawingManager.setMap(this.map);

    this.mapLandMarkListener();
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

  markType: any[] = [
    { name: 'Home', icon: 'pi pi-home', code: 'Home' },
    { name: 'Star', icon: 'pi pi-star-fill', code: 'Star' },
    { name: 'Company', icon: 'pi pi-building', code: 'Company' },
  ];

  landMarker = google.maps.LatLngLiteral

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

    this.landMarker = this.previousMarker
    // 創建新的標記
    const marker = new google.maps.Marker({
      position: this.landMarker.getPosition(),
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

  mapLandMarkListener() {
    // 點右鍵生成標記以新增地標
    this.map.addListener("contextmenu", (e: any) => {
      this.placeMarkerAndPanTo(e.latLng, this.map);
      const customButton = document.getElementById('custom-button');
      // 檢查 customButton 是否為 null
      if (customButton) {
        customButton.style.display = 'block';

        // 設定按鈕位置在地圖中心點的下方
        const buttonLeft = (this.map.getDiv().offsetWidth / 2 - 38) + 'px';
        const buttonTop = (this.map.getDiv().offsetHeight / 2 + 55) + 'px';

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
}
