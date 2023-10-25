import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CarService } from "../../../../services/car.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-warehouse-view',
  templateUrl: './warehouse-view.component.html',
  styleUrls: ['./warehouse-view.component.scss']
})
export class WarehouseViewComponent implements OnInit {
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
  ]

  warehouses = [ 'A 倉庫','B 倉庫','C 倉庫','D 倉庫','E 倉庫' ];

  managerData = [
    {
      id: 1,
      name: 'A 管理員',
      phone: '0912345678',
      warehouse: ['A 倉庫']
    }
  ]

  showDetailPage = false;
  selectedProductId: any; // 變數來保存所選的商品 ID
  showGoodsView(id: any) {
    this.selectedProductId = id; // 保存所選的商品 ID
    this.showDetailPage = true; // 顯示商品詳細頁面
  }
  backWarehouse() {
    this.showDetailPage = false;
  }

  addGoodsVisible = false;
  openAddGoods() {
    this.addGoodsVisible = true;
  }

  editManagerVisable = false;
  editable = false;

  showEditManager(editable: boolean) {
    this.editable = editable;
    if (!editable) {
      this.editManager_form.reset();
    }
    this.editManagerVisable = true;
  }

  editWarehouse_form: FormGroup;
  addGoods_form: FormGroup;
  editManager_form: FormGroup;

  constructor(
    private carServ: CarService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editWarehouse_form = this.fb.group({
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

    this.editManager_form = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      phone: ['', Validators.required],
      warehouse: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.editWarehouse_form.patchValue(this.warehousesData[0])
    this.editManager_form.patchValue(this.managerData[0])
  }
}
