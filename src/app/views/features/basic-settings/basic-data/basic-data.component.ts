import { Component, OnInit } from '@angular/core';
import { carData } from "../../../../shared/data/products";
import { CarService } from "../../../../services/car.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

interface Language {
  name: string;
  code: string;
}

@Component({
  selector: 'app-basic-data',
  templateUrl: './basic-data.component.html',
  styleUrls: ['./basic-data.component.scss']
})
export class BasicDataComponent implements OnInit {
  carData :any[] = carData;
  addVehicle_form: FormGroup;

  constructor(private carServ: CarService,
              private fb: FormBuilder,
              private router: Router) {
    this.addVehicle_form = this.fb.group({
      fleet_id: ['c2d40ef0-341a-4793-b1b3-f4e4f82ba9f2', [Validators.required]],
      name: ['', [Validators.required]],
      driver: ['', [Validators.required]],
      license_plate: ['', Validators.required],
      sid: ['', Validators.required]
    });
  }

  language : Language[] | undefined;

  ngOnInit() {
    this.language = [
      { name: '繁體中文', code: 'zh-TW' },
      { name: '簡體中文', code: 'zh-CN' },
      { name: '日文', code: 'JA' },
      { name: '英文', code: 'EN' },
    ];
    this.getAllVehiclesRequest()
  }

  cars: any;

  vehiclesData: any;

  // 取得車牌
  getAllVehiclesRequest() {
    this.carServ.getAllVehiclesRequest(1,2).subscribe({
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

  goToVehicle(id: any) {
    this.router.navigate(['/vehicle', id])
  }

}
