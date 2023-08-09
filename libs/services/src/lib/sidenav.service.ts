import { Injectable, Signal }       from "@angular/core";
import { toSignal }                 from "@angular/core/rxjs-interop";
import { MatSidenav }               from "@angular/material/sidenav";
import { ReplaySubject, startWith } from "rxjs";


@Injectable({
  providedIn: "root",
})
export class SidenavService {

  public readonly matSidenavEnd$:   Signal<MatSidenav | undefined>;
  public readonly matSidenavStart$: Signal<MatSidenav | undefined>;

  public readonly afterViewInitHandler: (options: { "matSidenavEnd": MatSidenav, "matSidenavStart": MatSidenav }) => void;

  private readonly matSidenavEndSubject:   ReplaySubject<MatSidenav>;
  private readonly matSidenavStartSubject: ReplaySubject<MatSidenav>;

  constructor() {
    this
      .matSidenavEndSubject = new ReplaySubject<MatSidenav>(1);
    this
      .matSidenavEnd$ = toSignal<MatSidenav | undefined>(
        this.matSidenavEndSubject.asObservable().pipe<MatSidenav | undefined>(
          startWith<MatSidenav | undefined>(undefined),
        ),
        {
          requireSync: true,
        },
      );
    this
      .afterViewInitHandler = (options: { "matSidenavEnd": MatSidenav, "matSidenavStart": MatSidenav }): void => {
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
        this.matSidenavStartSubject.asObservable().pipe<MatSidenav | undefined>(
          startWith<MatSidenav | undefined>(undefined),
        ),
        {
          requireSync: true,
        },
      );
  }

}
