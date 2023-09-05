import { Component, OnInit } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-maaaap',
  templateUrl: './maaaap.component.html',
  styleUrls: ['./maaaap.component.scss']
})
export class MaaaapComponent implements OnInit {
  map: any;
  //用於儲存上一個點擊
  lastClickedPolygon: any;

  ngOnInit() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 64.79728743642762, lng: -150.995535452303 },
      zoom: 7
    });

    let polygons = [
      {
        // 建立多邊形路徑
        paths: [
          {
            lat: 63.84526422875888,
            lng: -153.060965139803
          },
          {
            lat: 64.03830815102336,
            lng: -153.588308889803
          },
          {
            lat: 64.50094419573703,
            lng: -153.500418264803
          },
          {
            lat: 64.64246352506252,
            lng: -152.050222952303
          },
          {
            lat: 64.20135214728498,
            lng: -151.314138967928
          },
          {
            lat: 64.14870724365123,
            lng: -152.160086233553
          },
          {
            lat: 64.33966488515952,
            lng: -152.544607717928
          }
        ],
        strokeColor: '#FF8C00',
        fillColor: '#FF8C00',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        editable: true
      },
      {
        paths: [
          {
            lat: 65.78452769554828,
            lng: -146.622976858553
          },
          {
            lat: 65.91487816470621,
            lng: -145.172781546053
          },
          {
            lat: 66.12473526488733,
            lng: -145.183767874178
          },
          {
            lat: 66.29756399411468,
            lng: -146.117605764803
          },
          {
            lat: 66.32845950832974,
            lng: -147.128347952303
          },
          {
            lat: 65.91487816470621,
            lng: -147.688650686678
          },
          {
            lat: 65.9820416527134,
            lng: -146.853689749178
          },
          {
            lat: 65.64445459904373,
            lng: -147.260183889803
          }
        ],
        strokeColor: '#FF8C00',
        fillColor: '#FF8C00',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        editable: true
      }
    ];

    for (let i = 0; i < polygons.length; i++) {
      let polygon = new google.maps.Polygon({
        map: this.map,
        paths: polygons[i].paths,
        strokeColor: polygons[i].strokeColor,
        fillColor: polygons[i].fillColor,
        strokeOpacity: polygons[i].strokeOpacity,
        strokeWeight: polygons[i].strokeWeight,
        editable: polygons[i].editable
      });

      // 箭頭函數，自己抓this
      google.maps.event.addListener(polygon, 'click', () => {
        // 點擊新的多邊形，取消上一個點擊的效果
        if (this.lastClickedPolygon) {
          this.lastClickedPolygon.setOptions({ fillColor: '#FF8C00' });
          this.lastClickedPolygon.setOptions({ strokeColor: '#FF8C00' });
        }

        polygon.setOptions({ fillColor: '#000' });
        polygon.setOptions({ strokeColor: '#000' });

        // 更新上一個點擊
        this.lastClickedPolygon = polygon;
      });
    }
  }
}
