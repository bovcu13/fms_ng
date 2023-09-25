import { Component, OnInit } from '@angular/core';
import { CarService } from "../../../../services/car.service";

@Component({
  selector: 'app-speeding',
  templateUrl: './speeding.component.html',
  styleUrls: ['./speeding.component.scss']
})
export class SpeedingComponent implements OnInit {
  constructor(private carServ: CarService) {
  }

  ngOnInit() {
    this.getAllVehiclesRequest()
    this.getDefaultDate()
  }

  road = [
    { name: '全部道路', code: 'all' },
    { name: '國道', code: 'NE' },
    { name: '快速道路', code: 'E' },
    { name: '省道', code: 'PH' },
    { name: '縣道', code: 'CH' },
    { name: '鄉道', code: 'RH' },
    { name: '其他道路', code: 'other' }
  ];

  cars: any;
  vehiclesData: any;

  // 取得車牌
  getAllVehiclesRequest() {
    this.carServ.getAllVehiclesRequest().subscribe({
      next: res => {
        this.vehiclesData = res.body.vehicles;
        this.cars = this.vehiclesData.map((item:any) => ({
          name: item.license_plate,
          code: item.license_plate
        }));
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  startDate: any
  endDate: any
  maxDate = new Date()

  getDefaultDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to 00:00:00.000
    this.startDate = today
    this.endDate = new Date();
  }

  onStartDateChange(event: any) {
    this.startDate = event;
  }

  onEndDateChange(event: any) {
    this.endDate = event;
  }

  sidebarRightOpen = true;

  toggleSidebar() {
    this.sidebarRightOpen = !this.sidebarRightOpen;
  }

  getMiddleDivClass() {
    if (this.sidebarRightOpen) {
      return 'col-12 md:col-12 lg:col-9';
    } else {
      return 'col-12 md:col-12 lg:col-12';
    }
  }
}
