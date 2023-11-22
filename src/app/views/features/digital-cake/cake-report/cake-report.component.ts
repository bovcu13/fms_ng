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
  }

  test: any;
  // 數位大餅
  data: any
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

  // 傳統大餅
  cakeData: any
  cakeOptions: any

  initCake() {
    this.speedData = this.convertValues(this.speedData)
    console.log("convertSpeedData:", this.speedData)
    const hours = Array.from({ length: 25 }, (_, i) => i < 10 ? '0' + i + ':00' : i + ':00');

    this.cakeData = {
      labels: this.timeData,
      datasets: [{
        label: '時速',
        data: this.speedData,
        fill: false,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
      }, {
        label: '行駛距離',
        data: [],
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
          max: 180, // 調整最大值為180
          min: 0,
          ticks: {
            stepSize: 10,
            callback: function(value: any, index: any, values: any) {
              // 實際的數值進行線性映射
              var mappedValue = (value / 180) * 120;

              // 自定義刻度的標籤
              var customLabels = ['0', '1', '2', '3', '4', '5', '0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100', '110', '120'];

              // 返回自定義標籤
              return customLabels[index % customLabels.length];
            }
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
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context: any) {
              let label = context.dataset.label || '';

              if (label) {
                // console.log("label:", label)
                // console.log("context.parsed:", context.parsed)
                label += ': ';
              }

              if (context.parsed.r !== null) {
                // 將原本的美元格式改為資料減去60的數值
                label += (context.parsed.r - 60).toString();
              }

              return label;
            }
          }
        }
      }
    };
  }

  loading = false;
  search() {
    if (this.plate) {
      this.getAllGpsRequest(this.plate, { filter: { start_time: this.startTime, end_time: this.endTime } })
      console.log("開始：", this.startTime, "結束：", this.endTime)
    }
  }

  plate: any;
  selectCar(event: any) {
    console.log(event)
    this.plate = event;
  }

  transformedData: any
  timeData: any
  speedData: any

  // 取得車輛歷史資料
  getAllGpsRequest(id: any, body: any) {
    this.carServ.getAllGpsRequest(id, body).subscribe({
      next: (res) => {
        this.loading = true;
        const getData = res.body.gps;
        console.log("來源資料:", res.body.gps);

        this.transformedData = getData.map((item: any) => ({
          ...item,
          direction: this.parseHeading(item.heading)
        }));
        console.log("轉換後資料:", this.transformedData);

        // chart用到的資料拆解
        this.timeData = getData.map((item: any) =>
          this.getTimeFromDateTime(item.date_time)
        );
        this.speedData = getData.map((item: any) =>
          item.speed
        );

        console.log("timeData:", this.timeData)
        console.log("speedData:", this.speedData)

        // 產生chart
        this.initChart();
        this.initCake();

        this.loading = false;
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

  // 換算速率資料 (maybe)
  convertValues(inputArray: any[]) {
    // 基準值
    const baseValue = 60;

    // 使用 map 方法對每個數字進行換算
    const convertValues = inputArray.map(value => baseValue + value);

    return convertValues;
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
