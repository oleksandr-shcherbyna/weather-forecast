import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temperature'
})
export class TemperaturePipe implements PipeTransform {

  transform(temperatureKelvin: number | string): string {
    if (typeof temperatureKelvin === 'string') {
      return '';
    } 
    return Math.ceil(temperatureKelvin - 273.15) + '°';
  }

}
