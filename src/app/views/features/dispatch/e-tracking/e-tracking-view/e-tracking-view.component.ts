import { Component, OnInit } from '@angular/core';
import { MenuItem } from "primeng/api";
import { list } from "../../../../../shared/data/dispatch";

declare var google: any;

interface EventItem {
  status?: string;
  date?: string;
  icon?: string;
  color?: string;
  image?: string;
}

@Component({
  selector: 'app-e-tracking-view',
  templateUrl: './e-tracking-view.component.html',
  styleUrls: ['./e-tracking-view.component.scss']
})
export class ETrackingViewComponent implements OnInit {
  events: EventItem[];
  items: MenuItem[] | undefined;

  goodsData = [
    {
      id: 1,
      name: '筆記本電腦',
      spec: '15吋, Intel Core i7, 512GB SSD',
      quantity: 2,
      unit: '台',
      price: 999.99,
      total: 1999.98,
    },
    {
      id: 2,
      name: '4K LED 電視',
      spec: '55吋, Smart TV',
      quantity: 1,
      unit: '台',
      price: 699.99,
      total: 699.99,
    },
    {
      id: 3,
      name: '耳機',
      spec: '無線藍牙, 降噪功能',
      quantity: 5,
      unit: '對',
      price: 149.99,
      total: 749.95,
    },
    {
      id: 4,
      name: '咖啡機',
      spec: '單杯咖啡機, 咖啡膠囊',
      quantity: 3,
      unit: '台',
      price: 79.99,
      total: 239.97,
    }
  ]

  constructor() {
    this.events = [
      { status: '仁武', date: '抵達：2023-10-23 09:00', icon: 'pi pi-check-circle', color: '#B6C5CC' },
      { status: '堅富', date: '預計抵達時間：2023-10-23 10:30', icon: 'pi pi-truck', color: '#FF9800' },
      { status: '仁武', date: '預計抵達時間：2023-10-23 16:15', icon: 'pi pi-circle', color: '#B6C5CC' },
      { status: '朧賢', date: '預計抵達時間：2023-10-23 17:00', icon: 'pi pi-circle', color: '#B6C5CC' }
    ];
  }

  ngOnInit() {
    this.initMap();
    this.items = [
      {
        label: 'Personal',
        routerLink: 'personal'
      },
      {
        label: 'Seat',
        routerLink: 'seat'
      },
      {
        label: 'Payment',
        routerLink: 'payment'
      },
      {
        label: 'Confirmation',
        routerLink: 'confirmation'
      }
    ];
  }

  map: any;
  mapOptions: any;
  center: google.maps.LatLngLiteral = {
    lat: 22.61295,
    lng: 120.3196
  };

  initMap() {
    const styledMapType = new google.maps.StyledMapType(
      [
        { elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
        {
          featureType: "administrative",
          elementType: "geometry.stroke",
          stylers: [{ color: "#c9b2a6" }],
        },
        {
          featureType: "administrative.land_parcel",
          elementType: "geometry.stroke",
          stylers: [{ color: "#dcd2be" }],
        },
        {
          featureType: "administrative.land_parcel",
          elementType: "labels.text.fill",
          stylers: [{ color: "#ae9e90" }],
        },
        {
          featureType: "landscape.natural",
          elementType: "geometry",
          stylers: [{ color: "#dfd2ae" }],
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [{ color: "#dfd2ae" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#93817c" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry.fill",
          stylers: [{ color: "#a5b076" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#447530" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#f5f1e6" }],
        },
        {
          featureType: "road.arterial",
          elementType: "geometry",
          stylers: [{ color: "#fdfcf8" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#f8c967" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#e9bc62" }],
        },
        {
          featureType: "road.highway.controlled_access",
          elementType: "geometry",
          stylers: [{ color: "#e98d58" }],
        },
        {
          featureType: "road.highway.controlled_access",
          elementType: "geometry.stroke",
          stylers: [{ color: "#db8555" }],
        },
        {
          featureType: "road.local",
          elementType: "labels.text.fill",
          stylers: [{ color: "#806b63" }],
        },
        {
          featureType: "transit.line",
          elementType: "geometry",
          stylers: [{ color: "#dfd2ae" }],
        },
        {
          featureType: "transit.line",
          elementType: "labels.text.fill",
          stylers: [{ color: "#8f7d77" }],
        },
        {
          featureType: "transit.line",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#ebe3cd" }],
        },
        {
          featureType: "transit.station",
          elementType: "geometry",
          stylers: [{ color: "#dfd2ae" }],
        },
        {
          featureType: "water",
          elementType: "geometry.fill",
          stylers: [{ color: "#b9d3c2" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#92998d" }],
        },
      ],
      { name: "Styled Map" }
    );

    // Create a map object, and include the MapTypeId to add
    // to the map type control.
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        center: this.center,
        zoom: 16,
        mapTypeControlOptions: {
          mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain", "styled_map"],
        },
      }
    );

    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set("styled_map", styledMapType);
    map.setMapTypeId("styled_map");

  }

  protected readonly list = list;
}
