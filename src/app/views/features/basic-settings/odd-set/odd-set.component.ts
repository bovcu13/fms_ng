import { Component } from '@angular/core';
import { odd } from "../../../../shared/data/products";

@Component({
  selector: 'app-odd-set',
  templateUrl: './odd-set.component.html',
  styleUrls: ['./odd-set.component.scss']
})
export class OddSetComponent {
  odd: any[] = odd

  toggleAdditionalContent(product: any) {
    product.showAdditionalContent = !product.showAdditionalContent; // 切換狀態
  }
}
