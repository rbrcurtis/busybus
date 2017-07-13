import { Component } from '@angular/core';
import Vehicle from '../../models/Vehicle';

const animationSteps = 60;
const animationDuration = 15000;
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

  get vehicles():Vehicle[] {
    return Array.from(this._vehicles.values());
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

  updateVehicles(loopCount:number) {
    debug(new Date().toLocaleString(), 'updating vehicles', loopCount);
    return Vehicle.load().then((v:Map<number, Vehicle>) => {
      v.forEach((vehicle:Vehicle, key:number) => {
        let previousVehicle = this._vehicles.get(key);
        if (!previousVehicle) {

          this._vehicles.set(key, vehicle);

        } else {
          debug(`[${key}]`, loopCount, 'animating', 'lat:', previousVehicle.lat, '=>', vehicle.lat, 'lon:', previousVehicle.lon, '=>', vehicle.lon);

          let step = 1;
          let latStep = (vehicle.lat - previousVehicle.lat) / animationSteps;
          let lonStep = (vehicle.lon - previousVehicle.lon) / animationSteps;

          debug(`[${key}]`, loopCount, 'steps', latStep, lonStep);

          let id = setInterval(() => {

            if (step > animationSteps){
              debug(`[${key}]`, loopCount, step, 'clearing');
              clearInterval(id);
              debug('ending')
              return;
            }

            vehicle.lat = previousVehicle.lat + (step * latStep);
            vehicle.lon = previousVehicle.lon + (step * lonStep);
            debug(`[${key}]`, loopCount, step, 'updated lat/lon', vehicle.lat, vehicle.lon);
            this._vehicles.set(key, vehicle);

            step++;

          }, animationDuration / animationSteps);
        }
      });
    });
  }

}
