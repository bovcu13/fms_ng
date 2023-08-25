import {Component, OnInit, ViewChild} from '@angular/core';
import {products} from "../../../shared/data/products";
import {MapInfoWindow, MapMarker} from "@angular/google-maps";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  @ViewChild(MapInfoWindow, {static: false}) info!: MapInfoWindow
  products: any = products;
  selectedProduct: any;
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
  markers: any[] = []

  Select() {
    if (this.selectedProduct) {
      this.center = this.selectedProduct.position;
    }
  }

  ngOnInit(): void {
    // this.http.get('https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js').subscribe({
    //   next: res => {
    //     console.log(res)
    //   },
    //   error: error => {
    //     console.log(error);
    //   }
    // });

    this.markers = products.map(product => ({
      position: {lat: product.position.lat, lng: product.position.lng}, // 假設 products 有經緯度資訊
      title: product.label.text, // 使用產品名稱作為標記/標題
      icon: {url: product.url, scaledSize: new google.maps.Size(50, 50)},
      label: {text: product.label.text} // 使用產品描述作為標記標籤內容
    }));
    // this.markers = [
    // new google.maps.Polygon({paths: [
    //     {lat: 25.0339, lng: 121.5774}, {lat: 25.0335, lng: 121.5764}, {lat: 25.0328, lng: 121.5769}, {lat: 25.0332, lng: 121.5780}
    //   ], strokeOpacity: 0.5, strokeWeight: 1, fillColor: '#1976D2', fillOpacity: 0.35
    // }),
    // new google.maps.Circle({center: {lat: 25.03396, lng: 121.56446}, fillColor: '#1976D2', fillOpacity: 0.35, strokeWeight: 1, radius: 1500}),
    // new google.maps.Polyline({path: [{lat: 25.03421, lng: 121.57612}, {lat: 25.03351, lng: 121.58693}], geodesic: true, strokeColor: '#FF0000', strokeOpacity: 0.5, strokeWeight: 2})
    // ];
    console.log(this.markers)
  }
  //初始地圖地點
  center: google.maps.LatLngLiteral = {
    lat: 25.0336962,
    lng: 121.5643673
  };
  options: google.maps.MapOptions = {
    //google map提供的放大縮小
    zoomControl: true,
    //按ctrl是否可以放大縮小
    scrollwheel: true,
    //點兩下地圖是否可以放大縮小
    disableDoubleClickZoom: true,
    mapTypeId: 'terrain',
    maxZoom: 18,
    minZoom: 8,
  }
  zoom = 15;
  infoContent = ''

  //開啟標記標籤的內容
  openInfo(marker: MapMarker, content: string) {
    this.infoContent = content;
    this.info.open(marker)
  }
  //點擊地圖會在中間
  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = (event.latLng.toJSON());
  }
  display: any
  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }
}
