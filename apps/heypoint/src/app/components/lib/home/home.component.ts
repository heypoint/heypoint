import { CommonModule, isPlatformBrowser }                                                                from "@angular/common";
import { HttpClient, HttpClientJsonpModule, HttpClientModule }                                            from "@angular/common/http";
import { Component, computed, Inject, PLATFORM_ID, signal, Signal }                                       from "@angular/core";
import { takeUntilDestroyed, toSignal }                                                                   from "@angular/core/rxjs-interop";
import { GoogleMapsModule }                                                                               from "@angular/google-maps";
import { GeolocationService }                                                                             from "@heypoint/services";
import { Geolocation }                                                                                    from "@heypoint/types";
import { catchError, map, merge, Observable, Observer, of, startWith, Subject, switchMap, TeardownLogic } from "rxjs";
import { environment }                                                                                    from "../../../../environments/environment";


@Component({
  imports: [
    CommonModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule
  ],
  selector: "app-home",
  standalone: true,
  styleUrls: [
    "./home.component.sass",
  ],
  templateUrl: "./home.component.html",
})
export class HomeComponent {

  public readonly googleMapsAPILoaded: Signal<boolean>;
  public readonly map: Subject<google.maps.Map>;
  public readonly mapGeolocationEngaged: Signal<boolean>;
  public readonly mapOptions: Signal<google.maps.MapOptions>;

  constructor(
    @Inject(PLATFORM_ID)
    private readonly platformId: object,

    geolocationService: GeolocationService,
    httpClient: HttpClient,
  ) {
    this
      .googleMapsAPILoaded = isPlatformBrowser(platformId) ? toSignal<boolean>(httpClient.jsonp("https://maps.googleapis.com/maps/api/js?key=" + environment.firebase.apiKey, "callback").pipe<boolean, boolean, boolean, boolean>(
        map<unknown, boolean>((): boolean => true),
        catchError<boolean, Observable<boolean>>((): Observable<boolean> => of<boolean>(false)),
        startWith<boolean>(false),
        takeUntilDestroyed<boolean>(),
      ), {
        requireSync: true,
      }) : signal<boolean>(false);
    this
      .map = new Subject<google.maps.Map>();
    this
      .mapGeolocationEngaged = isPlatformBrowser(platformId) ? toSignal<boolean>(this.map.asObservable().pipe<boolean, boolean, boolean>(
        switchMap<google.maps.Map, Observable<boolean>>((map: google.maps.Map): Observable<boolean> => merge(
          new Observable<boolean>((mapsEventObserver: Observer<boolean>): TeardownLogic => map.addListener("dblclick", ((): void => mapsEventObserver.next(false))).remove),
          new Observable<boolean>((mapsEventObserver: Observer<boolean>): TeardownLogic => map.addListener("dragstart", ((): void => mapsEventObserver.next(false))).remove),
          new Observable<boolean>((mapsEventObserver: Observer<boolean>): TeardownLogic => map.addListener("zoom_changed", ((): void => mapsEventObserver.next(false))).remove),
          new Observable<boolean>((mapsEventObserver: Observer<boolean>): TeardownLogic => map.addListener("idle", ((): void => mapsEventObserver.next(true))).remove),
        )),
        startWith<boolean>(true),
        takeUntilDestroyed<boolean>(),
      ), {
        requireSync: true,
      }) : signal<boolean>(true);
    this
      .mapOptions = computed<google.maps.MapOptions>((): google.maps.MapOptions => ({
        center: ((geolocation: Geolocation | null): google.maps.LatLngLiteral | null => geolocation && ({
          lat: geolocation.lat,
          lng: geolocation.lng,
        }))(geolocationService.geolocation()),
        clickableIcons: false,
        disableDefaultUI: true,
        gestureHandling: "greedy",
        heading: geolocationService.geolocation()?.heading,
        mapId: "f548c074ff2b28a2",
        maxZoom: 20,
        minZoom: 10,
      }), {
        equal: (mapOptions: google.maps.MapOptions): boolean => mapOptions.center ? !this.mapGeolocationEngaged() : false,
      });
  }

}
