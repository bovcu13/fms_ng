import { Component, OnInit } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss']
})
export class DrawComponent implements OnInit {

  marker1= google.maps.Marker
  marker2= google.maps.Marker
  poly= google.maps.Polyline
  geodesicPoly= google.maps.Polyline

  initMap(): void {

    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      }
    );

    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.MARKER,
          google.maps.drawing.OverlayType.CIRCLE,
          google.maps.drawing.OverlayType.POLYGON,
          google.maps.drawing.OverlayType.POLYLINE,
          google.maps.drawing.OverlayType.RECTANGLE,
        ],
      },
      markerOptions: {
        icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      },
      circleOptions: {
        fillColor: "#E9CD4C",
        fillOpacity: 0.6,
        strokeWeight: 1,
        clickable: false,
        editable: true,
        zIndex: 1,
      },
    });

    drawingManager.setMap(map);

  }

  ngOnInit(): void {
    this.initMap()
  }
}
