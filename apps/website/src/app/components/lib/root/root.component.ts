import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { MatSidenav }                          from "@angular/material/sidenav";
import { Meta }                                from "@angular/platform-browser";
import { SidenavService }                      from "@heypoint/services";


@Component({
  selector:    "heypoint-website-root",
  styleUrls:   [
    "./root.component.sass",
  ],
  templateUrl: "./root.component.html",
})
export class RootComponent implements AfterViewInit {

  @ViewChild("endMatSidenav")   private readonly endMatSidenav?:   MatSidenav;
  @ViewChild("startMatSidenav") private readonly startMatSidenav?: MatSidenav;

  constructor(
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
