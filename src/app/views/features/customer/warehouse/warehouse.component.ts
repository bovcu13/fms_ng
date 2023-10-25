import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CarService } from "../../../../services/car.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'app-warehouse',
    templateUrl: './warehouse.component.html',
    styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent {
    @Input() warehouseId: any; // 定義 productId 作為輸入屬性

    warehouses = [ 'A 倉庫','B 倉庫','C 倉庫','D 倉庫','E 倉庫' ];

    warehousesData = [
        {
            id: 1,
            name: 'A 倉庫',
            manager: 'A 管理員',
            address: '台北市中山區'
        }
    ]

    managerData = [
        {
            id: 1,
            name: 'A 管理員',
            phone: '0912345678',
            warehouse: ['A 倉庫']
        }
    ]

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
