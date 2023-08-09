import { CommonModule, isPlatformBrowser }                                                from "@angular/common";
import { HttpClient, HttpClientJsonpModule, HttpClientModule }                            from "@angular/common/http";
import { Component, computed, Inject, PLATFORM_ID, signal, Signal }                       from "@angular/core";
import { toSignal }                                                                       from "@angular/core/rxjs-interop";
import { GoogleMapsModule }                                                               from "@angular/google-maps";
import { APP_ENVIRONMENT }                                                                from "@heypoint/injection-tokens";
import { AppEnvironment }                                                                 from "@heypoint/interfaces";
import { GeolocationService, ResponsivityService }                                        from "@heypoint/services";
import { map, merge, Observable, Observer, startWith, Subject, switchMap, TeardownLogic } from "rxjs";


@Component({
  imports:     [
    CommonModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
  ],
  selector:    "heypoint-map",
  standalone:  true,
  styleUrls:   [
    "./map.component.sass",
  ],
  templateUrl: "./map.component.html",
})
export class MapComponent {

  public readonly googleMapsAPILoaded$: Signal<boolean>;
  public readonly mapOptions$:          Signal<google.maps.MapOptions>;

  public readonly mapInitializedHandler: (map: google.maps.Map) => void;

  private readonly mapSubject: Subject<google.maps.Map>;
  private readonly mapGeolocationEngaged: Signal<boolean>;

  constructor(
    @Inject(APP_ENVIRONMENT) appEnvironment: AppEnvironment,
    @Inject(PLATFORM_ID)     platformId:     object,

    geolocationService:  GeolocationService,
    httpClient:          HttpClient,
    responsivityService: ResponsivityService,
  ) {
    this
      .googleMapsAPILoaded$ = isPlatformBrowser(platformId) ? toSignal<boolean>(
        httpClient.jsonp(
          "https://maps.googleapis.com/maps/api/js?key=" + appEnvironment.firebase.apiKey,
          "callback",
        ).pipe<boolean, boolean>(
          map<unknown, boolean>(
            (): boolean => true,
          ),
          startWith<boolean>(false),
        ),
        {
          requireSync: true,
        },
      ) : signal<boolean>(false);
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
          equal: (mapOptionsA: google.maps.MapOptions, mapOptionsB: google.maps.MapOptions): boolean => mapOptionsA.center ? this.mapGeolocationEngaged() ? mapOptionsA.center.lat !== mapOptionsB.center?.lat || mapOptionsA.center.lng !== mapOptionsB.center?.lng : true : false,
        },
      );
    this
      .mapInitializedHandler = (map: google.maps.Map): void => this
      .mapSubject
      .next(map);
    this
      .mapSubject = new Subject<google.maps.Map>();
    this
      .mapGeolocationEngaged = isPlatformBrowser(platformId) ? toSignal<boolean>(
        this.mapSubject.asObservable().pipe<boolean, boolean>(
          switchMap<google.maps.Map, Observable<boolean>>(
            (map: google.maps.Map): Observable<boolean> => merge<[boolean, boolean, boolean, boolean]>(
              new Observable<boolean>(
                (mapsEventObserver: Observer<boolean>): TeardownLogic => map.addListener(
                  "dblclick",
                  (): void => mapsEventObserver.next(false),
                ).remove,
              ),
              new Observable<boolean>(
                (mapsEventObserver: Observer<boolean>): TeardownLogic => map.addListener(
                  "dragstart",
                  (): void => mapsEventObserver.next(false),
                ).remove,
              ),
              new Observable<boolean>(
                (mapsEventObserver: Observer<boolean>): TeardownLogic => map.addListener(
                  "zoom_changed",
                  (): void => mapsEventObserver.next(false),
                ).remove,
              ),
              new Observable<boolean>(
                (mapsEventObserver: Observer<boolean>): TeardownLogic => map.addListener(
                  "idle",
                  (): void => mapsEventObserver.next(true),
                ).remove,
              ),
            ),
          ),
          startWith<boolean>(true),
        ),
        {
          requireSync: true,
        },
      ) : signal<boolean>(true);
  }

}
