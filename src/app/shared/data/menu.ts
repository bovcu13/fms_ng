export const sidebarMenu = [
  {
    label: '監控查詢',
    icon: 'pi pi-fw pi-sitemap',
    items: [
      {
        label: '影像監控',
        icon: 'pi pi-fw pi-video',
        routerLink: '/monitor',
        style: {
          background: 'rgba(250,245,200,0.6)'
        },
      },
      {
        label: '區域監控',
        icon: 'pi pi-fw pi-box'
      },
      {
        label: '多車監控',
        icon: 'pi pi-fw pi-box'
      },
      {
        label: '歷史軌跡',
        icon: 'pi pi-fw pi-box'
      }
    ]
  },
  {
    label: '統計查詢',
    icon: 'pi pi-fw pi-chart-bar',
    items: [
      {
        label: '功能一',
        icon: 'pi pi-fw pi-box'

      },
      {
        label: '功能二',
        icon: 'pi pi-fw pi-box'
      },
      {
        label: '功能三',
        icon: 'pi pi-fw pi-box'
      }
    ]
  },
  {
    label: '異常報表',
    icon: 'pi pi-fw pi-exclamation-triangle',
    items: [
      {
        label: '功能一',
        icon: 'pi pi-fw pi-box'

      },
      {
        label: '功能二',
        icon: 'pi pi-fw pi-box'
      },
      {
        label: '功能三',
        icon: 'pi pi-fw pi-box'
      }
    ]
  },
  {
    label: '基本設定',
    icon: 'pi pi-fw pi-cog',
    items: [
      {
        label: '功能一',
        icon: 'pi pi-fw pi-box'

      },
      {
        label: '功能二',
        icon: 'pi pi-fw pi-box'
      },
      {
        label: '功能三',
        icon: 'pi pi-fw pi-box'
      }
    ]
  },
  {
    label: '權限管理',
    icon: 'pi pi-shield',
    routerLink: '/role',
    style: {
      background: 'rgba(250,245,200,0.6)',
    },
  },
  {
    label: '更新日誌',
    icon: 'pi pi-book',
    routerLink: '/log',
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
  {
    label: 'rtsp測試',
    icon: 'pi pi-code',
    routerLink: '/test'
  }
]
