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
    let ret:Vehicle[] = Array.from(Vehicle.records.values()).filter((v) => {
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


    let updates:number;

    if (ret.length < 10) {
      updates = 60;
    } else if (ret.length < 20) {
      updates = 30;
    } else if (ret.length < 30) {
      updates = 15;
    } else if (ret.length < 40) {
      updates = 8;
    } else if (ret.length < 50) {
      updates = 4;
    } else if (ret.length < 60) {
      updates = 2;
    } else {
      updates = 1;
    }
    Vehicle.moveSteps = updates;
    return ret;
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
