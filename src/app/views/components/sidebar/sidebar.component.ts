import { Component, OnInit } from '@angular/core';
import { MenuItem } from "primeng/api";
import { sidebarMenu, testMenu } from "../../../shared/data/menu";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  sidebarMenu!: MenuItem[];
  testMenu: MenuItem[] = testMenu;
  sideVisible: boolean = false;

  ngOnInit() {
    this.sidebarMenu = [
      {
        label: '監控查詢',
        icon: 'pi pi-fw pi-sitemap',
        expanded: true,
        items: [
          {
            label: '區域監控',
            icon: 'pi pi-fw pi-box',
            routerLink: '/main',
            command:() =>{
              this.sideVisible = false
            },
            style: {
              background: 'rgba(250,245,200,0.6)'
            },
          },
          {
            label: '多車監控',
            icon: 'pi pi-fw pi-box',
            routerLink: '/multiCars',
            command:() =>{
              this.sideVisible = false
            },
            style: {
              background: 'rgba(250,245,200,0.6)'
            },
          },
          {
            label: '影像監控',
            icon: 'pi pi-fw pi-video',
            routerLink: '/monitor',
            command:() =>{
              this.sideVisible = false
            },
            style: {
              background: 'rgba(250,245,200,0.6)'
            },
          },
          {
            label: '行駛狀態表',
            icon: 'pi pi-fw pi-box',
            routerLink: '/driving_status',
            command:() =>{
              this.sideVisible = false
            },
            style: {
              background: 'rgba(250,245,200,0.6)'
            },
          },
          {
            label: '歷史軌跡',
            icon: 'pi pi-fw pi-box',
            routerLink: '/history',
            command:() =>{
              this.sideVisible = false
            },
            style: {
              background: 'rgba(250,245,200,0.6)'
            },
          }
        ]
      },
      {
        label: '數位大餅',
        icon: 'pi pi-fw pi-chart-pie',
        expanded: true,
        items: [
          {
            label: '大餅報表',
            icon: 'pi pi-fw pi-chart-bar',
            routerLink: '/cake_report',
            command: () => {
              this.sideVisible = false
            },
            style: {
              background: 'rgba(250,245,200,0.6)'
            },
          },
          {
            label: '大餅軌跡',
            icon: 'pi pi-fw pi-chart-line'
          },
        ]
      },
      {
        label: '溫控中心',
        icon: 'pi pi-fw pi-box',
        items: [
          {
            label: '溫度儀表板',
            icon: 'pi pi-fw pi-box'
          },
          {
            label: '溫度報表',
            icon: 'pi pi-fw pi-chart-bar'
          },
        ]
      },
      {
        label: '統計查詢',
        expanded: true,
        icon: 'pi pi-fw pi-box',
        items: [
          {
            label: '紀錄列表',
            icon: 'pi pi-fw pi-box',
            routerLink: '/record',
            command:() =>{
              this.sideVisible = false
            },
            style: {
              background: 'rgba(250,245,200,0.6)'
            },
          },
          {
            label: '里程統計',
            icon: 'pi pi-fw pi-box'
          },
          {
            label: '地標統計',
            icon: 'pi pi-fw pi-box'
          },
          {
            label: '國道計費',
            icon: 'pi pi-fw pi-box'
          },
          {
            label: '多工日報',
            icon: 'pi pi-fw pi-box'
          },
          {
            label: '溫度曲線圖',
            icon: 'pi pi-fw pi-box'
          },
          {
            label: '多公彙總表',
            icon: 'pi pi-fw pi-box'
          },
          {
            label: '均溫報表',
            icon: 'pi pi-fw pi-box'
          },
        ]
      },
      {
        label: '駕駛統計',
        icon: 'pi pi-fw pi-box',
        items: [
          {
            label: '檢查表設定',
            icon: 'pi pi-fw pi-box'
          },
          {
            label: '自主檢查表',
            icon: 'pi pi-fw pi-box'
          },
          {
            label: '未做檢查表',
            icon: 'pi pi-fw pi-box'
          }
        ]
      },
      {
        label: '異常報表',
        icon: 'pi pi-fw pi-exclamation-triangle',
        expanded: true,
        items: [
          {
            label: '異常總表',
            icon: 'pi pi-fw pi-box',
            routerLink: '/odd_report',
            command: () => {
              this.sideVisible = false
            },
            style: {
              background: 'rgba(250,245,200,0.6)'
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
              background: 'rgba(250,245,200,0.6)'
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
              background: 'rgba(250,245,200,0.6)'
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
              background: 'rgba(250,245,200,0.6)'
            },
          }
        ]
      },
      {
        label: '基本設定',
        icon: 'pi pi-fw pi-cog',
        expanded: true,
        items: [
          {
            label: '基本資料',
            icon: 'pi pi-fw pi-box',
            routerLink: '/basic_data',
            command: () => {
              this.sideVisible = false
            },
            style: {
              background: 'rgba(250,245,200,0.6)'
            },
          },
          {
            label: '異常設定',
            icon: 'pi pi-fw pi-box',
            routerLink: '/odd_set',
            command: () => {
              this.sideVisible = false
            },
            style: {
              background: 'rgba(250,245,200,0.6)'
            },
          },
          {
            label: '自建地標',
            icon: 'pi pi-fw pi-box'
          },
          {
            label: '權限分享',
            icon: 'pi pi-fw pi-box'
          },
          {
            label: '駕駛紀錄',
            icon: 'pi pi-fw pi-box'
          }
        ]
      },
      {
        label: '服務專區',
        icon: 'pi pi-fw pi-box',
        items: [
          {
            label: '聯絡我們',
            icon: 'pi pi-fw pi-box'
          },
          {
            label: '最新產品',
            icon: 'pi pi-fw pi-box'
          },
          {
            label: '紅利積點',
            icon: 'pi pi-fw pi-box'
          }
        ]
      },
      {
        label: '車隊管理',
        icon: 'pi pi-shield',
        expanded: true,
        items: [
          {
            label: '司機',
            icon: 'pi pi-shield',
            routerLink: '/role',
            command:() =>{
              this.sideVisible = false
            },
          },
          {
            label: '車輛',
            icon: 'pi pi-shield',
            routerLink: '/role',
            command:() =>{
              this.sideVisible = false
            },
          },
          {
            label: '付費訂閱',
            icon: 'pi pi-shield',
            routerLink: '/role',
            command:() =>{
              this.sideVisible = false
            },
          },
        ]
      },
      {
        label: '更新日誌',
        icon: 'pi pi-book',
        routerLink: '/log',
        command:() =>{
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
