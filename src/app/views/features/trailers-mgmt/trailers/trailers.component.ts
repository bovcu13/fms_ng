import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CarService } from "../../../../services/car.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";

@Component({
  selector: 'app-trailers',
  templateUrl: './trailers.component.html',
  styleUrls: ['./trailers.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class TrailersComponent implements OnInit {
  activeIndex = 3;
  id: any;

  editTrailers_form: FormGroup;

  constructor(
    private carServ: CarService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.editTrailers_form = this.fb.group({
      id: [''],
      code: [''],
      name: [''],
      type: [''],
      created_by: [''],
      updated_by: [''],
      created_at: [''],
      updated_at: ['']
    });
  }

  ngOnInit() {
    this.getOneTrailersRequest();
  }

  putTrailersData(data: any) {
    this.editTrailers_form.patchValue(data);
  }

  trailersData: any;

  // 取得 Trailer sData
  getOneTrailersRequest() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.carServ.getOneTrailersRequest(this.id).subscribe({
      next: res => {
        this.trailersData = res.body;
        console.log('vehiclesData', this.trailersData);
        this.putTrailersData(this.trailersData)
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateTrailersRequest(id: string, body: any) {
    this.confirmationService.confirm({
      message: `確定要儲存 ${this.editTrailers_form.controls['code'].value} 的修改？`,
      header: '確定修改？',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.carServ.patchTrailersRequest(id, body).subscribe({
          next: res => {
            console.log('patchTrailers',res);
            this.showSussess('修改');
            console.log('body', body);
          },
          error: (err) => {
            console.log('err',err);
            this.showError('修改');
            console.log('body', body);
          },
        });
      },
      reject: () => {
        this.showCancel('修改');
      }
    });
  }

  deleteTrailersRequest() {
    console.log('open')
    this.confirmationService.confirm({
      message: `確定要刪除 ${this.editTrailers_form.controls['code'].value} 嗎？`,
      header: '確定刪除？',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.carServ.deleteTrailersRequest(this.id).subscribe({
          next: res => {
            console.log('deleteTrailers', res);
            this.showSussess('刪除');
            this.router.navigate(['/fleet_mgmt',this.activeIndex]);
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
    this.messageService.add({ severity: 'success', summary: '完成', detail: `${info}成功！` });
  }

  showError(info = '修改') {
    this.messageService.add({ severity: 'error', summary: '錯誤', detail: `${info}失敗！` });
  }

  showCancel(info: string = '修改') {
    this.messageService.add({ severity: 'warn', summary: '取消', detail: `取消${info}！` });
  }
}
