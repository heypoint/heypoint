import { CommonModule, isPlatformBrowser }                          from "@angular/common";
import { HttpClient, HttpClientJsonpModule, HttpClientModule }      from "@angular/common/http";
import { Component, computed, Inject, PLATFORM_ID, signal, Signal } from "@angular/core";
import { toSignal }                                                 from "@angular/core/rxjs-interop";
import { GoogleMapsModule }                                         from "@angular/google-maps";
import { GeolocationService }                                       from "@heypoint/services";
import { catchError, map, Observable, of, startWith }               from "rxjs";
import { environment }                                              from "../../../../environments/environment";


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
  public readonly mapOptions: Signal<google.maps.MapOptions>;

  constructor(
    public readonly geolocationService: GeolocationService,

    @Inject(PLATFORM_ID)
    private readonly platformId: object,

    httpClient: HttpClient,
  ) {
    this
      .googleMapsAPILoaded = isPlatformBrowser(platformId) ? toSignal<boolean>(httpClient.jsonp("https://maps.googleapis.com/maps/api/js?key=" + environment.firebase.apiKey, "callback").pipe<boolean, boolean, boolean>(
        map<unknown, boolean>((): boolean => true),
        startWith<boolean>(false),
        catchError<boolean, Observable<boolean>>((): Observable<boolean> => of<boolean>(false)),
      ), {
        requireSync: true,
      }) : signal<boolean>(false);

    this
      .mapOptions = computed<google.maps.MapOptions>((): google.maps.MapOptions => {
        return {
          center: this.geolocationService.geolocation(),
          clickableIcons: false,
          disableDefaultUI: true,
          gestureHandling: "greedy",
          mapId: "f548c074ff2b28a2"
        }
      });
  }

}
