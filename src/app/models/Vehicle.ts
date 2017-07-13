import $ from 'jquery';

export default class Vehicle {
  
  static records:Map<number, Vehicle> = new Map<number, Vehicle>();
 
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
  get label():string{
    return `${this.id}\nRoute ${this.routeTag}\n${this.dirTag}`
  }

  constructor(data) {
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

  private static last:number = null;

  static load() {
    return new Promise((resolve) => {
      if (this.last === null) {
        this.last = 0;
      }
      let now = Date.now();
      $.ajax(`http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=sf-muni&t=${this.last}&r=M`, {
        success: (data:any) => {
          this.last = now;
          if (data && data.children && data.children[0] && data.children[0].children && data.children[0].children.length)
          for (let i = 0; i < data.children[0].children.length; i++) {
            let item = data.children[0].children.item(i);
            if (item && item.tagName === 'vehicle') {
              this.records.set(item.id, new Vehicle(item));
            }
          }
          resolve(this.records);
        }
      });
    });
  }
}