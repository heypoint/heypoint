import { isPlatformBrowser }                               from "@angular/common";
import { Inject, Injectable, PLATFORM_ID, Signal, signal } from "@angular/core";
import { toSignal }                                        from "@angular/core/rxjs-interop";
import { Observable, Observer, startWith, TeardownLogic }  from "rxjs";


@Injectable({
  providedIn: "root",
})
export class GeolocationService {

  public readonly geolocationPosition: Signal<GeolocationPosition | null>;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this
      .geolocationPosition = isPlatformBrowser(platformId) ? toSignal<GeolocationPosition | null>(
        new Observable<GeolocationPosition | null>(
          (geolocationObserver: Observer<GeolocationPosition | null>): TeardownLogic => ((watchId: number): () => void => (): void => navigator.geolocation.clearWatch(watchId))(
            navigator.geolocation.watchPosition(
              (geolocationPosition: GeolocationPosition): void => geolocationObserver.next(geolocationPosition),
              (geolocationPositionError: GeolocationPositionError): void => geolocationObserver.error(geolocationPositionError),
              {
                enableHighAccuracy: true,
              },
            ),
          ),
        ).pipe<GeolocationPosition | null>(
          startWith<GeolocationPosition | null>(null),
        ),
        {
          requireSync: true,
        },
      ) : signal<GeolocationPosition | null>(null);
  }

}
