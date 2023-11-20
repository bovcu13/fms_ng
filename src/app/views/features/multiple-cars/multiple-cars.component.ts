import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from "@angular/google-maps";
import { products } from "../../../shared/data/products";
import { MessageService } from 'primeng/api';
import { tap } from "rxjs/operators";
import { CarService } from "../../../services/car.service";

@Component({
  selector: 'app-multiple-cars',
  templateUrl: './multiple-cars.component.html',
  styleUrls: ['./multiple-cars.component.scss'],
  providers: [MessageService]
})
export class MultipleCarsComponent implements OnInit {
  selectedProduct: any[] = [];
  saveSelectedProduct: any[][] = [];
  sidebarRightOpen = true;
  products: any;
  Panels: any[] = [1];
  countPanels: number = 1;
  selectPanel: number = 0;
  trafficVisable: boolean = false;

  onSelectionChange(event: any[]) {
    this.selectedProduct = event;
    // 將選擇資料存進二維陣列
    this.saveSelectedProduct[this.selectPanel] = this.selectedProduct;
    console.log(this.saveSelectedProduct)
    if (this.selectedProduct.length > 24) {
      this.messageService.clear();
      this.messageService.add({ severity: 'warn', summary: '資訊', detail: '已選擇 24 台車，超過上限！' });
      // 如果超過24筆，取消最後一次選擇的項目
      this.selectedProduct.pop();
    }
  }

  check(e: any) {
    console.log(e.index)
    this.selectPanel = e.index;
    // 將二微陣列的值呼叫到 selectedProduct
    this.selectedProduct = this.saveSelectedProduct[e.index];
    console.log(e.originalEvent.target.innerText)
    if (this.Panels) {
      if (e.originalEvent.target.innerText == '+') {
        if (this.countPanels < 10) {
          this.Panels.push(this.Panels.length + 1);
          this.countPanels++;
          this.sidebarRightOpen = false;
          console.log('Panels.length: ' + this.Panels.length + '\ncountPanels: ' + this.countPanels)
        } else {
          this.messageService.add({ severity: 'warn', summary: '資訊', detail: '最多開啟 10 筆查詢！' });
        }
      } else {
        this.sidebarRightOpen = true;
      }
    }
  }

  addNewTab() {
    this.selectPanel = this.selectPanel + 1
    if (this.Panels) {
      if (this.countPanels < 10) {
        this.Panels.push(this.Panels.length + 1);
        this.countPanels++;
        console.log('Panels.length: ' + this.Panels.length + '\ncountPanels: ' + this.countPanels)
      }
    }
  }

  close(e: any) {
    console.log(e)
    this.countPanels--;
    this.saveSelectedProduct[e.index] = [];
    console.log(this.saveSelectedProduct)
    console.log('Panels.length: ' + this.Panels.length + '\ncountPanels: ' + this.countPanels)
    // if (this.Panels.length > 0) {
    //     this.Panels.pop();
    //     console.log(this.Panels.length)
    // }
  }

  closable() {
    return this.countPanels > 1
  }

  showLayout() {
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

  @ViewChild(MapInfoWindow, { static: false }) info!: MapInfoWindow
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;

  markers: any[] = []

  constructor(
    private messageService: MessageService,
    private carServ: CarService
  ) {
  }

  ngOnInit(): void {
    this.getAllNewGpsRequest();
  }

  visible = true;
  getAllNewGpsRequest() {
    this.carServ.getAllNewGpsRequest().subscribe({
      next: (res) => {
        this.products = res.body.gps.map((item: any) => ({
          ...item,
          position: {
            lat: item.lat,
            lng: item.lng
          },
          url: this.getUrlByDirection(item.heading, item.status),
          direction: this.parseHeading(item.heading)
        }));
        console.log("來源資料:", this.products);

        this.markers = this.products.map((product: any) => ({
          position: product.position,
          icon: {
            url: product.url,
            scaledSize: new google.maps.Size(50, 50)
          },
          infoWindowContent: product.address,
        }));
        console.log(this.markers)
        this.visible = false;
      },
      error: (err) => {
        console.log(err);
      },
    });
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

  getUrlByDirection(heading: number, status: string) {
    let direction = this.parseHeading(heading);

    let directionUrlMap: { [key: string]: { [status: string]: string } } = {
      '北': {
        '熄火': 'assets/car/off_n.png',
        '失聯': 'assets/car/missing_n.png',
        '行駛': 'assets/car/normal_n.png',
        '怠停': 'assets/car/stall_n.png',
        '久停': 'assets/car/stop_n.png'
      },
      '東北': {
        '熄火': 'assets/car/off_ne.png',
        '失聯': 'assets/car/missing_ne.png',
        '行駛': 'assets/car/normal_ne.png',
        '怠停': 'assets/car/stall_ne.png',
        '久停': 'assets/car/stop_ne.png'
      },
      '東': {
        '熄火': 'assets/car/off_e.png',
        '失聯': 'assets/car/missing_e.png',
        '行駛': 'assets/car/normal_e.png',
        '怠停': 'assets/car/stall_e.png',
        '久停': 'assets/car/stop_e.png'
      },
      '東南': {
        '熄火': 'assets/car/off_se.png',
        '失聯': 'assets/car/missing_se.png',
        '行駛': 'assets/car/normal_se.png',
        '怠停': 'assets/car/stall_se.png',
        '久停': 'assets/car/stop_se.png'
      },
      '南': {
        '熄火': 'assets/car/off_s.png',
        '失聯': 'assets/car/missing_s.png',
        '行駛': 'assets/car/normal_s.png',
        '怠停': 'assets/car/stall_s.png',
        '久停': 'assets/car/stop_s.png'
      },
      '西南': {
        '熄火': 'assets/car/off_sw.png',
        '失聯': 'assets/car/missing_sw.png',
        '行駛': 'assets/car/normal_sw.png',
        '怠停': 'assets/car/stall_sw.png',
        '久停': 'assets/car/stop_sw.png'
      },
      '西': {
        '熄火': 'assets/car/off_w.png',
        '失聯': 'assets/car/missing_w.png',
        '行駛': 'assets/car/normal_w.png',
        '怠停': 'assets/car/stall_w.png',
        '久停': 'assets/car/stop_w.png'
      },
      '西北': {
        '熄火': 'assets/car/off_nw.png',
        '失聯': 'assets/car/missing_nw.png',
        '行駛': 'assets/car/normal_nw.png',
        '怠停': 'assets/car/stall_nw.png',
        '久停': 'assets/car/stop_nw.png'
      }
    };

    return directionUrlMap[direction] && directionUrlMap[direction][status] || 'assets/image/warehouse.png';
  }

  parseHeading(heading: number) {
    const directions = ['北', '東北', '東', '東南', '南', '西南', '西', '西北'];
    const index = Math.floor(((heading + 22.5) % 360) / 45);
    return directions[index] || '未知方位';
  }
}
