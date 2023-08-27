import { Injectable, Signal }                        from "@angular/core";
import { toSignal }                                  from "@angular/core/rxjs-interop";
import { MatSidenav }                                from "@angular/material/sidenav";
import { map, Observable, ReplaySubject, startWith } from "rxjs";


@Injectable({
  providedIn: "root",
})
export class SidenavService {

  private readonly matSidenavsSubject: ReplaySubject<{ "startMatSidenav"?: MatSidenav, "endMatSidenav"?: MatSidenav }>;

  public readonly matSidenavsObservable: Observable<{ "startMatSidenav"?: MatSidenav, "endMatSidenav"?: MatSidenav }>;
  public readonly endMatSidenav$:        Signal<MatSidenav | undefined>;
  public readonly startMatSidenav$:      Signal<MatSidenav | undefined>;

  public readonly viewInitializedHandler: (matSidenavs: { "startMatSidenav"?: MatSidenav, "endMatSidenav"?: MatSidenav }) => void;

  constructor() {
    this
      .matSidenavsSubject = new ReplaySubject<{ "startMatSidenav"?: MatSidenav, "endMatSidenav"?: MatSidenav }>(1);
    this
      .matSidenavsObservable = this
      .matSidenavsSubject
      .asObservable();
    this
      .endMatSidenav$ = toSignal<MatSidenav | undefined>(
        this.matSidenavsObservable.pipe<MatSidenav | undefined, MatSidenav | undefined>(
          map<{ "startMatSidenav"?: MatSidenav, "endMatSidenav"?: MatSidenav }, MatSidenav | undefined>((matSidenavs: { "startMatSidenav"?: MatSidenav, "endMatSidenav"?: MatSidenav }): MatSidenav | undefined => matSidenavs.endMatSidenav),
          startWith<MatSidenav | undefined>(undefined),
        ),
        {
          requireSync: true,
        },
      );
    this
      .startMatSidenav$ = toSignal<MatSidenav | undefined>(
        this.matSidenavsObservable.pipe<MatSidenav | undefined, MatSidenav | undefined>(
          map<{ "startMatSidenav"?: MatSidenav, "endMatSidenav"?: MatSidenav }, MatSidenav | undefined>((matSidenavs: { "startMatSidenav"?: MatSidenav, "endMatSidenav"?: MatSidenav }): MatSidenav | undefined => matSidenavs.startMatSidenav),
          startWith<MatSidenav | undefined, [ undefined ]>(undefined),
        ),
        {
          requireSync: true,
        },
      );
    this
      .viewInitializedHandler = (matSidenavs: { "startMatSidenav"?: MatSidenav, "endMatSidenav"?: MatSidenav }) => this
      .matSidenavsSubject
      .next(matSidenavs);
  }

}
