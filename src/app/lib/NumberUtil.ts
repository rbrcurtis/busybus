import MapCoordinates from '../models/MapCoordinates';

export default new class NumberUtil {

  // https://stackoverflow.com/questions/2676719/calculating-the-angle-between-the-line-defined-by-two-points
  angleOf(p1:MapCoordinates, p2:MapCoordinates) {
    let deltaY:number = (p2.lat - p1.lat);
    let deltaX:number = (p2.lng - p1.lng);
    let result:number = Math.atan2(deltaY, deltaX); 
    result = result * 180 / Math.PI; //convert to degrees
    result = (result < 0) ? (360 + result) : result; //ensure we have a positive number

    return Math.floor(result);
  }

  roundTo(num:number, round:number) {
    let resto:number = num%round;
    if (resto <= (num/2)) { 
      return num-resto;
    } else {
      return num + round - resto;
    }
  }

}