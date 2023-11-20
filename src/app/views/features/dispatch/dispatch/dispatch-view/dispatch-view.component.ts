import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CarService } from "../../../../../services/car.service";
import { DispatchService } from "../../../../../services/dispatch.service";
import { ConfirmationService, MessageService } from "primeng/api";

@Component({
  selector: 'app-dispatch-view',
  templateUrl: './dispatch-view.component.html',
  styleUrls: ['./dispatch-view.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class DispatchViewComponent implements OnInit {
  id: any = 0;

  event_form: FormGroup;

  constructor(
    private carServ: CarService,
    private dispatchServ: DispatchService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');

    this.event_form = this.fb.group({
      id: ['', Validators.required],
      title: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      // end_date: ['', [Validators.required]],
      form: [''],
      driver: [''],
      vehicle: [''],
      description: [''],
      created_at: [''],
      updated_at: [''],
      created_by: [''],
      updated_by: [''],
    });
  }

  ngOnInit(): void {
    this.getOneTransportTask(this.id);
    this.getAllTransportOrder();
    this.getAllDriversRequest();
    this.getAllVehiclesRequest();
  }

  formList: any = [];

  getOneTransportTask(id: string) {
    this.dispatchServ.getOneTransportTask(id).subscribe({
      next: res => {
        console.log('getOneTransportTask:', res.body);
        // 取得派工任務的託運訂單
        this.formList = res.body.form;
        console.log('formList:', this.formList);

        this.event_form.patchValue(res.body);

        // 只取託運訂單名稱陣列
        const formArray = this.formList.map((item: any) => ({ name: item.name }));
        this.event_form.patchValue({
          form: formArray,
          driver: {
            name: res.body.driver_name,
            id: res.body.driver_id,
          },
          vehicle: {
            name: res.body.vehicle_name,
            id: res.body.vehicle_id,
          },
        });

        this.formName = this.formList[0].name;
        this.shipList = this.formList[0].shipping_list;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // 取得表單
  formData: any;

  getAllTransportOrder() {
    this.dispatchServ.getAllTransportOrder().subscribe({
      next: res => {
        this.formData = res.body.transport_orders.map((item: any) => ({
          name: item.name,
        }));
        console.log('formData:', this.formData)
      },
      error: (err) => {
        console.log('getAllTransportOrderError:', err);
      },
    });
  }

  // 司機
  driverData: any

  getAllDriversRequest() {
    this.carServ.getAllDriversRequest().subscribe({
      next: res => {
        this.driverData = res.body.drivers.map((item: any) => ({
          name: item.name,
          id: item.id
        }));
        console.log('driverData:', this.driverData);
      },
      error: (err) => {
        console.log('getAllDriversRequestError:', err);
      },
    });
  }

  // 車輛
  vehiclesData: any;

  getAllVehiclesRequest() {
    this.carServ.getAllVehiclesRequest(1, 20).subscribe({
      next: res => {
        this.vehiclesData = res.body.vehicles.map((item: any) => ({
          name: item.name,
          id: item.id
        }));
        console.log('vehiclesData:', this.vehiclesData);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // order-list
  formName: any
  shipList: any[] = [];
  onClickTask(event: any) {
    console.log('CLickEvent:', event);
    this.formName = event.value[0].name;
    this.shipList = event.value[0].shipping_list;
    console.log('shipList:', this.shipList);
  }

  onReorderTask(event: any) {
    console.log('ReorderEvent:', event);
  }

  updateTransportTask(id: string) {
    const form = this.event_form.controls['form'].value.map((item:any) => (item.name));
    console.log('form:', form)
    let body = {
      title: this.event_form.controls['title'].value,
      form: form,
      driver_id: this.event_form.controls['driver'].value.id,
      vehicle_id: this.event_form.controls['vehicle'].value.id,
      // start_time: this.event_form.controls['start_time'].value,
    }
    console.log('body:', body)
    this.confirmationService.confirm({
      message: `確定要儲存 ${this.event_form.controls['title'].value} 的修改？`,
      header: '確定修改？',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dispatchServ.patchTransportTask(id, body).subscribe({
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

  deleteTransportTask() {
    console.log('open')
    this.confirmationService.confirm({
      message: `確定要刪除 ${this.event_form.controls['title'].value} 嗎？`,
      header: '確定刪除？',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dispatchServ.deleteTransportTask(this.id).subscribe({
          next: res => {
            console.log('deleteDriver', res);
            this.showSussess('刪除');
            this.router.navigate(['/dispatch']);
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

  // 操作結果提示
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
