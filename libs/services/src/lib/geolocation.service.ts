import { isPlatformBrowser }                               from "@angular/common";
import { Inject, Injectable, PLATFORM_ID, Signal, signal } from "@angular/core";
import { takeUntilDestroyed, toSignal }                    from "@angular/core/rxjs-interop";
import { Observable, Observer, startWith, TeardownLogic }  from "rxjs";


@Injectable({
  providedIn: "root",
})
export class GeolocationService {

  public readonly geolocation: Signal<google.maps.LatLng | null>;

  constructor(
    @Inject(PLATFORM_ID)
    private readonly platformId: object,
  ) {
    this
      .geolocation = isPlatformBrowser(platformId) ? toSignal<google.maps.LatLng | null>(new Observable<google.maps.LatLng | null>((locationObserver: Observer<google.maps.LatLng | null>): TeardownLogic => ((watchId: number): () => void => (): void => navigator.geolocation.clearWatch(watchId))(navigator.geolocation.watchPosition((geolocationPosition: GeolocationPosition): void => locationObserver.next(new google.maps.LatLng({
        lat: geolocationPosition.coords.latitude,
        lng: geolocationPosition.coords.longitude,
      })), null, {
        enableHighAccuracy: true,
      }))).pipe<google.maps.LatLng | null, google.maps.LatLng | null>(
        startWith<google.maps.LatLng | null>(null),
        takeUntilDestroyed<google.maps.LatLng | null>(),
      ), {
        requireSync: true
      }) : signal<google.maps.LatLng | null>(null);
  }

}
