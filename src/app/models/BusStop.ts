import $ from 'jquery';
import {debug} from '../lib/debug';

export default class BusStop {

  private static stops:{[s: string]:BusStop[]} = {};

  static getStopsForRoute(routeTag:string):Promise<BusStop[]> {
    return new Promise((resolve, reject) => {
      if (!routeTag)return resolve([]);

      $.ajax(`http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=sf-muni&r=${routeTag}`, {
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
                    id: Number(item.getAttribute('stopId')),
                    routeTag:routeTag
                  }));
                }
              }
            }
          }
          this.stops[routeTag] = ret;
          return(resolve(this.stops[routeTag]));
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
  prediction:string = '';
  routeTag:string;

  get label() {
    return this.title + '\n\n' + this.prediction;
  }


  constructor(data) {
    this.tag = data.tag;
    this.title = data.title;
    this.shortTitle = data.shortTitle;
    this.lat = data.lat;
    this.lon = data.lon;
    this.id = data.id;
    this.routeTag = data.routeTag;
  }

  getPrediction() {
    console.log('getPrediction', this.id, this.title, this.routeTag);
    $.ajax(`http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=sf-muni&stopId=${this.id}&routeTag=${this.routeTag}`, {
      success: (data:Document) => {
        let ret = "Arrivals for route " + this.routeTag + '\n';
        for (let i = 0; i < data.children[0].children[0].children.length; i++) {
          let direction:Element = data.children[0].children[0].children.item(i);
          if (direction.tagName === 'direction') {
            ret += direction.getAttribute('title') + ": "
            let predictions:string[] = [];
            for (let j = 0 ; j < direction.children.length ; j++) {
              let prediction:Element = direction.children.item(j);
              let p = prediction.getAttribute('minutes');
              if (typeof p === 'string') {
                predictions.push(p);
              }
            }
            ret += predictions.join(', ') + " minutes\n";
          }
        }
        this.prediction = ret;
      },
      error: (jqXHR:any, textStatus:string, errorThrown:string) => {
        console.error(new Error(errorThrown || textStatus));
      }
    })
  }

}