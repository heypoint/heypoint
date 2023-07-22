import { CommonModule, isPlatformBrowser }                     from "@angular/common";
import { HttpClient, HttpClientJsonpModule, HttpClientModule } from "@angular/common/http";
import { Component, Inject, PLATFORM_ID, signal, Signal }      from "@angular/core";
import { toSignal }                                            from "@angular/core/rxjs-interop";
import { GoogleMapsModule }                                    from "@angular/google-maps";
import { catchError, map, Observable, of, startWith }          from "rxjs";
import { environment }                                         from "../../../../environments/environment";


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

  constructor(
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
  }

}
