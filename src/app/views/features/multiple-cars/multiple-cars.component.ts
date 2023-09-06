import {Component, OnInit, ViewChild} from '@angular/core';
import {GoogleMap, MapInfoWindow, MapMarker} from "@angular/google-maps";
import {products} from "../../../shared/data/products";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-multiple-cars',
  templateUrl: './multiple-cars.component.html',
  styleUrls: ['./multiple-cars.component.scss'],
  providers: [MessageService]
})
export class MultipleCarsComponent implements OnInit {
  selectedProduct: any[] = [];
  sidebarRightOpen = true;
  products: any = products;

  onSelectionChange(event: any[]) {
    this.selectedProduct = event;
    console.log(this.selectedProduct.length)
    if (this.selectedProduct.length > 24) {
      this.messageService.clear();
      this.messageService.add({ severity: 'warn', summary: '資訊', detail: '已選擇 24 台車，超過上限！' });
      // 如果超過24筆，取消最後一次選擇的項目
      this.selectedProduct.pop();
    }
  }

  showLayout(){
    switch (true) {
      case this.selectedProduct.length < 3:
        return 'w-6 h1-1';
      case this.selectedProduct.length < 4:
        return 'w-4 h1-1';
      case this.selectedProduct.length < 5:
        return 'w-6 h1-2';
      case this.selectedProduct.length < 7:
        return 'w-4 h1-2';
      case this.selectedProduct.length < 9:
        return 'w-3 h1-2';
      case this.selectedProduct.length < 10:
        return 'w-4 h1-3';
      case this.selectedProduct.length < 13:
        return 'w-3 h1-3';
      case this.selectedProduct.length < 17:
        return 'w-3 h1-4';
      case this.selectedProduct.length < 21:
        return 'w-1-5 h1-4';
      default:
        return 'w-2 h1-4';
    }
  }

  @ViewChild(MapInfoWindow, {static: false}) info!: MapInfoWindow
  @ViewChild(GoogleMap, {static: false}) map!: GoogleMap;

  markers: any[] = []

  constructor(private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.markers = products.map(product => ({
      position: product.position,
      icon: {url: product.url, scaledSize: new google.maps.Size(50, 50)},
      label: {text: product.label.text},
      infoWindowContent: product.label.text
    }));
    console.log(this.markers)
    // 在初始化時預設打開第一個標記的標籤內容
    // if (this.markers.length > 0) {
    //   this.openInfo(this.markers[0], this.markers[0].infoWindowContent);
    // }
  }

  // 初始地圖地點
  center: google.maps.LatLngLiteral = {
    lat: 25.040824,
    lng: 121.556745
  };

  options: google.maps.MapOptions = {
    // google map提供的放大縮小
    zoomControl: true,
    // 按ctrl是否可以放大縮小
    scrollwheel: true,
    // 點兩下地圖是否可以放大縮小
    disableDoubleClickZoom: true,
    mapTypeId: 'terrain',
    maxZoom: 20,
  }
  zoom = 15;
  infoContent = ''

  // 開啟標記標籤的內容
  openInfo(marker: MapMarker, content: string) {
    this.infoContent = content;
    this.info.open(marker)
  }

  // 點擊地圖會在中間
  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = (event.latLng.toJSON());
  }

  display: any

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  // 配合側邊欄開關調整寬度
  getMiddleDivClass() {
    if (this.sidebarRightOpen) {
      return 'col-12 md:col-12 lg:col-8';
    } else {
      return 'col-12 md:col-12 lg:col-12';
    }
  }

  // 開合側邊欄按鈕
  toggleSidebar() {
    this.sidebarRightOpen = !this.sidebarRightOpen;
  }
}
