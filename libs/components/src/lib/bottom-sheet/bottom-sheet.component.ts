import { CommonModule, isPlatformBrowser }                                                                                          from "@angular/common";
import { AfterViewInit, Component, Inject, PLATFORM_ID, Renderer2, signal, Signal, ViewChild }                                      from "@angular/core";
import { takeUntilDestroyed, toSignal }                                                                                             from "@angular/core/rxjs-interop";
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
  selector:    "heypoint-components-bottom-sheet",
  standalone:  true,
  styleUrls:   [
    "./bottom-sheet.component.sass",
  ],
  templateUrl: "./bottom-sheet.component.html",
})
export class BottomSheetComponent implements AfterViewInit {

  @ViewChild("academicBuildingsMatButton") private readonly academicBuildingsMatButton?: MatFabButton;
  @ViewChild("residenceHallsMatButton")    private readonly residenceHallsMatButton?:    MatFabButton;
  @ViewChild("savedPlacesMatButton")       private readonly savedPlacesMatButton?:       MatFabButton;
  @ViewChild("postMatButton")              private readonly postMatButton?:              MatButton;
  @ViewChild("exploreMatButton")           private readonly exploreMatButton?:           MatButton;

  private readonly matButtonsSubject: ReplaySubject<{ "academicBuildingsMatButton"?: MatFabButton, "residenceHallsMatButton"?: MatFabButton, "savedPlacesMatButton"?: MatFabButton, "postMatButton"?: MatButton, "exploreMatButton"?: MatButton }>;

  public readonly expanded$: Signal<boolean>;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: object,

    private readonly mapService: MapService,
    private readonly renderer2:  Renderer2,

    public readonly sidenavService: SidenavService,
  ) {
    this
      .matButtonsSubject = new ReplaySubject<{ "academicBuildingsMatButton"?: MatFabButton, "residenceHallsMatButton"?: MatFabButton, "savedPlacesMatButton"?: MatFabButton, "postMatButton"?: MatButton, "exploreMatButton"?: MatButton }>(1);
    this
      .expanded$ = isPlatformBrowser(platformId) ? toSignal<boolean>(
        this.matButtonsSubject.asObservable().pipe<{ "academicBuildingsMatButton": MatFabButton, "residenceHallsMatButton": MatFabButton, "savedPlacesMatButton": MatFabButton, "postMatButton": MatButton, "exploreMatButton": MatButton }, boolean, boolean, boolean, boolean>(
          filter<{ "academicBuildingsMatButton"?: MatFabButton, "residenceHallsMatButton"?: MatFabButton, "savedPlacesMatButton"?: MatFabButton, "postMatButton"?: MatButton, "exploreMatButton"?: MatButton }, { "academicBuildingsMatButton": MatFabButton, "residenceHallsMatButton": MatFabButton, "savedPlacesMatButton": MatFabButton, "postMatButton": MatButton, "exploreMatButton": MatButton }>(
            (buttons: { "academicBuildingsMatButton"?: MatFabButton, "residenceHallsMatButton"?: MatFabButton, "savedPlacesMatButton"?: MatFabButton, "postMatButton"?: MatButton, "exploreMatButton"?: MatButton }): buttons is { "academicBuildingsMatButton": MatFabButton, "residenceHallsMatButton": MatFabButton, "savedPlacesMatButton": MatFabButton, "postMatButton": MatButton, "exploreMatButton": MatButton } => !(!buttons.academicBuildingsMatButton || !buttons.residenceHallsMatButton || !buttons.savedPlacesMatButton || !buttons.postMatButton || !buttons.exploreMatButton),
          ),
          switchMap<{ "academicBuildingsMatButton": MatFabButton, "residenceHallsMatButton": MatFabButton, "savedPlacesMatButton": MatFabButton, "postMatButton": MatButton, "exploreMatButton": MatButton }, Observable<boolean>>(
            (buttons: { "academicBuildingsMatButton": MatFabButton, "residenceHallsMatButton": MatFabButton, "savedPlacesMatButton": MatFabButton, "postMatButton": MatButton, "exploreMatButton": MatButton }): Observable<boolean> => merge<[ true, true, true, true, void, false ]>(
              new Observable<true>(
                (buttonEventObserver: Observer<true>): TeardownLogic => renderer2.listen(
                  buttons.academicBuildingsMatButton._elementRef.nativeElement,
                  "click",
                  (): void => buttonEventObserver.next(true),
                ),
              ),
              new Observable<true>(
                (buttonEventObserver: Observer<true>): TeardownLogic => renderer2.listen(
                  buttons.residenceHallsMatButton._elementRef.nativeElement,
                  "click",
                  (): void => buttonEventObserver.next(true),
                ),
              ),
              new Observable<true>(
                (buttonEventObserver: Observer<true>): TeardownLogic => renderer2.listen(
                  buttons.savedPlacesMatButton._elementRef.nativeElement,
                  "click",
                  (): void => buttonEventObserver.next(true),
                ),
              ),
              new Observable<true>(
                (buttonEventObserver: Observer<true>): TeardownLogic => renderer2.listen(
                  buttons.postMatButton._elementRef.nativeElement,
                  "click",
                  (): void => buttonEventObserver.next(true),
                ),
              ),
              new Observable<void>(
                (buttonEventObserver: Observer<void>): TeardownLogic => renderer2.listen(
                  buttons.exploreMatButton._elementRef.nativeElement,
                  "click",
                  (): void => buttonEventObserver.next(),
                ),
              ),
              mapService.mapHasInteractionObservable.pipe<true, false>(
                filter<boolean, true>(
                  (mapHasInteraction: boolean): mapHasInteraction is true => mapHasInteraction,
                ),
                map<true, false>((mapHasInteraction: true) => !mapHasInteraction),
              ),
            ).pipe<boolean>(
              scan<boolean | void, boolean>(
                (expanded: boolean, expandedOrToggle: boolean | void): boolean => expandedOrToggle === void (0) ? !expanded : expandedOrToggle,
                false,
              ),
            ),
          ),
          startWith<boolean, [ false ]>(false),
          distinctUntilChanged<boolean>(),
          takeUntilDestroyed<boolean>(),
        ),
        {
          requireSync: true,
          manualCleanup: true,
        },
      ) : signal<boolean>(false);
  }

  ngAfterViewInit(): void {
    this
      .matButtonsSubject
      .next(
        {
          academicBuildingsMatButton: this.academicBuildingsMatButton,
          residenceHallsMatButton:    this.residenceHallsMatButton,
          savedPlacesMatButton:       this.savedPlacesMatButton,
          postMatButton:              this.postMatButton,
          exploreMatButton:           this.exploreMatButton,
        },
      );
  }

}
