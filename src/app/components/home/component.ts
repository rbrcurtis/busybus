import { Component } from '@angular/core';
import Vehicle from '../../models/Vehicle';
import Route from '../../models/Route';
import BusStop from '../../models/BusStop';
import MapCoordinates from '../../models/MapCoordinates';
import {currentDebugKey} from '../../lib/debug';

@Component({
  selector: 'app-root',
  templateUrl: './index.html',
  styleUrls: ['./styles.scss']
})
export class AppComponent {
  
  latCenter:number;
  lngCenter:number;
  latNorth:number;
  latSouth:number;
  lngWest:number;
  lngEast:number;
  routes:Route[];
  currentRoute:Route;
  vehicles:Vehicle[];
  busStops:BusStop[];


  filterVehicles() {
    let ret:Vehicle[] = Array.from(Vehicle.records.values()).filter((v) => {
      let key = currentDebugKey();
      if (key) {
        return (String(v.id) === key);
      }
      if (this.currentRoute && this.currentRoute.tag && this.currentRoute.tag !== v.routeTag) {
        return false;
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
      updates = 100;
    } else if (ret.length < 20) {
      updates = 50;
    } else if (ret.length < 30) {
      updates = 25;
    } else if (ret.length < 50) {
      updates = 12;
    } else if (ret.length < 70) {
      updates = 6;
    } else if (ret.length < 90) {
      updates = 3;
    } else {
      updates = 1;
    }
    this.vehicles = ret;
    Vehicle.moveSteps = updates;
  }

  onBoundsChange(obj:any):void {
    console.log('boundsChange', obj);
    this.latNorth = obj.f.b;
    this.latSouth = obj.f.f;
    this.lngWest = obj.b.b;
    this.lngEast = obj.b.f;
    this.filterVehicles();
  }

  onRouteChange() {
    console.log('onRouteChange', this.currentRoute);
    Vehicle.route = this.currentRoute.tag;
    BusStop.getStopsForRoute(this.currentRoute.tag)
    .then((stops) => {
      this.busStops = stops;
    });
    this.filterVehicles();
  }

  constructor() { 
    Promise.all([
      Vehicle.init(),
      Route.load()
    ]).then(([vehicles, routes]) => {
      this.currentRoute = new Route({tag:'', title:'All Routes'});
      this.routes = [this.currentRoute].concat(routes);
      this.filterVehicles();
    });
  }

}
