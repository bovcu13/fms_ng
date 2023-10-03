import { Component, OnInit } from '@angular/core';
import { CarService } from "../../../../services/car.service";

@Component({
  selector: 'app-temp-dashboard',
  templateUrl: './temp-dashboard.component.html',
  styleUrls: ['./temp-dashboard.component.scss']
})
export class TempDashboardComponent implements OnInit {
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
}
