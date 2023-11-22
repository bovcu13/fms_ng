import { Component, OnInit } from '@angular/core';
import { CarService } from "../../../../services/car.service";
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);


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
    this.getAllVehiclesRequest();
    this.initCake();
  }

  cakeData: any
  cakeOptions: any

  initCake() {
    const hours = Array.from({ length: 25 }, (_, i) => i < 10 ? '0' + i + ':00' : i + ':00');

    this.cakeData = {
      labels: hours,
      datasets: [{
        label: 'My First Dataset',
        data: [65, 59, 90, 81, 56, 55, 40, 75, 80, 60, 45, 70, 50, 65, 55, 40, 75, 80, 60, 45, 70, 50, 65, 55, 40],
        fill: false,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
      }, {
        label: 'My Second Dataset',
        data: [20, 40, 10, 10, 30, 50, 20, 10, 30, 10, 40, 50, 20, 10, 30, 10, 40, 20, 10, 50, 30, 10, 40, 50, 10],
        fill: false,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)'
      }]
    };

    this.cakeOptions = {
      scales: {
        // r為雷達圖中的放射軸（radial axis）
        r: {
          max: 120,
          min: 0,
          ticks: {
            stepSize: 10
          },
          grid: {
            // 將網格設定為圓形，使雷達圖呈現圓形
            circular: true,
          },
          // 將放射軸的起點設定為零
          beginAtZero: true
        },
      },
      elements: {
        line: {
          // 線條寬度
          borderWidth: 3
        }
      },
    };
  }

  test: any;
  options: any;

  initChart() {
    // 從文件取特定 CSS
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color'); // '--text-color'
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary'); // '--text-color-secondary'
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border'); // '--surface-border'

    // 設定圖表資料
    this.data = {
      labels: this.timeData,
      datasets: [
        {
          label: '時速',
          data: this.speedData,
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
        },
        zoom: {
          pan: {
            enabled: true,
            mode: 'x'
          },
          zoom: {
            wheel: {
              enabled: true, // 啟用使用滾輪縮放
            },
            pinch: {
              enabled: true // 啟用使用捏擠手勢縮放（例如在觸控屏上）
            },
            mode: 'x', // 在 X 軸啟用縮放
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
    this.getAllGpsRequest(this.plate, { filter: { start_time: this.startTime, end_time: this.endTime } })
    console.log("開始：", this.startTime, "結束：", this.endTime)

  }

  plate: any;

  selectCar(event: any) {
    console.log(event)
    this.plate = event;
  }

  data: any
  transformedData: any
  timeData: any
  speedData: any

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
        this.speedData = this.data.map((item: any) =>
          item.speed
        );
        console.log("轉換後資料:", this.transformedData);
        console.log("timeData:", this.timeData)
        console.log("speedData:", this.speedData)

        this.initChart();

        this.initCake();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getTimeFromDateTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Taipei',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit' as '2-digit'
    };
    return date.toLocaleString('zh-TW', options);
  }

  cars: any;
  vehiclesData: any;

  // 取得車牌
  getAllVehiclesRequest() {
    this.carServ.getAllVehiclesRequest().subscribe({
      next: res => {
        this.vehiclesData = res.body.vehicles;
        this.cars = this.vehiclesData.map((item: any) => ({
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

  searchDay: any
  startTime: any
  endTime: any
  maxDate = new Date()

  getDefaultDate() {
    // 查詢日期預設為今天
    this.searchDay = new Date();
    // 開始時間預設為00:00
    this.startTime = new Date();
    this.startTime.setHours(0);
    this.startTime.setMinutes(0);
    // 結束時間預設為現在的時間
    this.endTime = new Date();
    this.endTime.setFullYear(this.searchDay.getFullYear());
    this.endTime.setMonth(this.searchDay.getMonth());
    this.endTime.setDate(this.searchDay.getDate());
    this.endTime.setHours(new Date().getHours());
    this.endTime.setMinutes(new Date().getMinutes());
    this.endTime.setSeconds(new Date().getSeconds());
  }

  onDateChange(event: any) {
    console.log('更新日期為 ',event)
    this.searchDay = event;
    this.onStartDateChange(event)
    this.onEndDateChange(event)
  }

  onStartDateChange(event: any) {
    const newStartTime = event;
    newStartTime.setHours(event.getHours(), event.getMinutes());
    this.startTime = newStartTime;
    console.log('更新開始時間為 ',this.startTime);
  }

  onEndDateChange(event: any) {
    const newEndTime = event;
    newEndTime.setHours(event.getHours(), event.getMinutes());
    this.endTime = newEndTime;
    console.log('更新結束時間為 ',this.endTime);
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
