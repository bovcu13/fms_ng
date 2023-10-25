import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent {
  @Input() warehouseId: any; // 定義 productId 作為輸入屬性

  warehouses = [
    {name: 'New York', code: 'NY'},
    {name: 'Rome', code: 'RM'},
    {name: 'London', code: 'LDN'},
    {name: 'Istanbul', code: 'IST'},
    {name: 'Paris', code: 'PRS'}
  ];

  warehousesData = [
    {
      id: 1,
      name: 'A 倉庫',
      manager: 'A 管理員',
      address: '台北市中山區'
    }
  ]

  goodsData = [
    {
      id: 1,
      name: '筆記本電腦',
      spec: '15吋, Intel Core i7, 512GB SSD',
      quantity: 2,
      unit: '台',
      price: 999.99,
      total: 1999.98,
    },
    {
      id: 2,
      name: '4K LED 電視',
      spec: '55吋, Smart TV',
      quantity: 1,
      unit: '台',
      price: 699.99,
      total: 699.99,
    },
    {
      id: 3,
      name: '耳機',
      spec: '無線藍牙, 降噪功能',
      quantity: 5,
      unit: '對',
      price: 149.99,
      total: 749.95,
    },
    {
      id: 4,
      name: '咖啡機',
      spec: '單杯咖啡機, 咖啡膠囊',
      quantity: 3,
      unit: '台',
      price: 79.99,
      total: 239.97,
    }
  ]

  editManagerVisable = false;
  showEditManager() {
    this.editManagerVisable = true;
  }
}
