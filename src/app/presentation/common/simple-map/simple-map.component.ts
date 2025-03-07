import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { Coordinate } from '../../../domain/models/coordinate';
import { NgZorroAntdModule } from '../../../ng-zorro.module';

@Component({
  selector: 'app-simple-map',
  standalone: true,
  imports: [NgZorroAntdModule, CommonModule, GoogleMapsModule],
  templateUrl: './simple-map.component.html',
  styleUrl: './simple-map.component.scss',
})
export class SimpleMapComponent implements OnInit {
  @Input() coordinate!: Coordinate;
  @Output() onSelectedCoordinate = new EventEmitter<Coordinate>();

  public markerOptions: google.maps.MarkerOptions = { draggable: false };
  public markerPositions: google.maps.LatLngLiteral[] = [];

  /** The zoom of the map */
  public zoom = 15;
  /** The width of the map */
  public mapWidth: string = '100%';
  /** The height of the map. */
  public mapHeight: string = '500px';
  /** If is a small device */
  public smallDevice: boolean = false;

  public googleMapsCenter: google.maps.LatLngLiteral = {
    lat: 4.659698,
    lng: -74.093379,
  };

  ngOnInit() {
    // Set the center of the map.
    if (
      this.coordinate?.latitude !== undefined &&
      this.coordinate?.longitude !== undefined
    ) {
      this.googleMapsCenter = {
        lat: this.coordinate.latitude,
        lng: this.coordinate.longitude,
      };
      this.markerPositions = [this.googleMapsCenter];
    }
  }

  /**
   * Handles the click event on the map and emits the selected coordinate.
   * @param event The click event.
   */
  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const coordinate: Coordinate = {
        latitude: event.latLng.lat(),
        longitude: event.latLng.lng(),
        title: '',
        label: '',
      };

      // Update marker position.
      this.markerPositions = [
        {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        },
      ];

      // Emit the coordinate.
      this.onSelectedCoordinate.emit(coordinate);
    }
  }
}
