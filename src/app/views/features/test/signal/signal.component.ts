import { Component, computed, Input, OnInit, signal } from '@angular/core';
import { CarService } from "../../../../services/car.service";

declare var google: any;

@Component({
  selector: 'app-signal',
  templateUrl: './signal.component.html',
  styleUrls: ['./signal.component.scss']
})
export class SignalComponent implements OnInit {
  data: any[] = []
  transformedData: any [] = []

  // 使用 Signal 包裝 data 陣列
 dataSignal:any = signal<any[]>([]);

  // 當陣列發生變化時會觸發這個方法
  onDataChange() {
    // 計算新增的資料
    const addedData = this.dataSignal.value.diff(this.data);

    // 更新這些資料
    this.transformedData = this.transformedData.concat(addedData);
  }

  constructor(private carServ: CarService) {
  }

  ngOnInit() {
    this.getDefaultDate()

    // 監聽陣列的變化
    this.dataSignal.subscribe((value: any) => {
      this.onDataChange();
    });
  }

  search() {
    this.getAllGpsRequest('NEM-9335', { filter: { start_time: this.startDate, end_time: this.endDate } })
    console.log("開始：", this.startDate, "結束：", this.endDate)
  }

  // 取得車輛歷史資料
  getAllGpsRequest(id: any, body: any) {
    this.carServ.getAllGpsRequest(id, body).subscribe({
      next: (res) => {
        this.data = res.body.gps;
        console.log("來源資料:", res.body.gps);
        this.transformedData = this.data.map((item: any) => ({
          ...item,
          addr: "",
          direction: this.parseHeading(item.heading)
        }));
        console.log("轉換後資料:", this.transformedData);
        // 轉換成中文地址
        this.geocodePositions();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  parseHeading(heading: number) {
    if ((heading >= 0 && heading < 22.5) || (heading >= 337.5 && heading <= 360)) {
      return '北';
    } else if (heading >= 22.5 && heading < 67.5) {
      return '東北';
    } else if (heading >= 67.5 && heading < 112.5) {
      return '東';
    } else if (heading >= 112.5 && heading < 157.5) {
      return '東南';
    } else if (heading >= 157.5 && heading < 202.5) {
      return '南';
    } else if (heading >= 202.5 && heading < 247.5) {
      return '西南';
    } else if (heading >= 247.5 && heading < 292.5) {
      return '西';
    } else if (heading >= 292.5 && heading < 337.5) {
      return '西北';
    } else {
      return '未知方位';
    }
  }

  startDate: any
  endDate: any

  getDefaultDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to 00:00:00.000
    this.startDate = today
    this.endDate = new Date();
  }

  geocodePositions() {
    const geocoder = new google.maps.Geocoder();

    this.transformedData.forEach((product: any) => {
      const latlng = new google.maps.LatLng(product.lat, product.lng);

      geocoder.geocode({ location: latlng }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
        if (status === google.maps.GeocoderStatus.OK) {
          let addressFound = false;
          if (results && results.length > 0) {
            for (let i = 0; i < results.length; i++) {
              const formattedAddress = results[i].formatted_address;
              if (!formattedAddress.match(/\b\w+\+\w+\b/)) {
                product.addr = formattedAddress;
                addressFound = true;
                break; // 找到非 Plus Code 地址後跳出迴圈
              }
            }
          }
          if (!addressFound) {
            product.addr = '找不到地址';
          }
        } else {
          product.addr = '編碼錯誤';
        }
      });
    });
  }
}
