import { Component, OnInit } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss']
})
export class DrawComponent implements OnInit {

  poly= google.maps.Polyline;
  map= google.maps.Map;

  initMap(): void {
    this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      zoom: 7,
      center: { lat: 41.879, lng: -87.624 }, // Center the map on Chicago, USA.
    });

    this.poly = new google.maps.Polyline({
      strokeColor: "#000000",
      strokeOpacity: 1.0,
      strokeWeight: 3,
    });
    this.poly.setMap(this.map);

    // Add a listener for the click event
    this.map.addListener("click", this.addLatLng.bind(this));

    const drawingManager = new google.maps.drawing.DrawingManager({
      // drawingMode: google.maps.drawing.OverlayType.RECTANGLE, //預設的模式
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          // google.maps.drawing.OverlayType.MARKER,
          // google.maps.drawing.OverlayType.CIRCLE,
          google.maps.drawing.OverlayType.POLYGON,
          // google.maps.drawing.OverlayType.POLYLINE,
          // google.maps.drawing.OverlayType.RECTANGLE,
        ],
      },
      // markerOptions: {
      //   icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      // },
      // circleOptions: {
      //   fillColor: "#E9CD4C",
      //   fillOpacity: 0.6,
      //   strokeWeight: 1,
      //   clickable: false,
      //   editable: true,
      //   zIndex: 1,
      // },
    });

    drawingManager.setMap(this.map);
  }

  // 在 addLatLng 方法中使用箭頭函數，以確保保留正確的上下文
  addLatLng = (event: google.maps.MapMouseEvent) => {
    const path = this.poly.getPath();

    // Because path is an MVCArray, we can simply append a new coordinate
    // and it will automatically appear.
    path.push(event.latLng as google.maps.LatLng);

    // Add a new marker at the new plotted point on the polyline.
    new google.maps.Marker({
      position: event.latLng,
      title: "#" + path.getLength(),
      map: this.map,
    });
  }


  ngOnInit(): void {
    this.initMap()
  }
}
