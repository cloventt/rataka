import { Injectable } from '@angular/core';

import { Big } from 'big.js'

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
    return '';
  }

  public static toDegrees(decimal: number): [number, number, number] {
    const negative = (decimal < 0) ? -1 : 1;
    let n = Big(Math.abs(decimal));
    const out = [n.round(0, 0).toNumber() * negative];
    n = n.sub(n.round(0, 0)).mul(60)
    out.push(n.round(0, 0).toNumber());
    n = n.sub(n.round(0, 0)).mul(60)
    out.push(n.round(0, 0).toNumber());
    return [out[0], out[1], out[2]]; 

  }
}
