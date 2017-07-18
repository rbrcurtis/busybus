import $ from 'jquery';
import {debug} from '../lib/debug';

export default class BusStop {

  private static stops:{[s: string]:BusStop[]} = {};

  static getStopsForRoute(tag:string):Promise<BusStop[]> {
    return new Promise((resolve, reject) => {
      if (!tag)return resolve([]);

      $.ajax(`http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=sf-muni&r=${tag}`, {
        success: (data:any) => {
          let ret:BusStop[] = [];
          if (data && data.children && data.children[0] && data.children[0].children && data.children[0].children.length && data.children[0].children[0].children.length) {
            for (let i = 0; i < data.children[0].children[0].children.length; i++) {
              let item = data.children[0].children[0].children.item(i);
              if (item) {
                if (item.tagName === 'stop') {
                  ret.push(new BusStop({
                    tag:item.getAttribute('tag'),
                    title:item.getAttribute('title'),
                    shortTitle:item.getAttribute('shortTitle'),
                    lat: Number(item.getAttribute('lat')),
                    lon: Number(item.getAttribute('lon')),
                    id: Number(item.getAttribute('stopId'))
                  }));
                }
              }
            }
          }
          this.stops[tag] = ret;
          return(resolve(this.stops[tag]));
        },
        error: (jqXHR:any, textStatus:string, errorThrown:string) => {
          reject(new Error(errorThrown || textStatus));
        } 
      });
      
    });
  }

  id:number;
  tag:string;
  title:string;
  shortTitle:string;
  lat:number;
  lon:number;

  constructor(data:BusStop) {
    this.tag = data.tag;
    this.title = data.title;
    this.shortTitle = data.shortTitle;
    this.lat = data.lat;
    this.lon = data.lon;
    this.id = data.id;
  }

}