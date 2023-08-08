import { CommonModule }                                            from "@angular/common";
import { Component }                                               from "@angular/core";
import { takeUntilDestroyed }                                      from "@angular/core/rxjs-interop";
import { MatBottomSheet, MatBottomSheetModule, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatSidenav }                                              from "@angular/material/sidenav";
import { SidenavService }                                          from "@heypoint/services";
import { map, merge, Observable, startWith, switchMap }            from "rxjs";
import { BottomSheetComponent }                                    from "../../../bottom-sheet/bottom-sheet.component";
import { MapComponent }                                            from "../../../map/map.component";


@Component({
  imports:     [
    CommonModule,
    MapComponent,
    MatBottomSheetModule,
  ],
  selector:    "heypoint-home",
  standalone:  true,
  styleUrls:   [
    "./home.route.component.sass",
  ],
  templateUrl: "./home.route.component.html",
})
export class HomeRouteComponent {

  private matBottomSheetRef?: MatBottomSheetRef;

  constructor(
    matBottomSheet: MatBottomSheet,
    sidenavService: SidenavService,
  ) {
    merge<[boolean, boolean]>(
      sidenavService.matEndSidenavSubject.asObservable().pipe<boolean>(
        switchMap<MatSidenav, Observable<boolean>>(
          (matSidenav: MatSidenav): Observable<boolean> => merge<[boolean, boolean]>(
            matSidenav.closedStart.pipe<boolean>(
              map<void, boolean>(
                (): boolean => true,
              ),
            ),
            matSidenav.openedStart.pipe<boolean>(
              map<void, boolean>(
                (): boolean => false,
              ),
            ),
          ),
        ),
      ),
      sidenavService.matStartSidenavSubject.asObservable().pipe<boolean>(
        switchMap<MatSidenav, Observable<boolean>>(
          (matSidenav: MatSidenav): Observable<boolean> => merge<[boolean, boolean]>(
            matSidenav.closedStart.pipe<boolean>(
              map<void, boolean>(
                (): boolean => true,
              ),
            ),
            matSidenav.openedStart.pipe<boolean>(
              map<void, boolean>(
                (): boolean => false,
              ),
            ),
          ),
        ),
      ),
    )
      .pipe<boolean, boolean>(
        startWith<boolean>(true),
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
                  hasBackdrop: false,
                },
              );
          })();
        },
      );
  }
}
