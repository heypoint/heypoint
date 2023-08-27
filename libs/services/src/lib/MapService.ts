import { isPlatformBrowser }                                                                          from "@angular/common";
import { computed, Inject, Injectable, NgZone, PLATFORM_ID, signal, Signal }                          from "@angular/core";
import { takeUntilDestroyed, toSignal }                                                               from "@angular/core/rxjs-interop";
import { ENVIRONMENT }                                                                                from "@heypoint/injection-tokens";
import { Environment }                                                                                from "@heypoint/interfaces";
import { delay, merge, Observable, Observer, of, ReplaySubject, startWith, switchMap, TeardownLogic } from "rxjs";
import { GeolocationService, ResponsivityService }                                                    from "../";


@Injectable({
  providedIn: "root",
})
export class MapService {

  public readonly mapHasInteractionObservable: Observable<boolean>;
  public readonly mapHasInteraction$:          Signal<boolean>;
  public readonly mapOptions$:                 Signal<google.maps.MapOptions>;

  public readonly mapInitializedHandler: (map: google.maps.Map) => void;

  private readonly mapSubject: ReplaySubject<google.maps.Map>;

  constructor(
    @Inject(ENVIRONMENT) private readonly appEnvironment: Environment,
    @Inject(PLATFORM_ID)     private readonly platformId:     object,

    private readonly geolocationService:  GeolocationService,
    private readonly ngZone:              NgZone,
    private readonly responsivityService: ResponsivityService,
  ) {
    this
      .mapOptions$ = computed<google.maps.MapOptions>(
        (): google.maps.MapOptions => ({
          center:           ((geolocationPosition: GeolocationPosition | null): google.maps.LatLngLiteral | null => geolocationPosition && ({
            lat: geolocationPosition.coords.latitude,
            lng: geolocationPosition.coords.longitude,
          }))(geolocationService.geolocationPosition$()),
          clickableIcons:   false,
          disableDefaultUI: true,
          gestureHandling:  "greedy",
          mapId:            responsivityService.colorScheme$() == "light" ? "4658b3e01cedf4cb" : "28b46c4c6bed5a4",
          maxZoom:          20,
          minZoom:          10,
        }),
        {
          equal: (mapOptionsA: google.maps.MapOptions, mapOptionsB: google.maps.MapOptions): boolean => mapOptionsA.center ? this.mapHasInteraction$() ? true : mapOptionsA.center.lat !== mapOptionsB.center?.lat || mapOptionsA.center.lng !== mapOptionsB.center?.lng : false,
        },
      );
    this
      .mapInitializedHandler = (map: google.maps.Map): void => this
      .mapSubject
      .next(map);
    this
      .mapSubject = new ReplaySubject<google.maps.Map>(1);
    this
      .mapHasInteractionObservable = this
      .mapSubject
      .asObservable()
      .pipe<boolean, boolean>(
        switchMap<google.maps.Map, Observable<boolean>>(
          (map: google.maps.Map): Observable<boolean> => merge<[ true, true, true, true, true, true, false, true, true ]>(
            new Observable<true>(
              (mapsEventObserver: Observer<true>): TeardownLogic => map.addListener(
                "bounds_changed",
                (): void => ngZone.run(
                  (): void => mapsEventObserver.next(true),
                ),
              ).remove,
            ),
            new Observable<true>(
              (mapsEventObserver: Observer<true>): TeardownLogic => map.addListener(
                "center_changed",
                (): void => ngZone.run(
                  (): void => mapsEventObserver.next(true),
                ),
              ).remove,
            ),
            new Observable<true>(
              (mapsEventObserver: Observer<true>): TeardownLogic => map.addListener(
                "click",
                (): void => ngZone.run(
                  (): void => mapsEventObserver.next(true),
                ),
              ).remove,
            ),
            new Observable<true>(
              (mapsEventObserver: Observer<true>): TeardownLogic => map.addListener(
                "dblclick",
                (): void => ngZone.run(
                  (): void => mapsEventObserver.next(true),
                ),
              ).remove,
            ),
            new Observable<true>(
              (mapsEventObserver: Observer<true>): TeardownLogic => map.addListener(
                "drag",
                (): void => ngZone.run(
                  (): void => mapsEventObserver.next(true),
                ),
              ).remove,
            ),
            new Observable<true>(
              (mapsEventObserver: Observer<true>): TeardownLogic => map.addListener(
                "heading_changed",
                (): void => ngZone.run(
                  (): void => mapsEventObserver.next(true),
                ),
              ).remove,
            ),
            new Observable<void>(
              (mapsEventObserver: Observer<void>): TeardownLogic => map.addListener(
                "idle",
                (): void => ngZone.run(
                  (): void => mapsEventObserver.next(),
                ),
              ).remove,
            ).pipe<false>(
              switchMap<void, Observable<false>>(
                (): Observable<false> => of<false>(false).pipe<false>(
                  delay<false>(1000),
                ),
              ),
            ),
            new Observable<true>(
              (mapsEventObserver: Observer<true>): TeardownLogic => map.addListener(
                "tilt_changed",
                (): void => ngZone.run(
                  (): void => mapsEventObserver.next(true),
                ),
              ).remove,
            ),
            new Observable<true>(
              (mapsEventObserver: Observer<true>): TeardownLogic => map.addListener(
                "zoom_changed",
                (): void => ngZone.run(
                  (): void => mapsEventObserver.next(true),
                ),
              ).remove,
            ),
          ),
        ),
        takeUntilDestroyed<boolean>(),
      );
    this
      .mapHasInteraction$ = isPlatformBrowser(platformId) ? toSignal<boolean>(
        this.mapHasInteractionObservable.pipe<boolean>(
          startWith<boolean, [ false ]>(false)
        ),
        {
          requireSync: true,
        },
      ) : signal<boolean>(false);
  }

}
