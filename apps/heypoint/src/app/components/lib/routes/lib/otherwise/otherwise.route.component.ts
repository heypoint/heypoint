import { CommonModule, isPlatformBrowser }          from "@angular/common";
import { Component, Inject, Optional, PLATFORM_ID } from "@angular/core";
import { PathService }                              from "@heypoint/services";
import { RESPONSE }                                 from "@nguniversal/express-engine/tokens";
import { Response }                                 from "express";


@Component({
  imports:     [
    CommonModule,
  ],
  selector:    "app-otherwise-route",
  standalone:  true,
  styleUrls:   [
    "./otherwise.route.component.sass",
  ],
  templateUrl: "./otherwise.route.component.html",
})
export class OtherwiseRouteComponent {

  constructor(
                @Inject(PLATFORM_ID) platformId: object,
    @Optional() @Inject(RESPONSE)    response:   Response,

    public readonly pathService: PathService,
  ) {
    isPlatformBrowser(platformId) || response
      .status(404);
  }

}
