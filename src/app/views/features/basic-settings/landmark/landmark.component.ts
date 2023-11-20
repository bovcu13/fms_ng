import { Component, OnInit } from '@angular/core';
import { landmark, area } from "../../../../shared/data/landmark";
import { ConfirmationService, MessageService } from "primeng/api";
import { CarService } from "../../../../services/car.service";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

declare var google: any;

@Component({
  selector: 'app-landmark',
  templateUrl: './landmark.component.html',
  styleUrls: ['./landmark.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class LandmarkComponent {
  areaData = area;
  landmarkData = landmark;
  selectedLandmark: any;
  selectedArea: any;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.initMap();
    this.createLandMark(this.landmarkData);
    this.createArea(this.areaData);
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
  // 地標
  markDialog: boolean = false;

  showMarkDialog() {
    this.markDialog = true;
  }

  initMap() {
    // this.siteAuto();

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

    // 監聽draw的事件
    this.mapDrawListener();
    // 監聽LandMarker事件
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
  drawnPolygons: any[] = []; // 用於存儲已繪製的多邊形
  mapDrawListener() {
    // 繪製多邊形完成
    this.drawingManager.addListener('overlaycomplete', (event: any) => {
      if (event.type === google.maps.drawing.OverlayType.POLYGON) {
        // 獲取多邊形的路徑（坐標）
        const polygon = event.overlay;
        const path = polygon.getPath().getArray();
        // 轉格式
        const coordinates = path.map((latLng: any) => {
          return { lat: latLng.lat(), lng: latLng.lng() };
        });

        console.log('多邊形坐標:', coordinates);

        // 暫存多邊形
        this.drawnPolygons.push(polygon);

        // 設置地圖中心點為多邊形的中心
        this.setMapCenterToPolygonCenter(polygon);

        // const areaButton = document.getElementById('area-button');
        // // 檢查 customButton 是否為 null
        // if (areaButton) {
        //   areaButton.style.display = 'block';
        // }
      }
    });

    // 監聽地圖的拖動事件，清空繪製的區域
    this.map.addListener("drag", () => {
      this.clearPolygons();
    });

    // 監聽地圖的點擊事件，清空繪製的區域
    this.map.addListener("click", () => {
      this.clearPolygons();
    });

  }

  clearPolygons() {
    // 已繪製的多邊形
    this.drawnPolygons.forEach((polygon) => {
      polygon.setMap(null);
    });

    // 清空已繪製的多邊形數組
    this.drawnPolygons = [];
  }

  setMapCenterToPolygonCenter(polygon: any) {
    const bounds = new google.maps.LatLngBounds();
    const path = polygon.getPath();

    // 將多邊形的所有坐標加入bounds，以計算中心
    path.forEach((latLng: any) => {
      bounds.extend(latLng);
    });

    // 計算多邊形的中心
    const center = bounds.getCenter();
    // 取得多邊形中心的地址資料
    this.latLngToString(center);
    // 設置地圖中心點為多邊形的中心
    this.map.setCenter(center);
  }

  areaDialog: boolean = false;

  showAreaDialog() {
    if (this.drawnPolygons.length > 0) {
      this.areaDialog = true;
    } else {
      this.showError();
    }
  }

  area: any[] = [];
  addArea() {
    if (this.drawnPolygons.length > 0) {
      // 使用 concat 方法將 drawnPolygons 的內容添加到 area 中
      this.area.push(this.drawnPolygons);

      // 清空 drawnPolygons
      this.drawnPolygons = [];

      // this.area 包含了以前的內容以及新添加的多邊形
      console.log('Updated area:', this.area);
    } else {
      this.showError();
    }
  }

  // 監聽LandMarker事件
  mapLandMarkListener() {
    // 點右鍵生成標記以新增地標
    this.map.addListener("contextmenu", (e: any) => {
      this.placeMarkerAndPanTo(e.latLng, this.map);
    });

    // 監聽地圖的點擊事件，清空地標
    this.map.addListener("click", (e: any) => {
      // 清除之前的標記
      if (this.previousMarker) {
        this.previousMarker.setMap(null);
        this.previousMarker.setPosition(null);
      }
    });

    // 監聽地圖的拖動事件，清空地標
    this.map.addListener("drag", () => {
      // 清除之前的標記
      if (this.previousMarker) {
        this.previousMarker.setMap(null);
        this.previousMarker.setPosition(null);
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
  latLngToAddr: any;
  latLngToString(latLng: google.maps.LatLng) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
      if (status === google.maps.GeocoderStatus.OK) {
        let addressFound = false;
        if (results && results.length > 0) {
          for (let i = 0; i < results.length; i++) {
            const formattedAddress = results[i].formatted_address;
            if (!formattedAddress.match(/\b\w+\+\w+\b/)) {
              this.latLngToAddr = formattedAddress;
              addressFound = true;
              break; // 找到非 Plus Code 地址後跳出迴圈
            }
          }
        }
        if (!addressFound) {
          this.latLngToAddr = '找不到地址';
        }
      } else {
        this.latLngToAddr = '編碼錯誤';
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

  createArea(areaData: any) {
    for (const location of areaData) {
      const polygon = new google.maps.Polygon({
        paths: location.path,
        strokeColor: "#000000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#000000",
        fillOpacity: 0.35,
      });
      polygon.setMap(this.map);
    }
  }

  select() {
    if (this.selectedLandmark) {
      console.log('select: ', this.selectedLandmark)

      this.map.setCenter(new google.maps.LatLng(this.selectedLandmark.lat, this.selectedLandmark.lng));
      this.map.setZoom(20);
    } else if (this.selectedArea) {
      console.log('select: ', this.selectedArea)

      this.map.setCenter(new google.maps.LatLng(this.selectedArea.lat, this.selectedArea.lng));
      this.map.setZoom(20);

    }
  }

  // 操作提示
  showError() {
    this.messageService.add({ severity: 'warn', summary: '提示', detail: `請先繪製一個區域` });
  }


}
