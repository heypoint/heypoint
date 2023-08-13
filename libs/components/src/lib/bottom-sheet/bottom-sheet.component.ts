import { CommonModule, isPlatformBrowser }                                                                                          from "@angular/common";
import { AfterViewInit, Component, Inject, PLATFORM_ID, Renderer2, signal, Signal, ViewChild }                                      from "@angular/core";
import { toSignal }                                                                                                                 from "@angular/core/rxjs-interop";
import { MatButton, MatButtonModule, MatFabButton }                                                                                 from "@angular/material/button";
import { MatCardModule }                                                                                                            from "@angular/material/card";
import { MatDividerModule }                                                                                                         from "@angular/material/divider";
import { MatExpansionModule }                                                                                                       from "@angular/material/expansion";
import { MatIconModule }                                                                                                            from "@angular/material/icon";
import { MatToolbarModule }                                                                                                         from "@angular/material/toolbar";
import { MapService, SidenavService }                                                                                               from "@heypoint/services";
import { distinctUntilChanged, filter, map, merge, Observable, Observer, ReplaySubject, scan, startWith, switchMap, TeardownLogic } from "rxjs";


@Component({
  imports:     [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatToolbarModule,
  ],
  selector:    "heypoint-bottom-sheet",
  standalone:  true,
  styleUrls:   [
    "./bottom-sheet.component.sass",
  ],
  templateUrl: "./bottom-sheet.component.html",
})
export class BottomSheetComponent implements AfterViewInit {

  @ViewChild("academicBuildingsButton") private readonly academicBuildingsButton!: MatFabButton;
  @ViewChild("residenceHallsButton")    private readonly residenceHallsButton!:    MatFabButton;
  @ViewChild("savedPlacesButton")       private readonly savedPlacesButton!:       MatFabButton;
  @ViewChild("postButton")              private readonly postButton!:              MatButton;
  @ViewChild("exploreButton")           private readonly exploreButton!:           MatButton;

  public readonly expanded$: Signal<boolean>;

  private readonly buttonsSubject: ReplaySubject<{ academicBuildingsButton: MatFabButton, residenceHallsButton: MatFabButton, savedPlacesButton: MatFabButton, postButton: MatButton, exploreButton: MatButton }>;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,

    public readonly sidenavService: SidenavService,

    mapService: MapService,
    renderer2:  Renderer2,
  ) {
    this
      .buttonsSubject = new ReplaySubject<{ academicBuildingsButton: MatFabButton, residenceHallsButton: MatFabButton, savedPlacesButton: MatFabButton, postButton: MatButton, exploreButton: MatButton }>(1);
    this
      .expanded$ = isPlatformBrowser(platformId) ? toSignal<boolean>(
        this.buttonsSubject.asObservable().pipe<boolean, boolean, boolean>(
          switchMap<{ academicBuildingsButton: MatFabButton, residenceHallsButton: MatFabButton, savedPlacesButton: MatFabButton, postButton: MatButton, exploreButton: MatButton }, Observable<boolean>>(
            (buttons: { academicBuildingsButton: MatFabButton, residenceHallsButton: MatFabButton, savedPlacesButton: MatFabButton, postButton: MatButton, exploreButton: MatButton }): Observable<boolean> => merge<[ true, true, true, true, void, false ]>(
              new Observable<true>(
                (buttonEventObserver: Observer<true>): TeardownLogic => renderer2.listen(
                  buttons.academicBuildingsButton._elementRef.nativeElement,
                  "click",
                  (): void => buttonEventObserver.next(true),
                ),
              ),
              new Observable<true>(
                (buttonEventObserver: Observer<true>): TeardownLogic => renderer2.listen(
                  buttons.residenceHallsButton._elementRef.nativeElement,
                  "click",
                  (): void => buttonEventObserver.next(true),
                ),
              ),
              new Observable<true>(
                (buttonEventObserver: Observer<true>): TeardownLogic => renderer2.listen(
                  buttons.savedPlacesButton._elementRef.nativeElement,
                  "click",
                  (): void => buttonEventObserver.next(true),
                ),
              ),
              new Observable<true>(
                (buttonEventObserver: Observer<true>): TeardownLogic => renderer2.listen(
                  buttons.postButton._elementRef.nativeElement,
                  "click",
                  (): void => buttonEventObserver.next(true),
                ),
              ),
              new Observable<void>(
                (buttonEventObserver: Observer<void>): TeardownLogic => renderer2.listen(
                  buttons.exploreButton._elementRef.nativeElement,
                  "click",
                  (): void => buttonEventObserver.next(),
                ),
              ),
              mapService.mapHasInteractionObservable.pipe<true, false>(
                filter<boolean, true>(
                  (mapHasInteraction: boolean): mapHasInteraction is true => mapHasInteraction,
                ),
                map<true, false>(
                  (): false => false,
                ),
              ),
            ).pipe<boolean>(
              scan<boolean | void, boolean>(
                (expanded: boolean, expandedOrToggle: boolean | void): boolean => expandedOrToggle !== void (0) ? expandedOrToggle : !expanded,
                false,
              ),
            ),
          ),
          startWith<boolean, [ false ]>(false),
          distinctUntilChanged<boolean>(),
        ),
        {
          requireSync: true,
        },
      ) : signal<boolean>(false);
  }

  ngAfterViewInit(): void {
    this
      .buttonsSubject
      .next(
        {
          academicBuildingsButton: this.academicBuildingsButton,
          residenceHallsButton:    this.residenceHallsButton,
          savedPlacesButton:       this.savedPlacesButton,
          postButton:              this.postButton,
          exploreButton:           this.exploreButton,
        },
      );
  }

}
