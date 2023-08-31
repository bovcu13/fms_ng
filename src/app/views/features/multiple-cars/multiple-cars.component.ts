import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from "@angular/google-maps";
import { products } from "../../../shared/data/products";

@Component({
  selector: 'app-multiple-cars',
  templateUrl: './multiple-cars.component.html',
  styleUrls: ['./multiple-cars.component.scss']
})
export class MultipleCarsComponent implements OnInit {
  selectedProduct!: any;
  // Select() {
  //   if (this.selectedProduct) {
  //     this.center = this.selectedProduct.position;
  //   }
  // }

  polyPath: google.maps.LatLngLiteral[] = [];

  @ViewChild(MapInfoWindow, { static: false }) info!: MapInfoWindow
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;


  markers: any[] = []

  ngOnInit(): void {}


  //初始地圖地點
  center: google.maps.LatLngLiteral = {
    lat: 25.040824,
    lng: 121.556745
  };

  options: google.maps.MapOptions = {
    //google map提供的放大縮小
    zoomControl: true,
    //按ctrl是否可以放大縮小
    scrollwheel: true,
    //點兩下地圖是否可以放大縮小
    disableDoubleClickZoom: true,
    mapTypeId: 'terrain',
    maxZoom: 20,
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

  protected readonly products = products;
}
