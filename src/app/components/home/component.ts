import { Component } from '@angular/core';
import Vehicle from '../../models/Vehicle';

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
    console.log('ng after view init');
    let loop = () => {
      return this.updateVehicles()
      .then(() => {
        setTimeout(loop.bind(this), 15000);
      })
    };
    loop();
  }

  updateVehicles() {
    console.log(new Date().toLocaleString(), 'updating vehicles');
    return Vehicle.load().then((v:Map<number, Vehicle>) => {
      v.forEach((value:Vehicle, key:number) => {
        let current = this._vehicles.get(key);
        if (!current) {
          this._vehicles.set(key, value);
        } else {
          this._vehicles.set(key, value);
        }
      });
    });
  }

}
