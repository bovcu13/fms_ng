import { Component, OnInit } from '@angular/core';
import { MenuItem } from "primeng/api";
import { testMenu } from "../../../shared/data/menu";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  userItems: MenuItem[] | undefined;
  sidebarMenu!: MenuItem[];
  testMenu: MenuItem[] = testMenu;
  sideVisible: boolean = false;

  constructor(
    private authServ: AuthService
  ) {
  }

  ngOnInit() {
    // userItems
    this.userItems = [
      {
        label: '帳號'
      },
      {
        label: '<div class="flex justify-content-center"><img style="width: 2rem" src="assets/image/car2.png"/></div><div class="font-bold text-xs text-center">bovcu13</div>',
        escape: false,
        items: [
          {
            label: '切換帳號',
            icon: 'pi pi-users',
          },
          {
            separator: true
          },
          {
            label: '登出',
            icon: 'pi pi-sign-out',
            command: () => {
              this.authServ.signOut();
            },
            routerLink: '/'
          }
        ]
      }
    ];

    // sidebarMenu
    this.sidebarMenu = [
      {
        label: '首頁',
        icon: 'pi pi-home',
        routerLink: '/main',
      },
      {
        label: '車隊監控管理(FMS)',
        icon: 'pi pi-fw pi-sitemap',
        items: [
          // {
          //   label: '區域監控',
          //   icon: 'pi pi-fw pi-box',
          //   routerLink: '/main',
          //   command: () => {
          //     this.sideVisible = false
          //   },
          //   style: {
          //     background: 'rgba(84, 200, 240, 0.1)'
          //   },
          // },
          {
            label: 'GPS圖台',
            icon: 'pi pi-map-marker',
            routerLink: '/multiCars',
            command: () => {
              this.sideVisible = false
            },
            style: {
              background: 'rgba(84, 200, 240, 0.1)'
            },
          },
          {
            label: '車機影像',
            icon: 'pi pi-fw pi-video',
            routerLink: '/monitor',
            command: () => {
              this.sideVisible = false
            },
            style: {
              background: 'rgba(84, 200, 240, 0.1)'
            },
          },
          {
            label: '車溫儀表板', //控溫中心
            icon: 'pi pi-chart-bar',
            command: () => {
              alert("功能未開放");
            },
          },
          {
            label: '行駛狀態列表',
            icon: 'pi pi-fw pi-box',
            routerLink: '/driving_status',
            command: () => {
              this.sideVisible = false
            },
            style: {
              background: 'rgba(84, 200, 240, 0.1)'
            },
          },
          {
            label: '歷史軌跡',
            icon: 'pi pi-directions-alt',
            routerLink: '/history',
            command: () => {
              this.sideVisible = false
            },
            style: {
              background: 'rgba(255, 192, 203, 0.4)'
            },
          },
          {
            label: '數位軌跡16-1報表',
            icon: 'pi pi-fw pi-chart-pie',
            items: [
              {
                label: '大餅報表',
                icon: 'pi pi-fw pi-chart-bar',
                routerLink: '/cake_report',
                command: () => {
                  this.sideVisible = false
                },
                style: {
                  background: 'rgba(255, 192, 203, 0.4)'
                },
              },
              {
                label: '大餅軌跡',
                icon: 'pi pi-fw pi-chart-line',
                command: () => {
                  alert("功能未開放");
                  this.sideVisible = false
                },
              },
            ]
          },
        ]
      },
      {
        label: '運輸調度管理(TMS)',
        icon: 'pi pi-truck',
        items: [
          {
            label: '運輸訂單',
            icon: 'pi pi-box',
            routerLink: '/dispatch_list',
            command: () => {
              this.sideVisible = false
            },
            style: {
              background: 'rgba(84, 200, 240, 0.1)',
            }
          },
          {
            label: '派工與調度',
            icon: 'pi pi-box',
            routerLink: '/dispatch',
            command: () => {
              this.sideVisible = false
            },
            style: {
              background: 'rgba(84, 200, 240, 0.1)',
            }
          },
          {
            label: '貨態追蹤',
            icon: 'pi pi-box',
            routerLink: '/e_tracking',
            command: () => {
              this.sideVisible = false
            },
            style: {
              background: 'rgba(84, 200, 240, 0.1)',
            }
          },
        ]
      },
      {
        label: '行政管理中心',
        icon: 'pi pi-briefcase',
        items: [
          {
            label: '推播訊息',
            icon: 'pi pi-volume-up',
            command: () => {
              alert("功能未開放");
            },
          },
          {
            label: '倉儲管理',
            icon: 'pi pi-fw pi-box',
            routerLink: '/warehouse_list',
            command: () => {
              this.sideVisible = false
            },
            style: {
              background: 'rgba(84, 200, 240, 0.1)',
            }
          },
          {
            label: '客戶管理',
            icon: 'pi pi-users',
            routerLink: '/customer',
            command: () => {
              this.sideVisible = false
            },
            style: {
              background: 'rgba(84, 200, 240, 0.1)',
            }
          },
          {
            label: '車隊管理',
            icon: 'pi pi-shield',
            routerLink: '/fleet_mgmt',
            command: () => {
              this.sideVisible = false
            },
            style: {
              background: 'rgba(255, 192, 203, 0.4)'
            },
          },
          {
            label: '司機管理',
            icon: 'pi pi-shield',
            items: [
              {
                label: '司機',
                icon: 'pi pi-shield',
                routerLink: '/driver',
                command: () => {
                  this.sideVisible = false
                },
                style: {
                  background: 'rgba(255, 192, 203, 0.4)'
                },
              },
              {
                label: '出勤記錄',
                icon: 'pi pi-fw pi-box',
                command: () => {
                  alert("功能未開放");
                  this.sideVisible = false
                },
              },
              {
                label: '統計報告',
                icon: 'pi pi-fw pi-box',
                items: [
                  {
                    label: '檢查表設定',
                    icon: 'pi pi-fw pi-box',
                    command: () => {
                      alert("功能未開放");
                      this.sideVisible = false
                    },
                  },
                  {
                    label: '自主檢查表',
                    icon: 'pi pi-fw pi-box',
                    command: () => {
                      alert("功能未開放");
                      this.sideVisible = false
                    },
                  },
                  {
                    label: '未做檢查表',
                    icon: 'pi pi-fw pi-box',
                    command: () => {
                      alert("功能未開放");
                      this.sideVisible = false
                    },
                  }
                ]
              },
            ]
          },
          {
            label: '統計分析報告',
            icon: 'pi pi-fw pi-chart-line',
            items: [
              {
                label: '紀錄列表',
                icon: 'pi pi-fw pi-box',
                routerLink: '/record',
                command: () => {
                  this.sideVisible = false
                },
                style: {
                  background: 'rgba(84, 200, 240, 0.1)'
                },
              },
              {
                label: '里程統計',
                icon: 'pi pi-fw pi-box',
                routerLink: '/mile',
                command: () => {
                  this.sideVisible = false
                },
                style: {
                  background: 'rgba(84, 200, 240, 0.1)'
                },
              },
              {
                label: '地標統計',
                icon: 'pi pi-fw pi-box',
                command: () => {
                  alert("功能未開放");
                  this.sideVisible = false
                },
              },
              {
                label: '國道計費',
                icon: 'pi pi-fw pi-box',
                command: () => {
                  alert("功能未開放");
                  this.sideVisible = false
                },
              },
              {
                label: '多工日報',
                icon: 'pi pi-fw pi-box',
                command: () => {
                  alert("功能未開放");
                  this.sideVisible = false
                },
              },
              {
                label: '溫度曲線圖',
                icon: 'pi pi-fw pi-box',
                command: () => {
                  alert("功能未開放");
                  this.sideVisible = false
                },
              },
              {
                label: '多公彙總表',
                icon: 'pi pi-fw pi-box',
                command: () => {
                  alert("功能未開放");
                  this.sideVisible = false
                },
              },
              {
                label: '均溫報表',
                icon: 'pi pi-fw pi-box',
                command: () => {
                  alert("功能未開放");
                  this.sideVisible = false
                },
              },
              {
                label: '績效',
                icon: 'pi pi-fw pi-box',
                command: () => {
                  alert("功能未開放");
                  this.sideVisible = false
                },
              },
              {
                label: '異常報表',
                icon: 'pi pi-fw pi-exclamation-triangle',
                items: [
                  {
                    label: '異常總表',
                    icon: 'pi pi-fw pi-box',
                    routerLink: '/odd_report',
                    command: () => {
                      this.sideVisible = false
                    },
                    style: {
                      background: 'rgba(84, 200, 240, 0.1)'
                    },
                  },
                  {
                    label: '超速時間',
                    icon: 'pi pi-fw pi-box',
                    routerLink: '/speeding',
                    command: () => {
                      this.sideVisible = false
                    },
                    style: {
                      background: 'rgba(84, 200, 240, 0.1)'
                    },
                  },
                  {
                    label: '停不熄火',
                    icon: 'pi pi-fw pi-box',
                    routerLink: '/stall',
                    command: () => {
                      this.sideVisible = false
                    },
                    style: {
                      background: 'rgba(84, 200, 240, 0.1)'
                    },
                  },
                  {
                    label: '溫度異常',
                    icon: 'pi pi-fw pi-box',
                    routerLink: '/odd_temp',
                    command: () => {
                      this.sideVisible = false
                    },
                    style: {
                      background: 'rgba(84, 200, 240, 0.1)'
                    },
                  }
                ]
              },
            ]
          },
          {
            label: '設定',
            icon: 'pi pi-fw pi-cog',
            items: [
              {
                label: '基本資料',
                icon: 'pi pi-fw pi-box',
                routerLink: '/basic_data',
                command: () => {
                  this.sideVisible = false
                },
                style: {
                  background: 'rgba(84, 200, 240, 0.1)'
                },
              },
              {
                label: '異常設定',
                icon: 'pi pi-fw pi-box',
                // routerLink: '/odd_set',
                command: () => {
                  alert("功能未開放");
                  this.sideVisible = false
                },
                style: {
                  background: 'rgba(84, 200, 240, 0.1)'
                },
              },
              {
                label: '自建地標',
                icon: 'pi pi-fw pi-box',
                command: () => {
                  alert("功能未開放");
                  this.sideVisible = false
                },
              },
              {
                label: '權限分享',
                icon: 'pi pi-fw pi-box',
                command: () => {
                  alert("功能未開放");
                  this.sideVisible = false
                },
              },
              {
                label: '駕駛紀錄',
                icon: 'pi pi-fw pi-box',
                command: () => {
                  alert("功能未開放");
                  this.sideVisible = false
                },
              }
            ]
          },
        ]
      },
      {
        label: '永續與低碳運輸計畫',
        icon: 'pi pi-globe',
        command: () => {
          alert("功能未開放");
          this.sideVisible = false
        },
      },
      {
        label: '平台服務專區',
        icon: 'pi pi-fw pi-cog',
        items: [
          {
            label: 'Skynet Premium',
            icon: 'pi pi-heart-fill',
            routerLink: '/premium',
            command: () => {
              this.sideVisible = false
            },
            style: {
              background: 'rgba(84, 200, 240, 0.1)',
            },
          },
          {
            label: '車機報修',
            icon: 'pi pi-heart-fill',
            routerLink: '',
            command: () => {
              alert("功能未開放");
              this.sideVisible = false
            },
            style: {},
          },
          {
            label: '聯絡我們',
            icon: 'pi pi-fw pi-box',
            command: () => {
              alert("功能未開放");
              this.sideVisible = false
            },
          },
          {
            label: '最新消息',
            icon: 'pi pi-fw pi-box',
            command: () => {
              alert("功能未開放");
              this.sideVisible = false
            },
          },
        ]
      },
      {
        label: '更新日誌',
        icon: 'pi pi-book',
        routerLink: '/log',
        command: () => {
          this.sideVisible = false
        },
        style: {
          background: 'rgba(220,250,220,0.6)',
        },
      },
      {
        label: 'FMP-功能清單',
        icon: 'pi pi-google',
        style: {
          background: 'rgba(220,250,220,0.6)',
        },
        url: 'https://docs.google.com/spreadsheets/d/1E3c_g36atRFDkZRQkvwTOzWWXnATkNnwX0bcMW5atL0/edit#gid=0'
      },
      // {
      //   label: 'rtsp測試',
      //   icon: 'pi pi-code',
      //   routerLink: '/test'
      // }
    ]
  }
}
