import {Component, OnInit} from '@angular/core';
import {CarService} from "../../../../services/car.service";
import {ClientService} from "../../../../services/client.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class CompanyComponent implements OnInit {
  id: any;

  warehousesData = [
    {
      id: 1,
      name: 'A 倉庫',
      manager: 'A 管理員',
      address: '台北市中山區'
    }
  ]

  goodsData = [
    {
      id: 1,
      name: '筆記本電腦',
      spec: '15吋, Intel Core i7, 512GB SSD',
      quantity: 2,
      unit: '台',
      price: 999.99,
      total: 1999.98,
    },
    {
      id: 2,
      name: '4K LED 電視',
      spec: '55吋, Smart TV',
      quantity: 1,
      unit: '台',
      price: 699.99,
      total: 699.99,
    },
    {
      id: 3,
      name: '耳機',
      spec: '無線藍牙, 降噪功能',
      quantity: 5,
      unit: '對',
      price: 149.99,
      total: 749.95,
    },
    {
      id: 4,
      name: '咖啡機',
      spec: '單杯咖啡機, 咖啡膠囊',
      quantity: 3,
      unit: '台',
      price: 79.99,
      total: 239.97,
    }
  ];

  showWarehouseDetailPage = false;
  selectedWarehouseId: any;
  showWarehouseView(id: any) {
    this.selectedWarehouseId = id; // 保存所選的商品 ID
    this.showWarehouseDetailPage = true; // 顯示商品詳細頁面
  }
  backCompany() {
    this.showWarehouseDetailPage = false;
  }

  goodsDialogVisible = false;
  editing = true;
  openGoodsDialog(isEdit: boolean, id?: number) {
    this.editing = isEdit;

    if (!isEdit) {
      this.addGoods_form.reset();
    } else {
      if (id) {
        this.addGoods_form.patchValue(this.goodsData[id - 1])
      }
    }

    this.goodsDialogVisible = true;
  }

  editClient_form: FormGroup;
  addGoods_form: FormGroup;

  constructor(
    private carServ: CarService,
    private clientServ: ClientService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.editClient_form = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      phone_number: ['', Validators.required],
      created_at: [''],
      created_by: [''],
      updated_at: [''],
      // updated_by: [''],
    });

    this.addGoods_form = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      spec: [''],
      quantity: ['', Validators.required],
      unit: ['', Validators.required],
      price: ['', Validators.required],
      total: ['', Validators.required],
      created_at: [''],
      created_by: [''],
      updated_at: [''],
      updated_by: [''],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getOneClientRequest(this.id);
  }

  getOneClientRequest(id: string) {
    this.clientServ.getOneClientRequest(id).subscribe({
      next: res => {
        console.log('getOneClientData:', res.body);
        this.editClient_form.patchValue(res.body)
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateClientRequest(id: string, body: any) {
    this.confirmationService.confirm({
      message: `確定要儲存 ${this.editClient_form.controls['name'].value} 的修改？`,
      header: '確定修改？',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clientServ.patchClientRequest(id, body).subscribe({
          next: res => {
            console.log('body', body);
            console.log(res);
            this.showSussess('修改');
          },
          error: (err) => {
            console.log('body', body);
            console.log('err',err);
            this.showError('修改');
          },
        });
      },
      reject: () => {
        this.showCancel('修改');
      }
    });
  }

  deleteClientRequest() {
    console.log('open')
    this.confirmationService.confirm({
      message: `確定要刪除 ${this.editClient_form.controls['name'].value} 嗎？`,
      header: '確定刪除？',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clientServ.deleteClientRequest(this.id).subscribe({
          next: res => {
            console.log('deleteClient', res);
            this.showSussess('刪除');
            this.router.navigate(['/customer']);
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
