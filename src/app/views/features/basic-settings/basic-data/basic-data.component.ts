import { Component, OnInit } from '@angular/core';
import { carData } from "../../../../shared/data/products";
import { CarService } from "../../../../services/car.service";

@Component({
  selector: 'app-basic-data',
  templateUrl: './basic-data.component.html',
  styleUrls: ['./basic-data.component.scss']
})
export class BasicDataComponent implements OnInit {
  carData :any[] = carData;

  constructor(private carServ: CarService) {
  }

  ngOnInit() {
    this.getAllVehiclesRequest()
  }

  cars: any;

  vehiclesData: any;

  // 取得車牌
  getAllVehiclesRequest() {
    this.carServ.getAllVehiclesRequest().subscribe({
      next: res => {
        this.vehiclesData = res.body.vehicles;
        this.cars = this.vehiclesData.map((item: any) => ({
          name: item.license_plate,
          code: item.license_plate
        }));
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  editable = false;
  edit() {
    this.editable = true;
  }
  save() {
    this.editable = false;
  }
  cancel() {
    this.editable = false;
  }
}
