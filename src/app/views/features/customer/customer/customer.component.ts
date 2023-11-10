import { Component, OnInit } from '@angular/core';
import { CarService } from "../../../../services/car.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ClientService } from "../../../../services/client.service";
import { ConfirmationService, MessageService } from "primeng/api";

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class CustomerComponent implements OnInit {

  addClient_form: FormGroup;

  constructor(
    private carServ: CarService,
    private clientServ: ClientService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.addClient_form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      phone_number: ['', Validators.required],
      addr: [''],
    });
  }

  ngOnInit(): void {
    this.getAllClientRequest();
  }

  clientData: any;

  // 取得客戶
  getAllClientRequest() {
    this.clientServ.getAllClientRequest(1, 20).subscribe({
      next: res => {
        this.clientData = res.body.clients;
        console.log('clientData', this.clientData);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // 客戶Dialog
  addClientVisible = false;

  openAddClient() {
    this.addClientVisible = true;
  }

  closeAddClient() {
    this.showCancel('新增');
    this.addClient_form.reset();
    this.addClientVisible = false;
  }

  markAsDirty = false;
  // 新增客戶
  postClientRequest() {
    if (this.addClient_form.invalid) {
      this.markAsDirty = true;
      // 使用 markAsDirty() 標記未填寫的必填欄位
      Object.keys(this.addClient_form.controls).forEach(controlName => {
        const control = this.addClient_form.get(controlName);
        if (control?.hasError('required')) {
          // 這個控制項是必填的，標記為已修改
          control.markAsDirty();
        }
      });
      this.showError('新增');
      return; // 停止繼續執行
    }

    let body = {
      name: this.addClient_form.controls['name'].value,
      phone_number: this.addClient_form.controls['phone_number'].value
    }
    this.clientServ.postClientRequest(body).subscribe({
      next: data => {
        this.showSussess('新增');
        this.addClientVisible = false;
        this.addClient_form.reset();
        this.getAllClientRequest();
        console.log('data:', data);
        console.log('body:', body);
      },
      error: (err) => {
        this.showError('新增');
        console.log(err);
      },
    });
  }

  // 聯絡人
  addPersonVisible = false;

  openAddPerson() {
    this.addPersonVisible = true;
  }

  closeAddPerson() {
    this.showCancel('新增');
    this.addPersonVisible = false;
  }

  goToCompany(id: any) {
    this.router.navigate(['/company', id])
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
