import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent {
  @Input() warehouseId: any; // 定義 productId 作為輸入屬性
}
