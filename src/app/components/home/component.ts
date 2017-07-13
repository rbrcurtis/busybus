import { Component } from '@angular/core';
import Vehicle from '../../models/Vehicle';

const animationStepInterval = 200;
const animationDuration = 10000;
const animationSteps = animationDuration / animationStepInterval;
let loopCount:number = 0;

let debug = function(...args) {
  // console.log.apply(console, args);
}

@Component({
  selector: 'app-root',
  templateUrl: './index.html',
  styleUrls: ['./styles.css']
})
export class AppComponent {
  
  _vehicles:Map<number, Vehicle> = new Map<number, Vehicle>();
  zoom:number;
  latCenter:number;
  lngCenter:number;
  latNorth:number;
  latSouth:number;
  lngWest:number;
  lngEast:number;


  get vehicles():Vehicle[] {
    return Array.from(this._vehicles.values()).filter((v) => {
      // only render busses that are on map
      return (
        v.lat <= this.latNorth &&
        v.lat >= this.latSouth &&
        v.lon <= this.lngEast &&
        v.lon >= this.lngWest
      );
    });
  }

  onZoomChange(zoom:number) {
    // console.log('zoomChange', zoom);
    this.zoom = zoom;
  }

  onCenterChange({lat, lng} : {lat:number, lng:number}) {
    // console.log('centerChange', lat, lng);
    this.latCenter = lat;
    this.lngCenter = lng;
  }

  onBoundsChange(obj:any) {
    // console.log('boundsChange', arguments);
    this.latNorth = obj.f.b;
    this.latSouth = obj.f.f;
    this.lngWest = obj.b.b;
    this.lngEast = obj.b.f;
  }

  updateVehicles(loopCount:number) {
    console.log(new Date().toLocaleString(), 'updating vehicles', loopCount);
    return Vehicle.load().then((v:Map<number, Vehicle>) => {
      v.forEach((newVehicleData:Vehicle, key:number) => {
        let vehicle = this._vehicles.get(key);
        if (!vehicle) {

          this._vehicles.set(key, newVehicleData);

        } else {

          let {lat, lon} = vehicle;

          debug(`[${key}]`, loopCount, 'animating', 'lat:', vehicle.lat, '=>', newVehicleData.lat, 'lon:', vehicle.lon, '=>', newVehicleData.lon);

          let step = 1;
          let latStep = (newVehicleData.lat - vehicle.lat) / animationSteps;
          let lonStep = (newVehicleData.lon - vehicle.lon) / animationSteps;

          debug(`[${key}]`, loopCount, 'steps', latStep, lonStep);

          let id = setInterval(() => {

            // if we += the step to the current value then we get A LOT of drift.
            vehicle.lat = lat + (step * latStep);
            vehicle.lon = lon + (step * lonStep);
            debug(`[${key}]`, loopCount, step, 'updated lat/lon', vehicle.lat, vehicle.lon);

            step++;

            if (step > animationSteps){
              debug(`[${key}]`, loopCount, 'animation complete');
              clearInterval(id);
              debug('ending')
              return;
            }

          }, animationStepInterval);
        }
      });
    });
  }

  constructor() { 
    let loop = () => {
      return this.updateVehicles(loopCount)
      .then(() => {
        loopCount++;
        setTimeout(loop.bind(this), animationDuration);
      })
    };
    loop();
  }

}
