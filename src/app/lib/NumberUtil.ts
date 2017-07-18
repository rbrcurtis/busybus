import MapCoordinates from '../models/MapCoordinates';

export default new class NumberUtil {

  // https://stackoverflow.com/questions/2676719/calculating-the-angle-between-the-line-defined-by-two-points
  // lat: 37.72171 => 37.72178 lon: -122.47515 => -122.47515
  angleOf(p1:{lat:number, lng:number}, p2:{lat:number, lng:number}) {
    let deltaLat:number = (p2.lat - p1.lat);
    let deltaLng:number = (p2.lng - p1.lng);
    let result:number = Math.atan2(deltaLng, deltaLat); 
    result = result * 180 / Math.PI; //convert to degrees
    result = (result < 0) ? (360 + result) : result; //ensure we have a positive number

    return Math.floor(result);
  }

  roundTo(num:number, round:number) {
    let remainder:number = num % round;
    if (remainder <= (round / 2)) { 
      return num - remainder;
    } else {
      return num + round - remainder;
    }
  }

}