import { Component, OnInit } from '@angular/core';
import { CarService } from "../../../../services/car.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class VehicleComponent implements OnInit {

  activeIndex = 1;

  id: any;

  editVehicle_form: FormGroup;

  constructor(
    private carServ: CarService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.editVehicle_form = this.fb.group({
      license_plate: ['', [Validators.required]],
      sid: ['', [Validators.required]],
      name: ['', [Validators.required]],
      driver: ['', Validators.required],
      fuel: ['', Validators.required],
      fuel_type: ['', Validators.required],
      vehicle_type: ['', Validators.required],
      vehicle_style: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getOneVehicleRequest()
  }

  vehiclesData: any;

  // 取得Vehicle Data
  getOneVehicleRequest() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.carServ.getOneVehicleRequest(this.id).subscribe({
      next: res => {
        this.vehiclesData = res.body;
        this.putVehicleData(this.vehiclesData)
        console.log(this.vehiclesData);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  putVehicleData(data: any) {
    this.editVehicle_form.patchValue(data)
  }

  updateVehicleRequest(id: string, body: any) {
    this.confirmationService.confirm({
      message: `確定要儲存 ${this.editVehicle_form.controls['license_plate'].value} 的修改？`,
      header: '確定修改？',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.carServ.patchVehicleRequest(id, body).subscribe({
          next: res => {
            console.log(res);
            this.showSussess('修改');
          },
          error: (err) => {
            console.log(err);
            this.showError('修改');
          },
        });
      },
      reject: () => {
        this.showCancel('修改');
      }
    });
  }

  deleteVehicleRequest() {
    console.log('open')
    this.confirmationService.confirm({
      message: `確定要刪除 ${this.editVehicle_form.controls['name'].value} 嗎？`,
      header: '確定刪除？',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.carServ.deleteVehicleRequest(this.id).subscribe({
          next: res => {
            console.log('deleteDriver', res);
            this.showSussess('刪除');
            this.router.navigate(['/fleet_mgmt',this.activeIndex]);
          },
          error: (err) => {
            console.log('err', err);
            this.showError('刪除');
          }
        })
      },
      reject: () => {
        this.showCancel('刪除');
      }
    });
  }

  showSussess(info = '修改') {
    this.messageService.add({ severity: 'success', summary: '完成', detail: `${info}成功！` });
  }

  showError(info = '修改') {
    this.messageService.add({ severity: 'error', summary: '錯誤', detail: `${info}失敗！` });
  }

  showCancel(info: string = '修改') {
    this.messageService.add({ severity: 'warn', summary: '取消', detail: `取消${info}！` });
  }

}
