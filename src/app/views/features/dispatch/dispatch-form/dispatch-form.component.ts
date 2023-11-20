import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ClientService } from "../../../../services/client.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { CarService } from "../../../../services/car.service";
import { DispatchService } from "../../../../services/dispatch.service";

@Component({
  selector: 'app-dispatch-form',
  templateUrl: './dispatch-form.component.html',
  styleUrls: ['./dispatch-form.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class DispatchFormComponent implements OnInit {
  code: any = 0;

  dispatch_form: FormGroup;
  shipping_list_form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private carServ: CarService,
    private dispatchServ: DispatchService,
    private clientServ: ClientService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.code = this.route.snapshot.paramMap.get('id');
    this.dispatch_form = this.fb.group({
      id: [''], //單號
      code: [''], //訂單編號
      name: ['', Validators.required], //名稱
      deadline: [''], //指定送達時間
      client_id: ['', Validators.required], //託運人
      origin: ['', Validators.required], //起運點
      destination: ['', Validators.required], //卸貨點
      created_at: [''], //填單日
    });
    this.shipping_list_form = this.fb.group({
      product_name: ['', Validators.required], //品名
      unit_price: [''], //單價
      quantity: ['', Validators.required], //件數
      tonnage: ['', Validators.required], //噸數
      trailer_id: ['', Validators.required], //板車
    });
  }

  ngOnInit(): void {
    if (this.code != 0) {
      this.getOneTransportOrder(this.code);
    }
    this.getFormName();
    this.getCreateDay();
    this.getAllClientRequest();
    this.getAllTrailersRequest();
  }

  getOneTransportOrder(id: string) {
    this.dispatchServ.getOneTransportOrder(id).subscribe({
      next: res => {
        console.log('getOneTransportOrder:', res.body);
        this.dispatch_form.patchValue(res.body);
        this.dispatch_form.patchValue({
          deadline: res.body.deadline? new Date(res.body.deadline): '',
          client_id: {
            name: res.body.client_name,
            id: res.body.client_id,
          }
        });
        this.itemList = res.body.shipping_list.map((item: any) => ({
          product_name: item.product_name,
          unit_price: item.unit_price? item.unit_price: 0,
          quantity: item.quantity,
          tonnage: item.tonnage,
          trailer_id: {
            id: item.trailer_id,
            code: item.trailer_code,
          }
        }));
        console.log('itemList:', this.itemList);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  title: any;
  getFormName() {
    if (this.dispatch_form.controls['name'].value) {
      this.title = this.dispatch_form.controls['name'].value;
    } else {
      this.title = "新增託運訂單";
    }
  }

  markAsDirty = false;
  itemList: any = [];

  add() {
    if (this.shipping_list_form.invalid) {
      this.markAsDirty = true;
      // 使用 markAsDirty() 標記未填寫的必填欄位
      Object.keys(this.shipping_list_form.controls).forEach(controlName => {
        const control = this.shipping_list_form.get(controlName);
        if (control?.hasError('required')) {
          // 這個控制項是必填的，標記為已修改
          control.markAsDirty();
        }
      });
      this.showError('新增');
      return; // 停止繼續執行
    }

    let items = {
      product_name: this.shipping_list_form.controls['product_name'].value,
      unit_price: this.shipping_list_form.controls['unit_price'].value,
      quantity: this.shipping_list_form.controls['quantity'].value,
      tonnage: this.shipping_list_form.controls['tonnage'].value,
      trailer_id: this.shipping_list_form.controls['trailer_id'].value,
    }

    this.itemList.push(items);
    console.log(items)
    console.log(this.itemList)
    this.shipping_list_form.reset();
  }

  // 新增訂單
  postTransportOrder() {
    if (this.dispatch_form.invalid) {
      this.markAsDirty = true;
      // 使用 markAsDirty() 標記未填寫的必填欄位
      Object.keys(this.dispatch_form.controls).forEach(controlName => {
        const control = this.dispatch_form.get(controlName);
        if (control?.hasError('required')) {
          // 這個控制項是必填的，標記為已修改
          control.markAsDirty();
        }
      });
      this.showError('新增');
      return; // 停止繼續執行
    }

    let body = {
      name: this.dispatch_form.controls['name'].value,
      client_id: this.dispatch_form.controls['client_id'].value.id,
      origin: this.dispatch_form.controls['origin'].value,
      destination: this.dispatch_form.controls['destination'].value,
      deadline: this.dispatch_form.controls['deadline'].value,
      shipping_list: this.itemList.map((item: any) => ({
        product_name: item.product_name,
        unit_price: item.unit_price? item.unit_price: 0,
        quantity: item.quantity,
        tonnage: item.tonnage,
        trailer_id: item.trailer_id.id,
      })),
    }
    this.dispatchServ.postTransportOrder(body).subscribe({
      next: data => {
        this.showSussess('新增');
        this.dispatch_form.reset();
        console.log(data);
        console.log(body);
      },
      error: (err) => {
        this.showError('新增');
        console.log(err);
        console.log(body);
      },
    });
  }

  createDay: any;
  getCreateDay() {
    if (this.dispatch_form.controls['created_at'].value) {
      this.createDay = this.dispatch_form.controls['created_at'].value;
    } else {
      this.createDay = new Date();
    }
  }

  // 取得託運人(客戶)
  clientData: any;
  getAllClientRequest() {
    this.clientServ.getAllClientRequest(1, 20).subscribe({
      next: res => {
        this.clientData = res.body.clients.map((item: any) => ({
          name: item.name,
          id: item.id
        }));
        console.log('clientData', this.clientData);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // 取得板車
  trailersData: any;
  getAllTrailersRequest() {
    this.carServ.getAllTrailersRequest().subscribe({
      next: res => {
        this.trailersData = res.body.trailers.map((item: any) => ({
          id: item.id,
          code: item.code,
        }));
        console.log('trailersData', this.trailersData);
      },
      error: (err) => {
        console.log(err);
      },
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
