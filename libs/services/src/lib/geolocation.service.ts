import { isPlatformBrowser }                               from "@angular/common";
import { Inject, Injectable, PLATFORM_ID, Signal, signal } from "@angular/core";
import { takeUntilDestroyed, toSignal }                    from "@angular/core/rxjs-interop";
import { Geolocation }                                     from "@heypoint/types";
import { Observable, Observer, startWith, TeardownLogic }  from "rxjs";


@Injectable({
  providedIn: "root",
})
export class GeolocationService {

  public readonly geolocation: Signal<Geolocation | null>;

  constructor(
    @Inject(PLATFORM_ID)
    private readonly platformId: object,
  ) {
    this
      .geolocation = isPlatformBrowser(platformId) ? toSignal<Geolocation | null>(new Observable<Geolocation | null>((geolocationObserver: Observer<Geolocation | null>): TeardownLogic => ((watchId: number): () => void => (): void => navigator.geolocation.clearWatch(watchId))(navigator.geolocation.watchPosition((geolocationPosition: GeolocationPosition): void => geolocationObserver.next({
        heading: geolocationPosition.coords.heading,
        lat: geolocationPosition.coords.latitude,
        lng: geolocationPosition.coords.longitude,
      }), null, {
        enableHighAccuracy: true,
      }))).pipe<Geolocation | null, Geolocation | null>(
        startWith<Geolocation | null>(null),
        takeUntilDestroyed<Geolocation | null>(),
      ), {
        requireSync: true
      }) : signal<Geolocation | null>(null);
  }

}
