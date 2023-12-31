import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { MatSidenav }                          from "@angular/material/sidenav";
import { SidenavService }                      from "@heypoint/services";


@Component({
  selector:    "heypoint-website-root",
  styleUrls:   [
    "./RootComponent.sass",
  ],
  templateUrl: "./RootComponent.html",
})
export class RootComponent implements AfterViewInit {

  @ViewChild("endMatSidenav")   private readonly endMatSidenav?:   MatSidenav;
  @ViewChild("startMatSidenav") private readonly startMatSidenav?: MatSidenav;

  constructor(
    private readonly sidenavService: SidenavService,
  ) {
  }

  ngAfterViewInit(): void {
    this
      .sidenavService
      .viewInitializedHandler(
        {
          endMatSidenav:   this.endMatSidenav,
          startMatSidenav: this.startMatSidenav,
        },
      );
  }

}
