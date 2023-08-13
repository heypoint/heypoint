import { Injectable, Signal }                             from "@angular/core";
import { toSignal }                                       from "@angular/core/rxjs-interop";
import { MatSidenav }                                     from "@angular/material/sidenav";
import { distinctUntilChanged, ReplaySubject, startWith } from "rxjs";


@Injectable({
  providedIn: "root",
})
export class SidenavService {

  public readonly matSidenavEnd$:   Signal<MatSidenav | undefined>;
  public readonly matSidenavStart$: Signal<MatSidenav | undefined>;

  public readonly viewInitializedHandler: (options: { "matSidenavEnd": MatSidenav, "matSidenavStart": MatSidenav }) => void;

  private readonly matSidenavEndSubject:   ReplaySubject<MatSidenav>;
  private readonly matSidenavStartSubject: ReplaySubject<MatSidenav>;

  constructor() {
    this
      .matSidenavEndSubject = new ReplaySubject<MatSidenav>(1);
    this
      .matSidenavEnd$ = toSignal<MatSidenav | undefined>(
        this.matSidenavEndSubject.asObservable().pipe<MatSidenav | undefined, MatSidenav | undefined>(
          startWith<MatSidenav | undefined>(undefined),
          distinctUntilChanged<MatSidenav | undefined>(),
        ),
        {
          requireSync: true,
        },
      );
    this
      .viewInitializedHandler = (options: { "matSidenavEnd": MatSidenav, "matSidenavStart": MatSidenav }): void => {
        this
          .matSidenavEndSubject
          .next(options.matSidenavEnd);

        this
          .matSidenavStartSubject
          .next(options.matSidenavStart);
      };
    this
      .matSidenavStartSubject = new ReplaySubject<MatSidenav>(1);
    this
      .matSidenavStart$ = toSignal<MatSidenav | undefined>(
        this.matSidenavStartSubject.asObservable().pipe<MatSidenav | undefined, MatSidenav | undefined>(
          startWith<MatSidenav | undefined, [ undefined ]>(undefined),
          distinctUntilChanged<MatSidenav | undefined>(),
        ),
        {
          requireSync: true,
        },
      );
  }

}
