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
});
