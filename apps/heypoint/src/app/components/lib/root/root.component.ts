import { AfterViewInit, Component, Inject, ViewChild } from "@angular/core";
import { MatSidenav }                                  from "@angular/material/sidenav";
import { GIT_INFO, PACKAGE_VERSION }                   from "@heypoint/injection-tokens";
import { SidenavService }                              from "@heypoint/services";
import { GitInfo }                                     from "git-describe";


@Component({
  selector:    "heypoint-root",
  styleUrls:   [
    "./root.component.sass",
  ],
  templateUrl: "./root.component.html",
})
export class RootComponent implements AfterViewInit {

  @ViewChild("matSidenavEnd")   private readonly matSidenavEnd!:   MatSidenav;
  @ViewChild("matSidenavStart") private readonly matSidenavStart!: MatSidenav;

  constructor(
    private readonly sidenavService: SidenavService,

    @Inject(GIT_INFO)        public readonly gitInfo:        Partial<GitInfo>,
    @Inject(PACKAGE_VERSION) public readonly packageVersion: string,
  ) {
  }

  ngAfterViewInit() {
    this
      .sidenavService
      .viewInitializedHandler(
        {
          matSidenavEnd:   this.matSidenavEnd,
          matSidenavStart: this.matSidenavStart,
        },
      );
  }

}
