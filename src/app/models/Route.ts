import $ from 'jquery';
import {debug} from '../lib/debug';

export default class Route {

  public static records:Route[] = [];

  public static load():Promise<Route[]> {
    return new Promise((resolve, reject) => {
      if (this.records.length) {
        return resolve(this.records);
      }
      $.ajax('http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=sf-muni', {
        success: (data:Document) => {
          if (data && data.children && data.children[0] && data.children[0].children && data.children[0].children.length) {
            for (let i = 0; i < data.children[0].children.length; i++) {
              let item = data.children[0].children.item(i);
              if (item && item.tagName === 'route') {
                this.records.push(new Route({
                  tag:item.getAttribute('tag'),
                  title:item.getAttribute('title'),
                  shortTitle:item.getAttribute('shortTitle')
                }));
              }
            }
          }
          resolve(this.records);
        },
        error: (jqXHR:any, textStatus:string, errorThrown:string) => {
          reject(new Error(errorThrown || textStatus));
        }
       });
    });

  }

  tag:string;
  title:string;
  shortTitle:string;

  public constructor(data) {
    this.tag = data.tag;
    this.title = data.title;
    this.shortTitle = data.shortTitle;
  }
}