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
    expect(LocationService.toMaidenhead(-47, 172)).toEqual('RE63aa');
    expect(LocationService.toMaidenhead(46.951, 7.439)).toEqual('JN36rw');
    expect(LocationService.toMaidenhead(0, 0)).toEqual('JJ00aa');
    expect(LocationService.toMaidenhead(90, 180)).toEqual('AA00aa');
    expect(LocationService.toMaidenhead(-14.265, -32.251)).toEqual('HH35ur');
  })

  it('should correctly convert maidenhead to position', () => {
    expect(LocationService.fromMaidenhead('RE63aa')).toEqual([-47, 172]);
    expect(LocationService.fromMaidenhead('JN36rw')).toEqual([46.951, 7.439]);
    expect(LocationService.fromMaidenhead('JJ00aa')).toEqual([0, 0]);
    expect(LocationService.fromMaidenhead('AA00aa')).toEqual([90, 180]);
    expect(LocationService.fromMaidenhead('HH35ur')).toEqual([-14.265, -32.251]);
  })
});
