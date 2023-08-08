import { AfterViewInit, Component, Inject, ViewChild } from "@angular/core";
import { MatSidenav }                                  from "@angular/material/sidenav";
import { GIT_INFO, PACKAGE_VERSION }                   from "@heypoint/injection-tokens";
import { SidenavService }                              from "@heypoint/services";
import { GitInfo }                                     from "git-describe";


@Component({
  selector:    "app-root",
  styleUrls:   [
    "./root.component.sass",
  ],
  templateUrl: "./root.component.html",
})
export class RootComponent implements AfterViewInit {

  @ViewChild("matEndSidenav")   private readonly matEndSidenav!:   MatSidenav;
  @ViewChild("matStartSidenav") private readonly matStartSidenav!: MatSidenav;

  constructor(
    @Inject(GIT_INFO)        public readonly gitInfo:        Partial<GitInfo>,
    @Inject(PACKAGE_VERSION) public readonly packageVersion: string,

    private readonly sidenavService: SidenavService,
  ) {
  }

  ngAfterViewInit() {
    this
      .sidenavService
      .matEndSidenavSubject
      .next(this.matEndSidenav);
    this
      .sidenavService
      .matStartSidenavSubject
      .next(this.matStartSidenav);
  }

}
