import { CommonModule }                                            from "@angular/common";
import { Component }                                               from "@angular/core";
import { takeUntilDestroyed }                                      from "@angular/core/rxjs-interop";
import { MatBottomSheet, MatBottomSheetModule, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatSidenav }                                              from "@angular/material/sidenav";
import { Meta }                                                    from "@angular/platform-browser";
import { BottomSheetComponent, MapComponent }                      from "@heypoint/components";
import { SidenavService }                                          from "@heypoint/services";
import { filter, map, merge, Observable, startWith, switchMap }    from "rxjs";


@Component({
  imports:     [
    CommonModule,
    MapComponent,
    MatBottomSheetModule,
  ],
  selector:    "heypoint-website-home-route",
  standalone:  true,
  styleUrls:   [
    "./home.route.component.sass",
  ],
  templateUrl: "./home.route.component.html",
})
export class HomeRouteComponent {

  private matBottomSheetRef?: MatBottomSheetRef;

  constructor(
    private readonly matBottomSheet: MatBottomSheet,
    private readonly meta:           Meta,
    private readonly sidenavService: SidenavService,
  ) {
    meta
      .updateTag(
        {
          "name": "description",
          "content": "Heypoint is a work in progress.",
        },
      );

    sidenavService
      .matSidenavsObservable
      .pipe<{ "startMatSidenav": MatSidenav, "endMatSidenav": MatSidenav }, boolean, boolean, boolean>(
        filter<{ "startMatSidenav"?: MatSidenav, "endMatSidenav"?: MatSidenav }, { "startMatSidenav": MatSidenav, "endMatSidenav": MatSidenav }>(
          (matSidenavs: { "startMatSidenav"?: MatSidenav, "endMatSidenav"?: MatSidenav }): matSidenavs is { "startMatSidenav": MatSidenav, "endMatSidenav": MatSidenav } => !(!matSidenavs.startMatSidenav || !matSidenavs.endMatSidenav),
        ),
        switchMap<{ "startMatSidenav": MatSidenav, "endMatSidenav": MatSidenav }, Observable<boolean>>(
          (matSidenavs: { "startMatSidenav": MatSidenav, "endMatSidenav": MatSidenav }): Observable<boolean> => merge<[boolean, boolean, boolean, boolean]>(
            matSidenavs.endMatSidenav.closedStart.pipe<boolean>(
              map<void, boolean>(
                (): boolean => true,
              ),
            ),
            matSidenavs.endMatSidenav.openedStart.pipe<boolean>(
              map<void, boolean>(
                (): boolean => false,
              ),
            ),
            matSidenavs.startMatSidenav.closedStart.pipe<boolean>(
              map<void, boolean>(
                (): boolean => true,
              ),
            ),
            matSidenavs.startMatSidenav.openedStart.pipe<boolean>(
              map<void, boolean>(
                (): boolean => false,
              ),
            ),
          ),
        ),
        startWith<boolean, [true]>(true),
        takeUntilDestroyed<boolean>(),
      )
      .subscribe(
        (opened: boolean): void => {
          this
            .matBottomSheetRef
            ?.dismiss();

          opened && ((): void => {
            this
              .matBottomSheetRef = matBottomSheet
              .open(
                BottomSheetComponent,
                {
                  disableClose: true,
                  hasBackdrop:  false,
                },
              );
          })();
        },
      );
  }
}
