import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CarService } from "../../../../services/car.service";
import { ActivatedRoute, Router } from "@angular/router";
import { list } from "../../../../shared/data/dispatch";
import { workData } from "../../../../shared/data/event";
import { CalendarOptions } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { DispatchService } from "../../../../services/dispatch.service";
import { ConfirmationService, MessageService } from "primeng/api";

@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class DispatchComponent implements OnInit {
  selectedEvent: any[] = [];
  handleCheckbox(event: any) {
    console.log('selectedEvent:',this.selectedEvent)
    console.log(event)
  }

  list: any = list;

  showList = true;
  showListBtn() {
    this.showList = true;
    console.log(this.showList);
  }
  closeListBtn() {
    this.showList = false;
    console.log(this.showList);
  }

  // full-calendar
  dispatchEvents: any[] = workData;
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      start: 'dayGridMonth timeGridWeek timeGridDay',
      center: 'title',
      end: 'prevYear prev next nextYear'
    },
    editable: false,// 是否可以進行拖拽、修改
    selectMirror: true,
    dayMaxEvents: true,
    handleWindowResize: true, //隨瀏覽器窗口大小變化
    selectable: true,
    selectOverlap: true, //日期是否可以被重複選中多次
    weekends: true, //日曆面板中是否顯示周末,一開始為不顯示
    dayHeaders: true,
    events: this.dispatchEvents,
    //點選日期開啟新增事件
    select: () => {
      console.log("DATE SELECTED !!!");
      this.showAddEventDialog('add');
    },
    dateClick: () => {
      console.log("DATE CLICKED !!!");
      this.showAddEventDialog('add');
    },
    //點選事件開啟編輯事件
    eventClick: (info: any) => {
      console.log(info.event);
      this.showAddEventDialog('editCalendar', info.event)
    },
  };

  // dialog
  addEventVisible: boolean = false;
  dialogHeader!: string;
  showEdit = true;//判斷是否dialog為新增與編輯
  e_id: any;
  showAddEventDialog(type: string, event ?: any) {
    this.dialogHeader = type === 'editList' || type === 'editCalendar' ? '編輯任務' : '新增任務';
    this.addEventVisible = true;

    if (event) {
      const driver={
        name: this.dispatchEvents[Number(event._def.publicId) - 1].driver
      }
      this.event_form.patchValue({
        title: event.title,
        start_time: new Date((event.start)),
        end_date: type === 'editList' ? new Date((event.end)) : new Date(this.dispatchEvents[Number(event._def.publicId) - 1].end),
        driver: driver
      });
      this.showEdit = true;
    } else {
      this.event_form.reset();
      this.showEdit = false;
    }
  }

  minDate: Date; // 最早時間，午夜12時
  maxDate: any; // 最晚時間，晚間11點59分

  event_form: FormGroup;

  constructor(
    private carServ: CarService,
    private dispatchServ: DispatchService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.event_form = this.fb.group({
      code: [''],
      title: ['', [Validators.required]],
      form: ['', [Validators.required]],
      driver: ['', [Validators.required]],
      vehicle: ['', [Validators.required]],
      start_time: ['', [Validators.required]],
      // end_date: ['', [Validators.required]],
      // type: ['', [Validators.required]],
      description: [''],
      created_at: [''],
      updated_at: [''],
      created_by: [''],
      updated_by: [''],
    });
    // 設定最小日期為今天
    this.minDate = new Date();
  }

  ngOnInit(): void {
    this.getAllTransportTask();
    this.getAllTransportOrder();
    this.getAllDriversRequest();
    this.getAllVehiclesRequest();
  }

  // 取得派工調度
  eventData: any;
  getAllTransportTask() {
    this.dispatchServ.getAllTransportTask().subscribe({
      next: res => {
        this.eventData = res.body.transport_tasks;
        console.log('eventData:', this.eventData)
      },
      error: (err) => {
        console.log('getAllTransportTaskError:', err);
      },
    });
  }

  // 取得表單
  formData: any;
  getAllTransportOrder() {
    this.dispatchServ.getAllTransportOrder().subscribe({
      next: res => {
        this.formData = res.body.transport_orders.map((item:any) => ({
          name: item.name,
          id: item.id
        }));
        console.log('formData:', this.formData)
      },
      error: (err) => {
        console.log('getAllTransportOrderError:', err);
      },
    });
  }

  // 取得司機
  driverData: any
  getAllDriversRequest() {
    this.carServ.getAllDriversRequest().subscribe({
      next: res => {
        this.driverData = res.body.drivers.map((item:any) => ({
          name: item.name,
          id: item.id
        }));
        console.log(this.driverData);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // 取得車輛
  vehiclesData: any;
  getAllVehiclesRequest() {
    this.carServ.getAllVehiclesRequest(1, 20).subscribe({
      next: res => {
        this.vehiclesData = res.body.vehicles.map((item: any) => ({
          name: item.license_plate,
          id: item.id
        }));
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // 進入詳細頁面
  goToDispatchView(id: any) {
    this.router.navigate(['/dispatch_view', id])
  }

  markAsDirty = false;
  // 新增訂單
  postTransportTask() {
    if (this.event_form.invalid) {
      this.markAsDirty = true;
      // 使用 markAsDirty() 標記未填寫的必填欄位
      Object.keys(this.event_form.controls).forEach(controlName => {
        const control = this.event_form.get(controlName);
        if (control?.hasError('required')) {
          // 這個控制項是必填的，標記為已修改
          control.markAsDirty();
        }
      });
      console.log('未填完')
      this.showError('新增');
      return; // 停止繼續執行
    }

    const form = this.event_form.controls['form'].value.map((item:any) => (item.id));

    let body = {
      title: this.event_form.controls['title'].value,
      form: form,
      driver_id: this.event_form.controls['driver'].value.id,
      vehicle_id: this.event_form.controls['vehicle'].value.id,
      start_time: this.event_form.controls['start_time'].value,
    }
    this.dispatchServ.postTransportTask(body).subscribe({
      next: data => {
        this.showSussess('新增');
        this.event_form.reset();
        console.log(data);
        console.log(body);
      },
      error: (err) => {
        this.showError('新增');
        console.log(err);
        console.log(body);
      },
    });
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
