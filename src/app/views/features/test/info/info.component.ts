import { Component, OnInit } from '@angular/core';
import {products} from "../../../../shared/data/products";

declare var google: any;

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
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
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    maxZoom: 18,
  }
  zoom = 15;

  //點擊地圖會在中間
  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = (event.latLng.toJSON());
  }

  display: any

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }
  // 創建標記
  markers: any[] = []

  constructor() { }

  ngOnInit(): void {
    // 創建標記
    this.markers = products.map((location) => {
      const marker = {
        position: new google.maps.LatLng(location.position.lat, location.position.lng),
        title: location.addr,
        icon: { url: location.url, scaledSize: new google.maps.Size(50, 50) },
        infoWindowText: location.infoWindowContent, // info window 內容
        infoWindowOptions: { maxWidth: 200 }, // info window 選項
      };

      return marker;
    });

    // 定義地圖相關設定
    const mapOptions = {
      zoom: 14,
      center: new google.maps.LatLng(25.11450, 121.52227),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // 創建地圖實例
    const map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // 資訊窗口
    for (const location of products) {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(location.position.lat, location.position.lng),
        map: map,
        title: location.addr,
        icon: { url: location.url, scaledSize: new google.maps.Size(50, 50) },
      });

      const infowindow = new google.maps.InfoWindow({
        content: location.infoWindowContent
      });

      google.maps.event.addListener(marker, 'click', () => {
        infowindow.open(map, marker);
      });

      // 一開始就顯示資訊窗口
      infowindow.open(map, marker);

      this.markers.push(marker);
    }
  }
}
