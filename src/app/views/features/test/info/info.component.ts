import { Component, OnInit } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // 定義地圖相關設定
    const mapOptions = {
      zoom: 14,
      center: new google.maps.LatLng(22.803444, 86.179525),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // 創建地圖實例
    const map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // 你的位置數據
    const locations = [
      {
        name: "Market 1",
        lat: 22.809999,
        lng: 86.179999,
        infoWindowContent: "Market1",
      },
      {
        name: "Market 2",
        lat: 22.803999,
        lng: 86.179525,
        infoWindowContent: "Market2",
      },
      {
        name: "Market 3",
        lat: 22.806999,
        lng: 86.159525,
        infoWindowContent: "Market3",
      }
    ];

    // 創建標記和資訊窗口
    const markers = [];
    for (const location of locations) {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(location.lat, location.lng),
        map: map,
        title: location.name
      });

      const infowindow = new google.maps.InfoWindow({
        content: location.infoWindowContent
      });

      google.maps.event.addListener(marker, 'click', () => {
        infowindow.open(map, marker);
      });

      // 一開始就顯示資訊窗口
      infowindow.open(map, marker);

      markers.push(marker);
    }
  }
}
