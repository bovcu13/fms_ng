import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-esg-dashboard',
  templateUrl: './esg-dashboard.component.html',
  styleUrls: ['./esg-dashboard.component.scss']
})
export class EsgDashboardComponent implements OnInit {


  ngOnInit() {
    this.initChart1();
    this.initChart2();
  }

  data1: any;
  options1: any;
  initChart1() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data1 = {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月','9月', '10月', '11月', '12月'], // 'January', 'February', 'March', 'April', 'May', 'June', 'July
      datasets: [
        {
          label: 'First Dataset',
          data: [23, 10, 42, 6, 35, 17, 48, 29, 3, 14, 38, 7],
          fill: false,
          tension: 0.4,
          borderColor: documentStyle.getPropertyValue('--blue-500')
        },
        {
          label: 'Second Dataset',
          data: [19, 45, 8, 30, 11, 26, 2, 41, 5, 13, 36, 49],
          fill: false,
          borderDash: [5, 5],
          tension: 0.4,
          borderColor: documentStyle.getPropertyValue('--teal-500')
        },
      ]
    };

    this.options1 = {
      maintainAspectRatio: false,
      aspectRatio: 1.5,
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
            color: surfaceBorder
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    };
  }

  data2: any;
  options2: any;

  initChart2() {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      this.data2 = {
        labels: ['A', 'B', 'C'],
        datasets: [
          {
            data: [540, 325, 702],
            backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
            hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
          }
        ]
      };

      this.options2 = {
        aspectRatio: 1.5,
        plugins: {
          legend: {
            display: true,
            position: 'right', // 将标签显示在右侧
            align: 'center', // 使标签水平居中
            labels: {
              usePointStyle: true,
              color: textColor
            }
          }
        }
      };
    }
}
