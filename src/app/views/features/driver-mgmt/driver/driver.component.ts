import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CarService} from "../../../../services/car.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss']
})
export class DriverComponent implements OnInit {

  addDriver_form: FormGroup;
  addDialogVisible = false;
  cars: any;
  vehiclesData: any;

  constructor(
    private carServ: CarService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.addDriver_form = this.fb.group({
      employee_id: [''],
      driver: ['', Validators.required],
      mobile_phone: [''],
      id_number: [''],
      employee_number: [''],
      email: [''],
      address: [''],
      daily_cost: [''],
      created_at: [''],
      created_by: [''],
      updated_at: [''],
      updated_by: [''],
    });
  }

  ngOnInit() {
    this.getAllVehiclesRequest()
  }

  // 取得車牌
  getAllVehiclesRequest() {
    this.carServ.getAllVehiclesRequest(1, 20).subscribe({
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

// 新增司機
  addDriverRequest() {
    this.addDialogVisible = false;
    // this.carServ.postVehicleRequest(this.addDriver_form.value).subscribe({
    //   next: res => {
    //     this.addDialogVisible = false;
    //     this.getAllVehiclesRequest();
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   },
    // });
  }

  goToDriver(id: any) {
    this.router.navigate(['/driver', id])
  }
}
