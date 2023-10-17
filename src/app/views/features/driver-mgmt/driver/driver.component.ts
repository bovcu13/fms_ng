import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CarService} from "../../../../services/car.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss'],
  providers: [MessageService]
})
export class DriverComponent implements OnInit {

  addDriver_form: FormGroup;
  addDialogVisible = false;
  cars: any;
  driverData: any;

  constructor(
    private carServ: CarService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {
    this.addDriver_form = this.fb.group({
      employee_id: [''],
      name: ['', Validators.required],
      phone_number: [''],
      id_card_number: [''],
      employee_number: [''],
      email: [''],
      address: [''],
      daily_cost: ['', [Validators.pattern('^[0-9]*$')]],
    });
  }

  ngOnInit() {
    this.getAllDriversRequest()
  }

  getAllDriversRequest() {
    this.carServ.getAllDriversRequest().subscribe({
      next: res => {
        this.driverData = res.body.drivers;
        console.log('driverData',this.driverData);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // 新增司機
  addDriver() {
    this.addDriver_form.controls['daily_cost'].setValue(parseInt(this.addDriver_form.value.daily_cost, 10));
    console.log('addDriver_form', this.addDriver_form.value)
    this.carServ.postDriverRequest(this.addDriver_form.value).subscribe({
      next: res => {
        console.log('addDriver', res);
        this.showSussess();
        this.getAllDriversRequest();
        this.addDialogVisible = false;
      },
      error: err => {
        this.showError();
        console.log('err', err);
      }
    })
  }

  goToDriver(id: any) {
    this.router.navigate(['/driver', id])
  }

  showSussess() {
    this.messageService.add({severity: 'success', summary: '完成', detail: '新增成功！'});
  }

  showError() {
    this.messageService.add({severity: 'error', summary: '錯誤', detail: '新增失敗！'});
  }
}
