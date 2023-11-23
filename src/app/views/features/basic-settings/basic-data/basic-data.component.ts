import { Component, OnInit } from '@angular/core';
import { carData } from "../../../../shared/data/products";
import { CarService } from "../../../../services/car.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";

interface Language {
  name: string;
  code: string;
}

@Component({
  selector: 'app-basic-data',
  templateUrl: './basic-data.component.html',
  styleUrls: ['./basic-data.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class BasicDataComponent implements OnInit {
  activeIndex = 1;

  addVehicle_form: FormGroup;
  user_form: FormGroup;

  constructor(private carServ: CarService,
              private fb: FormBuilder,
              private router: Router,
              private messageService: MessageService,
              private confirmationService: ConfirmationService
  ) {
    this.addVehicle_form = this.fb.group({
      fleet_id: ['c2d40ef0-341a-4793-b1b3-f4e4f82ba9f2', [Validators.required]],
      name: ['', [Validators.required]],
      driver: ['', [Validators.required]],
      license_plate: ['', Validators.required],
      sid: ['', Validators.required]
    });

    this.user_form = this.fb.group({
      fleet_code: ['', [Validators.required]],
      fleet_id: ['', [Validators.required]],
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      user_name: ['', [Validators.required]],
      email: [''],
      phone_number1: [''],
      old_password: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.getOneUserRequest();
    // this.initMenuItems();
    this.selectedLanguage();
    this.getAllVehiclesRequest();
  }

  language: Language[] | undefined;

  selectedLanguage() {
    this.language = [
      { name: '繁體中文', code: 'zh-TW' },
      { name: '簡體中文', code: 'zh-CN' },
      { name: '日文', code: 'JA' },
      { name: '英文', code: 'EN' },
    ];
  }

  items: MenuItem[] | undefined;
  initMenuItems() {
    this.items = [
      {
        label: 'New',
        icon: 'pi pi-fw pi-plus',
      },
      {
        label: 'Delete',
        icon: 'pi pi-fw pi-trash'
      }
    ];
  }

  cars: any;
  vehiclesData: any;
  // 取得車牌
  getAllVehiclesRequest() {
    this.carServ.getAllVehiclesRequest(1, 2).subscribe({
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

  goToVehicle(id: any) {
    this.router.navigate(['/vehicle', id])
  }

  // 取得使用者
  getOneUserRequest() {
    this.carServ.getOneUserRequest().subscribe({
      next: res => {
        console.log('userData', res.body);
        this.user_form.patchValue(res.body)
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // 修改使用者資料
  updateUserRequest(body: any) {
    this.confirmationService.confirm({
      message: `確定要儲存 ${this.user_form.controls['name'].value} 的修改？`,
      header: '確定修改？',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.carServ.patchUserRequest(body).subscribe({
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

  // 個資
  editProfileVisible = false;

  showEditProfile() {
    this.editProfileVisible = true;
  }
  // 儲存個資
  saveEditProfile(formValue: any) {
    this.updateUserRequest(formValue);
    this.editProfileVisible = false;
  }
  cancelEditProfile() {
    this.editProfileVisible = false;
  }

  // 密碼
  editPassVisible: boolean = false;

  showEditPass() {
    this.editPassVisible = true;
  }
  // 儲存密碼
  saveEditPass(formValue: any) {
    let body = {
      old_password: formValue.old_password,
      password: formValue.password,
    }
    this.updateUserRequest(body);
    this.editPassVisible = false;
  }
  cancelEditPass() {
    this.editPassVisible = false;
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
