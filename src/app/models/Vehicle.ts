import $ from 'jquery';
import {debug} from '../lib/debug';
import NumberUtil from '../lib/NumberUtil'

export default class Vehicle {
  
  private static loopCount:number = 0;
  private static last:number = 0;
  public static records:Map<number, Vehicle> = new Map<number, Vehicle>();
  public static readonly moveDuration:number = 10000;
  public static moveSteps:number = 5;
  public static route:string = '';

  private static load():Promise<Vehicle[]> {
    return new Promise((resolve, reject) => {
      let vehicles:Vehicle[] = [];
      let now = Date.now();
      $.ajax(`http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=sf-muni&t=${this.last}&r=${this.route}`, {
        success: (data:Document) => {
          this.last = now;
          if (data && data.children && data.children[0] && data.children[0].children && data.children[0].children.length) {
            for (let i = 0; i < data.children[0].children.length; i++) {
              let item = data.children[0].children.item(i);
              if (item && item.tagName === 'vehicle') {
                vehicles.push(new Vehicle(item));
              }
            }
          }
          resolve(vehicles);
        },
        error: (jqXHR:any, textStatus:string, errorThrown:string) => {
          reject(new Error(errorThrown || textStatus));
        }
      });
    });
  }

  private static updateVehicles(loopCount:number):Promise<void> {
    console.log(new Date().toLocaleString(), 'updating vehicles', loopCount, 'moveSteps is', this.moveSteps);
    return Vehicle.load().then((v:Vehicle[]) => {
      v.forEach((newVehicleData:Vehicle) => {
        let key = newVehicleData.id;
        let vehicle = Vehicle.records.get(key);

        if (!vehicle) {
          Vehicle.records.set(key, newVehicleData);
        } else {
          vehicle.moveTo(newVehicleData.lat, newVehicleData.lon);
        }
      });
    });
  }

  public static init():void {
    let loop = () => {
      return this.updateVehicles(this.loopCount)
      .then(() => {
        this.loopCount++;
        setTimeout(loop.bind(this), this.moveDuration);
      })
    };
    loop();
  }

  id:number;
  routeTag:string;
  dirTag:string;
  lat:number;
  lon:number;
  secsSinceReport:number;
  predictable:boolean;
  heading:number;
  speedKmHr:number;
  leadingVehicleId:number;
  angle:number = 45;
  get rotation():number {
    return NumberUtil.roundTo(this.angle, 45);
  }

  get iconUrl():string {
    return `assets/School_Bus-${this.rotation}.png`;
  }
  get label():string {
    // return [
    //   this.id,
    //   `Route ${this.routeTag}`,
    //    this.dirTag
    // ].join("\n");
    return [this.id, this.lat, this.lon, this.angle, this.rotation].join("\n");
  }

  public constructor(data) {
    this.id = Number(data.getAttribute('id'));
    this.routeTag = data.getAttribute('routeTag');
    this.dirTag = data.getAttribute('dirTag') || '';
    let m = this.dirTag.match(/([a-z0-9])_+([OI])_+/i);
    if (m && m.length > 1) {
      let dir:string = (m[2] === 'O')? 'Outbound' : 'Inbound';
      this.dirTag = dir;
    }
    this.lat = Number(data.getAttribute('lat'));
    this.lon = Number(data.getAttribute('lon'));
    this.secsSinceReport = Number(data.getAttribute('secsSinceReport'));
    this.predictable = data.getAttribute('predictable') === "true";
    this.heading = Number(data.getAttribute('heading'));
    this.speedKmHr = Number(data.getAttribute('speedKmHr'));
    this.leadingVehicleId = Number(data.getAttribute('leadingVehicleId'));
  }

  public moveTo(latNew:number, lonNew:number) {
    let loopCount = Vehicle.loopCount;
    this.angle = NumberUtil.angleOf({lat:this.lat, lng:this.lon}, {lat:latNew, lng:lonNew});
    
    debug(this.id, loopCount, 'animating', this.lat, ',', this.lon, '=>', latNew, ', ', lonNew, 'angle', this.angle, 'over', Vehicle.moveSteps, 'steps');
    // debug(this.id, loopCount, 'animating {lat:', this.lat, ', lng:', this.lon, '}, {lat:', latNew, ', lng:', lonNew, '}, angle', this.angle);

    let latStart = this.lat;
    let lonStart = this.lon;

    let step = 1;
    let latStep = (latNew - this.lat) / Vehicle.moveSteps;
    let lonStep = (lonNew - this.lon) / Vehicle.moveSteps;

    debug(this.id, loopCount, 'steps', latStep, lonStep);

    let id = setInterval(() => {

      // if we += the step to the current value then we get A LOT of drift.
      this.lat = latStart + (step * latStep);
      this.lon = lonStart + (step * lonStep);
      debug(this.id, loopCount, step, 'updated lat/lon', this.lat, this.lon);

      step++;

      if (step > Vehicle.moveSteps){
        debug(this.id, loopCount, 'animation complete');
        clearInterval(id);
        debug(this.id, 'ending')
        return;
      }

    }, Vehicle.moveDuration / Vehicle.moveSteps);
     
  }

}