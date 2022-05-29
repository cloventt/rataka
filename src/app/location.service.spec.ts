import { TestBed } from '@angular/core/testing';

import { LocationService } from './location.service';

describe('LocationService', () => {
  let service: LocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should correctly convert position to maidenhead', () => {
    expect(LocationService.toMaidenhead(172, -47)).toEqual('RE66');
    expect(LocationService.toMaidenhead(46.951, 7.439)).toEqual('JN36rw');
  })

  it('should correctly convert decimal to degrees', () => {
    expect(LocationService.toDegrees(172)).toEqual([172, 0, 0]);
    expect(LocationService.toDegrees(-172)).toEqual([-172, 0, 0]);
    expect(LocationService.toDegrees(46.951)).toEqual([46, 57, 3]);
    expect(LocationService.toDegrees(-7.439)).toEqual([-7, 26, 20]);
    expect(LocationService.toDegrees(-14.265)).toEqual([-14, 15, 54]);
    expect(LocationService.toDegrees(-32.251)).toEqual([-32, 15, 3]);
  })
});
