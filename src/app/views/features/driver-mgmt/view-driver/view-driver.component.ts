import {Component, OnInit} from '@angular/core';
import {CarService} from "../../../../services/car.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-view-driver',
  templateUrl: './view-driver.component.html',
  styleUrls: ['./view-driver.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class ViewDriverComponent implements OnInit {

  editDriver_form: FormGroup;
  id: any;

  constructor(
    private carServ: CarService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.editDriver_form = this.fb.group({
      employee_id: [''],
      name: ['', Validators.required],
      phone_number: [''],
      id_card_number: [''],
      email: [''],
      address: [''],
      // employee_number: [''],
      // daily_cost: ['', [Validators.pattern('^[0-9]*$')]],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getOneDriverRequest(this.id);
  }

  getOneDriverRequest(id: string) {
    this.carServ.getOneDriverRequest(id).subscribe({
      next: res => {
        this.editDriver_form.patchValue(res.body);
        console.log('editDriver_form', this.editDriver_form.value);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  editDriver() {
    // this.editDriver_form.controls['daily_cost'].setValue(parseInt(this.editDriver_form.value.daily_cost, 10));
    console.log('editDriver_form', this.editDriver_form.value)
    this.carServ.patchDriverRequest(this.id, this.editDriver_form.value).subscribe({
      next: res => {
        console.log('editDriver', res);
        this.showSussess();
        this.getOneDriverRequest(this.id);
      },
      error: (err) => {
        console.log('err', err);
        this.showError();
      }
    })
  }

  deleteDriver() {
    console.log('open')
    this.confirmationService.confirm({
      message: `確定刪除${this.editDriver_form.controls['name'].value}？`,
      header: '確定刪除？',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.carServ.deleteDriverRequest(this.id).subscribe({
          next: res => {
            console.log('deleteDriver', res);
            this.showSussess('刪除');
            this.router.navigate(['/driver']);
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
