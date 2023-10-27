import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { workData } from "../../../../shared/data/event";
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent implements OnInit {
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
      left: 'today prev,next',
      center: 'title',
      right: 'addEventButton'
    },
    customButtons: {
      addEventButton: {
        text: '＋',
        click: () => {
          this.showAddEventDialog('add');
        }
      }
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
      this.showAddEventDialog('edit', info.event)
      console.log(info.event)
    },
  };

  addEventVisible: boolean = false;
  dialogHeader!: string;
  showEdit = true;//判斷是否dialog為新增與編輯
  e_id: any;
  showAddEventDialog(type: string, event ?: any) {
    this.dialogHeader = type === 'edit' ? '編輯派工調度' : '新增派工調度';
    this.addEventVisible = true;

    if (event) {
      this.event_form.patchValue({
        name: event.title,
        start_date: new Date((event.start)),
        end_date: new Date((event.end)),
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
    private fb: FormBuilder,
  ) {
    this.event_form = this.fb.group({
      name: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      type: ['', [Validators.required]],
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
  }
}
