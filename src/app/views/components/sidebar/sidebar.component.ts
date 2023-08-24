import {Component} from '@angular/core';
import {MenuItem} from "primeng/api";
import {sidebarMenu} from "../../../shared/data/menu";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  items: MenuItem[] = sidebarMenu;
  sideVisible: boolean = false;
}
