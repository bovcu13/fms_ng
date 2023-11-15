import { Component, OnInit } from '@angular/core';
import { landmark } from "../../../../shared/data/landmark";

declare var google: any;

@Component({
  selector: 'app-landmark',
  templateUrl: './landmark.component.html',
  styleUrls: ['./landmark.component.scss']
})
export class LandmarkComponent {
  landmarkData = landmark;
  selectedLandmark: any;

  ngOnInit() {
    this.initMap();
    this.createLandMark(this.landmarkData);
  }

  // 地圖
  map: any
  mapOptions: any
  // 初始地圖地點
  center: google.maps.LatLngLiteral = {
    lat: 23.83876,
    lng: 120.9876
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
    this.siteAuto();
    // 定義地圖相關設定
    this.mapOptions = {
      zoom: 8,
      center: this.center,
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

  autocomplete: any
  place: any

  // 地址自動完成 + 地圖的中心移到輸入結果的地址上
  siteAuto() {
    const options = {
      types: ['establishment'], // 限制類型為地址
      componentRestrictions: { country: 'tw' },// 限制在台灣範圍
      fields: ['place_id', 'geometry', 'name', 'formatted_address']
    };
    this.autocomplete = new google.maps.places.Autocomplete(document.getElementById('pac-input'), options);
    console.log(this.autocomplete)
    // 地址的輸入框，值有變動時執行
    this.autocomplete.addListener("place_changed", () => {
      console.log('place_changed')
      this.place = this.autocomplete.getPlace(); // 地點資料存進place
      // 確認回來的資料有經緯度
      if (this.place.geometry) {

        // 改變map的中心點
        const searchCenter = this.place.geometry.location;

        // panTo是平滑移動、setCenter是直接改變地圖中心
        this.map.panTo(searchCenter);

        // 在搜尋結果的地點上放置標記
        const marker = new google.maps.Marker({
          position: searchCenter,
          map: this.map
        });

        // info window
        const infowindow = new google.maps.InfoWindow({
          content: this.place.formatted_address
        });
        infowindow.open(this.map, marker);

      }

    });
  }

  // 監聽LandMarker事件
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

  markType: any[] = [
    { name: '倉庫', icon: 'fas fa-warehouse', code: 'warehouse', text: '\uebb8' },
    { name: '客戶', icon: 'pi pi-user', code: 'client', text: '\ue7fd' },
  ];

  landMarkerIcon: any = '\uebb8';

  // 儲存選擇到的類型icon
  getLandMarkerIcon(event: any) {
    this.landMarkerIcon = event.text
    console.log(this.landMarkerIcon)
  }

  // 右鍵點擊地圖顯示的marker
  previousMarker: google.maps.Marker | null = null;

  // 右鍵點擊地圖 - 以marker為中心
  placeMarkerAndPanTo(latLng: google.maps.LatLng, map: google.maps.Map) {
    // 清除之前的標記
    if (this.previousMarker) {
      this.previousMarker.setMap(null);
    }
    // 新的標記
    const marker = new google.maps.Marker({
      position: latLng,
      map: map,
    });
    // 設定地圖中心為新位置
    map.panTo(latLng);
    // 取得位置的地址資料
    this.latLngToString(latLng);
    // 將新標記設為上一個標記
    this.previousMarker = marker;
  }

  // 取得位置地址資料
  landMarkerAddr: any;

  latLngToString(latLng: google.maps.LatLng) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
      if (status === google.maps.GeocoderStatus.OK) {
        let addressFound = false;
        if (results && results.length > 0) {
          for (let i = 0; i < results.length; i++) {
            const formattedAddress = results[i].formatted_address;
            if (!formattedAddress.match(/\b\w+\+\w+\b/)) {
              this.landMarkerAddr = formattedAddress;
              addressFound = true;
              break; // 找到非 Plus Code 地址後跳出迴圈
            }
          }
        }
        if (!addressFound) {
          this.landMarkerAddr = '找不到地址';
        }
      } else {
        this.landMarkerAddr = '編碼錯誤';
      }
    });
  }

  landMarker = google.maps.LatLngLiteral;

  // 新增地標的按鈕
  addLandMark() {
    this.landMarker = this.previousMarker

    // 創建新的標記
    const marker = new google.maps.Marker({
      position: this.landMarker.getPosition(),
      map: this.map,
      label: {
        text: this.landMarkerIcon, // codepoint from https://fonts.google.com/icons
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

  // 建立資料庫內的LandMark
  createLandMark(landMarkerData: any) {
    for (const location of landMarkerData) {
      const name = location.name;
      const contentString = `<label>${name}</label>`;
      const infowindow = new google.maps.InfoWindow({
        content: contentString,
      });
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(location.lat, location.lng),
        map: this.map,
        label: {
          text: location.text, // codepoint from https://fonts.google.com/icons
          fontFamily: "Material Icons",
          color: "#ffffff",
          fontSize: "18px",
        },
      });
      marker.addListener("click", () => {
        infowindow.open({
          anchor: marker,
          map: this.map,
        });
        this.selectedLandmark = location;
        this.select();
      });
    }
  }

  select() {
    console.log('select: ', this.selectedLandmark)

    this.map.setCenter(new google.maps.LatLng(this.selectedLandmark.lat, this.selectedLandmark.lng));
    this.map.setZoom(20);

  }

}
