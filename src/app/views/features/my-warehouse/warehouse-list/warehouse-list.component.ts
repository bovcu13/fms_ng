import { Component } from '@angular/core';
import { CarService } from "../../../../services/car.service";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-warehouse-list',
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.scss']
})
export class WarehouseListComponent {
  warehousesData = [
    {
      id: 1,
      name: 'A 倉庫',
      manager: 'A 管理員',
      address: '台北市中山區'
    }
  ]

  constructor(
    private carServ: CarService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router ) {
  }

  goToWarehouse(id: any) {
    this.router.navigate(['/warehouse_list', id])
  }
}
