import { Component, OnInit } from '@angular/core';
import { CarService } from "../../../../services/car.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";

@Component({
  selector: 'app-gps-device',
  templateUrl: './gps-device.component.html',
  styleUrls: ['./gps-device.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class GpsDeviceComponent implements OnInit {
  activeIndex = 2;
  editGpsDevice_form: FormGroup;
  id: any;

  constructor(
    private carServ: CarService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.editGpsDevice_form = this.fb.group({
      firm: ['', Validators.required],
      id: ['', Validators.required],
      model: ['', Validators.required],
      sid: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getOneGpsDeviceRequest(this.id);
  }

  getOneGpsDeviceRequest(id: string) {
    this.carServ.getGpsDeviceRequest(id).subscribe({
      next: res => {
        this.editGpsDevice_form.patchValue(res.body);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  deleteGpsDeviceRequest() {
    console.log('open')
    this.confirmationService.confirm({
      message: `確定要刪除 ${this.editGpsDevice_form.controls['sid'].value} 嗎？`,
      header: '確定刪除？',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.carServ.deleteGpsDeviceRequest(this.id).subscribe({
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
    this.messageService.add({severity: 'success', summary: '完成', detail: `${info}成功！`});
  }

  showError(info = '修改') {
    this.messageService.add({severity: 'error', summary: '錯誤', detail: `${info}失敗！`});
  }

  showCancel(info: string = '修改') {
    this.messageService.add({severity: 'warn', summary: '取消', detail: `取消${info}！`});
  }
}
