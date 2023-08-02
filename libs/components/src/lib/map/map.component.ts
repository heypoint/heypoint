import { CommonModule, isPlatformBrowser }                                                                from "@angular/common";
import { HttpClient, HttpClientJsonpModule, HttpClientModule }                                            from "@angular/common/http";
import { Component, Inject, PLATFORM_ID, Signal, computed, signal }                                       from "@angular/core";
import { takeUntilDestroyed, toSignal }                                                                   from "@angular/core/rxjs-interop";
import { GoogleMapsModule }                                                                               from "@angular/google-maps";
import { APP_ENVIRONMENT }                                                                                from "@heypoint/injection-tokens";
import { GeolocationService }                                                                             from "@heypoint/services";
import { AppEnvironment }                                                                                 from "@heypoint/types";
import { Observable, Observer, Subject, TeardownLogic, merge, startWith, switchMap, map, catchError, of } from "rxjs";


@Component({
  imports: [
    CommonModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
  ],
  selector: "heypoint-map",
  standalone: true,
  styleUrls: [
    "./map.component.sass",
  ],
  templateUrl: "./map.component.html",
})
export class MapComponent {

  public readonly googleMapsAPILoaded: Signal<boolean>;
  public readonly map:                 Subject<google.maps.Map>;
  public readonly mapOptions:          Signal<google.maps.MapOptions>;

  private readonly mapGeolocationEngaged: Signal<boolean>;

  constructor(
    @Inject(APP_ENVIRONMENT) private readonly appEnvironment: AppEnvironment,
    @Inject(PLATFORM_ID)     private readonly platformId: object,

    geolocationService: GeolocationService,
    httpClient:         HttpClient,
  ) {
    this
      .googleMapsAPILoaded = isPlatformBrowser(platformId) ? toSignal<boolean>(
        httpClient.jsonp(
          "https://maps.googleapis.com/maps/api/js?key=" + appEnvironment.firebase.apiKey,
          "callback",
        ).pipe<boolean, boolean, boolean, boolean>(
          map<unknown, boolean>(
            (): boolean => true,
          ),
          catchError<boolean, Observable<boolean>>(
            (): Observable<boolean> => of<boolean>(false),
          ),
          startWith<boolean>(false),
          takeUntilDestroyed<boolean>(),
        ),
        {
          requireSync: true,
        },
      ) : signal<boolean>(false);
    this
      .map = new Subject<google.maps.Map>();
    this
      .mapOptions = computed<google.maps.MapOptions>(
        (): google.maps.MapOptions => ({
          center: ((geolocationPosition: GeolocationPosition | null): google.maps.LatLngLiteral | null => geolocationPosition && ({
            lat: geolocationPosition.coords.latitude,
            lng: geolocationPosition.coords.longitude,
          }))(geolocationService.geolocationPosition()),
          clickableIcons: false,
          disableDefaultUI: true,
          gestureHandling: "greedy",
          mapId: "f548c074ff2b28a2",
          maxZoom: 20,
          minZoom: 10,
        }),
        {
          equal: (mapOptionsA: google.maps.MapOptions, mapOptionsB: google.maps.MapOptions): boolean => mapOptionsA.center ? this.mapGeolocationEngaged() ? JSON.stringify(mapOptionsA.center) !== JSON.stringify(mapOptionsB.center) : true : false,
        },
      );
    this
      .mapGeolocationEngaged = isPlatformBrowser(platformId) ? toSignal<boolean>(
        this.map.asObservable().pipe<boolean, boolean, boolean>(
          switchMap<google.maps.Map, Observable<boolean>>(
            (map: google.maps.Map): Observable<boolean> => merge<[boolean, boolean, boolean]>(
              new Observable<boolean>((mapsEventObserver: Observer<boolean>): TeardownLogic => map.addListener(
                "dblclick",
                ((): void => mapsEventObserver.next(false)),
              ).remove),
              new Observable<boolean>((mapsEventObserver: Observer<boolean>): TeardownLogic => map.addListener(
                "dragstart",
                ((): void => mapsEventObserver.next(false)),
              ).remove),
              new Observable<boolean>((mapsEventObserver: Observer<boolean>): TeardownLogic => map.addListener(
                "zoom_changed",
                ((): void => mapsEventObserver.next(false)),
              ).remove),
            ),
          ),
          startWith<boolean>(true),
          takeUntilDestroyed<boolean>(),
        ),
        {
          requireSync: true,
        },
      ) : signal<boolean>(true);
  }

}
