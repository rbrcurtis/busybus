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

  constructor(data) {
    this.id = Number(data.getAttribute('id'));
    this.routeTag = data.getAttribute('routeTag');
    this.dirTag = data.getAttribute('dirTag');
    this.lat = Number(data.getAttribute('lat'));
    this.lon = Number(data.getAttribute('lon'));
    this.secsSinceReport = Number(data.getAttribute('secsSinceReport'));
    this.predictable = data.getAttribute('predictable') === "true";
    this.heading = Number(data.getAttribute('heading'));
    this.speedKmHr = Number(data.getAttribute('speedKmHr'));
    this.leadingVehicleId = Number(data.getAttribute('leadingVehicleId'));
  }


  static load() {
    return new Promise((resolve) => {
      $.ajax('http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=sf-muni&t=1499744484637', {
        success: (data:any) => {
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