import { Component } from '@angular/core';
import { carData } from "../../../../shared/data/products";

@Component({
  selector: 'app-basic-data',
  templateUrl: './basic-data.component.html',
  styleUrls: ['./basic-data.component.scss']
})
export class BasicDataComponent {
carData :any[] = carData
}
