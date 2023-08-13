import { CommonModule, isPlatformBrowser }                     from "@angular/common";
import { HttpClient, HttpClientJsonpModule, HttpClientModule } from "@angular/common/http";
import { Component, Inject, PLATFORM_ID, signal, Signal }      from "@angular/core";
import { toSignal }                                            from "@angular/core/rxjs-interop";
import { GoogleMapsModule }                                    from "@angular/google-maps";
import { APP_ENVIRONMENT }                                     from "@heypoint/injection-tokens";
import { AppEnvironment }                                      from "@heypoint/interfaces";
import { MapService }                                          from "@heypoint/services";
import { distinctUntilChanged, map, startWith }                from "rxjs";


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

  constructor(
    @Inject(APP_ENVIRONMENT) appEnvironment: AppEnvironment,
    @Inject(PLATFORM_ID)     platformId:     object,

    httpClient: HttpClient,

    public readonly mapService: MapService,
  ) {
    this
      .googleMapsAPILoaded$ = isPlatformBrowser(platformId) ? toSignal(
        httpClient.jsonp(
          "https://maps.googleapis.com/maps/api/js?key=" + appEnvironment.firebase.apiKey,
          "callback",
        ).pipe<true, boolean, boolean>(
          map<unknown, true>(
            (): true => true,
          ),
          startWith<true, [ false ]>(false),
          distinctUntilChanged<boolean>(),
        ),
        {
          requireSync: true,
        },
      ) : signal<boolean>(false);
  }

}
