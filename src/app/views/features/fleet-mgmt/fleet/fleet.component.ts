import {Component, OnInit} from '@angular/core';
import {CarService} from "../../../../services/car.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";

@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class FleetComponent implements OnInit {
  id: any;
  fleetData: any;
  editFleet_form: FormGroup;

  constructor(
    private carServ: CarService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.editFleet_form = this.fb.group({
      fleet_code: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getOneFleetRequest(this.id);
  }

  getOneFleetRequest(id: string) {
    this.carServ.getOneFleetRequest(id).subscribe({
      next: res => {
        console.log('fleetData', res.body);
        this.editFleet_form.patchValue(res.body)
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateFleetRequest(id: string, body: any) {
    this.carServ.patchFleetRequest(id, body).subscribe({
      next: res => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deleteFleetRequest() {
    console.log('open')
    this.confirmationService.confirm({
      message: `確定刪除${this.editFleet_form.controls['name'].value}？`,
      header: '確定刪除？',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.carServ.deleteFleetRequest(this.id).subscribe({
          next: res => {
            console.log('deleteDriver', res);
            this.showSussess('刪除');
            this.router.navigate(['/fleet_mgmt']);
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
