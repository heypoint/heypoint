import { Injectable, Signal }       from "@angular/core";
import { toSignal }                 from "@angular/core/rxjs-interop";
import { MatSidenav }               from "@angular/material/sidenav";
import { ReplaySubject, startWith } from "rxjs";


@Injectable({
  providedIn: "root",
})
export class SidenavService {

  public readonly matEndSidenav:          Signal<MatSidenav | undefined>;
  public readonly matEndSidenavSubject:   ReplaySubject<MatSidenav>;
  public readonly matStartSidenav:        Signal<MatSidenav | undefined>;
  public readonly matStartSidenavSubject: ReplaySubject<MatSidenav>;

  constructor() {
    this
      .matEndSidenavSubject = new ReplaySubject<MatSidenav>(1);
    this
      .matEndSidenav = toSignal<MatSidenav | undefined>(
        this.matEndSidenavSubject.asObservable().pipe<MatSidenav | undefined>(
          startWith<MatSidenav | undefined>(undefined),
        ),
        {
          requireSync: true,
        },
      );
    this
      .matStartSidenavSubject = new ReplaySubject<MatSidenav>(1);
    this
      .matStartSidenav = toSignal<MatSidenav | undefined>(
        this.matStartSidenavSubject.asObservable().pipe<MatSidenav | undefined>(
          startWith<MatSidenav | undefined>(undefined),
        ),
        {
          requireSync: true,
        },
      );
  }

}
