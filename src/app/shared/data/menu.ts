export const sidebarMenu = [
  {
    label: '監控查詢',
    icon: 'pi pi-fw pi-sitemap',
    items: [
      {
        label: '影像監控',
        icon: 'pi pi-fw pi-video',
        routerLink: '/monitor'
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
    routerLink: '/role'
  }
]
