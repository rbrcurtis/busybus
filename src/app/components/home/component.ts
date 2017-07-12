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

  ngOnInit() { 
    console.log('ng after view init');
    Vehicle.load().then((v:Map<number, Vehicle>) => {
      this._vehicles = v;
     //  let key:number = Number(Object.keys(v).sort()[0]);
      // this.vehicles.set(key, v.get(key));
      // setInterval(() => {
      //   this.vehicles[key].lat += (Math.random() * .001) - .0005;
      //   this.vehicles[key].lon += (Math.random() * .001) - .0005;
      //   console.log('update', this.vehicles[key].lat, this.vehicles[key].lon)
      // }, 100);
    });
  }

}
