import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  public async getLocation(): Promise<GeolocationPosition> {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          resolve(position);
        }, (error) => {
          reject(error);
        })
      }
    });
  }

  public static toMaidenhead(latitude: number, longitude: number): string {

    const zeroedLong = (longitude + 180) % 360;
    const zeroedLat = (latitude + 90) % 180;

    let out = '';
    const field1 = Math.floor((zeroedLong / 20) % 18)
    const field2 = Math.floor((zeroedLat / 10) % 18)
    out += String.fromCharCode(field1 + 65);
    out += String.fromCharCode(field2 + 65);

    out += Math.floor((zeroedLong % 20) / 2);
    out += Math.floor((zeroedLat % 10) / 1);

    const subsquare1 = Math.floor((zeroedLong % 2) * (60 / 5));
    const subsquare2 = Math.floor((zeroedLat % 1) * (60 / 2.5));

    out += String.fromCharCode((subsquare1 % 24) + 97);
    out += String.fromCharCode((subsquare2 % 24) + 97);
    return out;
  }
}