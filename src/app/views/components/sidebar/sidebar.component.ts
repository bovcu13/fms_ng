import {Component} from '@angular/core';
import {MenuItem} from "primeng/api";
import {sidebarMenu, testMenu} from "../../../shared/data/menu";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  sidebarMenu: MenuItem[] = sidebarMenu;
  testMenu: MenuItem[] = testMenu;
  sideVisible: boolean = false;
}
