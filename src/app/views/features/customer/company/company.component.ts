import {Component, OnInit} from '@angular/core';
import {CarService} from "../../../../services/car.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  companiesData = [
    {
      id: 1,
      name: '公司 1',
      address: '台北市中山區'
    }
  ]

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

  editCompany_form: FormGroup;
  addGoods_form: FormGroup;

  constructor(
    private carServ: CarService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editCompany_form = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      manager: ['', Validators.required],
      address: [''],
      created_at: [''],
      created_by: [''],
      updated_at: [''],
      updated_by: [''],
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
    this.editCompany_form.patchValue(this.companiesData[0])
  }

}
