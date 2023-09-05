import { Component, OnInit } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-maaaap',
  templateUrl: './maaaap.component.html',
  styleUrls: ['./maaaap.component.scss']
})
export class MaaaapComponent implements OnInit {
  map: any;

  ngOnInit() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 64.79728743642762, lng: -150.995535452303 },
      zoom: 7
    });

    // 创建多边形
    let polygon = new google.maps.Polygon({
      map: this.map,
      paths: [
        // 多邊形座標
        [
          {
            lat: 65.14126095716469,
            lng: -155.510916311678
          },
          {
            lat: 65.27485886465622,
            lng: -154.642996389803
          },
          {
            lat: 65.63992346657838,
            lng: -154.500174124178
          },
          {
            lat: 65.80704912165639,
            lng: -155.159353811678
          },
          {
            lat: 65.64898494006725,
            lng: -156.093191702303
          },
          {
            lat: 65.27026326043044,
            lng: -156.356863577303
          }
        ],
        [
          {
            lat: 65.30241568666297,
            lng: -151.522879202303
          },
          {
            lat: 65.48539327007941,
            lng: -149.984793264803
          },
          {
            lat: 65.73491119176467,
            lng: -150.171560842928
          },
          {
            lat: 65.91039432417611,
            lng: -150.819754202303
          },
          {
            lat: 65.5400380950869,
            lng: -152.116140921053
          },
          {
            lat: 65.37118184344384,
            lng: -152.138113577303
          }
        ]
      ],
      strokeColor: '#FF8C00',
      fillColor: '#FF8C00',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      editable: true
    });
    // 事件監聽器
    google.maps.event.addListener(polygon, 'click', function () {
      // 點擊多邊形時的處理
      polygon.setOptions({ fillColor: '#000' });
      polygon.setOptions({ strokeColor: '#000' });
    });
  }
}
