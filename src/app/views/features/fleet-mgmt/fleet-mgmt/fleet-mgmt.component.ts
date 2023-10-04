import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CarService } from "../../../../services/car.service";
import { Router } from "@angular/router";
import { TabView } from "primeng/tabview";

@Component({
  selector: 'app-fleet-mgmt',
  templateUrl: './fleet-mgmt.component.html',
  styleUrls: ['./fleet-mgmt.component.scss']
})
export class FleetMgmtComponent {
  @ViewChild(TabView) tabView!: TabView;

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

  ngOnInit() {
    this.getAllVehiclesRequest()
  }

  tab: any
  getTabName(event: any) {
    const index = event.index;
    this.tab = this.tabView.tabs[index].header;
    console.log(this.tab);
  }

  cars: any;

  vehiclesData: any;

  // 取得車牌
  getAllVehiclesRequest() {
    this.carServ.getAllVehiclesRequest(1,20).subscribe({
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

  addDialogVisible = false;
  openAddCarDialog() {
    this.addDialogVisible = true;
  }

  postVehicleRequest() {
    let body = {
      fleet_id: this.addVehicle_form.controls['fleet_id'].value,
      name: this.addVehicle_form.controls['name'].value,
      driver: this.addVehicle_form.controls['driver'].value,
      license_plate: this.addVehicle_form.controls['license_plate'].value,
      sid: this.addVehicle_form.controls['sid'].value
    }
    this.carServ.postVehicleRequest(body).subscribe({
      next: data => {
        console.log(data)
        console.log(body)
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.getAllVehiclesRequest()
  }

  goToVehicle(id: any) {
    this.router.navigate(['/vehicle', id])
  }

}
