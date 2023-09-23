import { Component, OnInit } from '@angular/core';
import { CarService } from "../../../../services/car.service";


@Component({
  selector: 'app-cake-report',
  templateUrl: './cake-report.component.html',
  styleUrls: ['./cake-report.component.scss']
})
export class CakeReportComponent implements OnInit {
  constructor(private carServ: CarService) {
  }

  ngOnInit() {
    this.getDefaultDate();

  }

  test: any;
  options: any;
  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: this.timeData,
      datasets: [
        {
          label: 'First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4
        }
      ]
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  search() {
    this.getAllGpsRequest('8987XC', { filter: { start_time: this.startDate, end_time: this.endDate } })
    console.log("開始：", this.startDate, "結束：", this.endDate)
  }

  data: any
  transformedData: any
  timeData: any

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
        this.timeData = this.data.map((item: any) =>
          this.getTimeFromDateTime(item.date_time)
        );
        console.log("轉換後資料:", this.transformedData);
        console.log("timeData:", this.timeData)
        this.initChart();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getTimeFromDateTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }


  cars: any;
  vehiclesData: any;

  // 取得車牌
  getAllVehiclesRequest() {
    this.carServ.getAllVehiclesRequest().subscribe({
      next: res => {
        this.vehiclesData = res.body.vehicles;
        this.cars = this.vehiclesData.map((item:any) => ({
          name: item.license_plate,
          code: item.license_plate
        }));
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
  maxDate = new Date()

  getDefaultDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to 00:00:00.000
    this.startDate = today
    this.endDate = new Date();
  }

  onStartDateChange(event: any) {
    this.startDate = event;
  }

  onEndDateChange(event: any) {
    this.endDate = event;
  }

  sidebarRightOpen = true;

  toggleSidebar() {
    this.sidebarRightOpen = !this.sidebarRightOpen;
  }

  getMiddleDivClass() {
    if (this.sidebarRightOpen) {
      return 'col-12 md:col-12 lg:col-9';
    } else {
      return 'col-12 md:col-12 lg:col-12';
    }
  }

}
