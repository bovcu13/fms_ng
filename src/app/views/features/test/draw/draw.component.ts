import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { GoogleMap } from "@angular/google-maps";
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

declare var google: any;

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss']
})
export class DrawComponent implements OnInit {

  @ViewChild(GoogleMap, { static: false }) set map(m: GoogleMap) {
    if (m) {
      this.initDrawingManager(m);
    }
  }

  apiLoaded: Observable<boolean>;
  drawingManager: any;

  options: google.maps.MapOptions = {
    center: { lat: 64.79728743642762, lng: -150.995535452303 },
    zoom: 7,
  };

  ngOnInit(): void { }
  constructor(httpClient: HttpClient) {
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyB1hde-5CDelK8n5aMiRecPOcl4i_nx0EE&libraries=drawing', 'callback')
                               .pipe(
                                 map(() => true),
                                 catchError(() => of(false)),
                               );
  }

  initDrawingManager(map: GoogleMap) {
    const drawingOptions: google.maps.drawing.DrawingManagerOptions = {
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.POLYGON,
        ],
      },
      polygonOptions: {
        strokeColor: '#E3916E',
      },
    };
    this.drawingManager = new google.maps.drawing.DrawingManager(drawingOptions);
    this.drawingManager.setMap(map.googleMap);
  }
}
