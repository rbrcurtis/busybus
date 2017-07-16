import { Component } from '@angular/core';
import Vehicle from '../../models/Vehicle';
import MapCoordinates from '../../models/MapCoordinates';
import {currentDebugKey} from '../../lib/debug';

@Component({
  selector: 'app-root',
  templateUrl: './index.html',
  styleUrls: ['./styles.css']
})
export class AppComponent {
  
  zoom:number;
  latCenter:number;
  lngCenter:number;
  latNorth:number;
  latSouth:number;
  lngWest:number;
  lngEast:number;

  get vehicles():Vehicle[] {
    return Array.from(Vehicle.records.values()).filter((v) => {
      let key = currentDebugKey();
      if (key) {
        return (String(v.id) === key);
      }
      // only render busses that are on map
      return (
        v.lat <= this.latNorth &&
        v.lat >= this.latSouth &&
        v.lon <= this.lngEast &&
        v.lon >= this.lngWest
      );
    });
  }

  onZoomChange(zoom:number):void {
    // console.log('zoomChange', zoom);
    this.zoom = zoom;
  }

  onCenterChange({lat, lng} : MapCoordinates):void {
    // console.log('centerChange', lat, lng);
    this.latCenter = lat;
    this.lngCenter = lng;
  }

  onBoundsChange(obj:any):void {
    // console.log('boundsChange', arguments);
    this.latNorth = obj.f.b;
    this.latSouth = obj.f.f;
    this.lngWest = obj.b.b;
    this.lngEast = obj.b.f;
  }

  constructor() { 
    Vehicle.init();
  }

}
