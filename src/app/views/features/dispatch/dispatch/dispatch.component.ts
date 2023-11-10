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

@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss']
})
export class DispatchComponent implements OnInit {
  selectedEvent: any[] = [];
  handleCheckbox(event: any) {
    console.log('selectedEvent:',this.selectedEvent)
    console.log(event)
  }

  list: any = list;
  formList: string[] = [];

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
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.event_form = this.fb.group({
      id: ['', Validators.required],
      title: ['', [Validators.required]],
      form: [''],
      driver: [''],
      vehicle: [''],
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
    this.getFormListName();
    this.getAllDriversRequest();
  }

  // 取得訂單
  getFormListName() {
    list.forEach(item => {
      this.formList.push(item.name);
    });
    console.log(this.formList);
  }

  // 取得司機
  driverData: any
  getAllDriversRequest() {
    this.carServ.getAllDriversRequest().subscribe({
      next: res => {
        this.driverData = res.body.drivers.map((item:any) => ({
          name: item.name,
        }));
        console.log(this.driverData);
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

}
