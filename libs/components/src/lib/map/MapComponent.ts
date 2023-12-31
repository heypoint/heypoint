import { CommonModule, isPlatformBrowser }                     from "@angular/common";
import { HttpClient, HttpClientJsonpModule, HttpClientModule } from "@angular/common/http";
import { Component, Inject, PLATFORM_ID, signal, Signal }      from "@angular/core";
import { toSignal }                                            from "@angular/core/rxjs-interop";
import { GoogleMapsModule }                                    from "@angular/google-maps";
import { ENVIRONMENT }                                         from "@heypoint/injection-tokens";
import { Environment }                                         from "@heypoint/interfaces";
import { MapService }                                          from "@heypoint/services";
import { distinctUntilChanged, map, startWith }                from "rxjs";


@Component({
  imports:     [
    CommonModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
  ],
  selector:    "heypoint-components-map",
  standalone:  true,
  styleUrls:   [
    "./MapComponent.sass",
  ],
  templateUrl: "./MapComponent.html",
})
export class MapComponent {

  public readonly googleMapsAPILoaded$: Signal<boolean>;

  constructor(
    @Inject(ENVIRONMENT) private readonly appEnvironment: Environment,
    @Inject(PLATFORM_ID)     private readonly platformId:     object,

    private readonly httpClient: HttpClient,

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
