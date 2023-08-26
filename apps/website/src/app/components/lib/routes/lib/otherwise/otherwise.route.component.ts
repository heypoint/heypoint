import { CommonModule, isPlatformBrowser }          from "@angular/common";
import { Component, Inject, Optional, PLATFORM_ID } from "@angular/core";
import { Meta }                                     from "@angular/platform-browser";
import { PathService }                              from "@heypoint/services";
import { RESPONSE }                                 from "@nguniversal/express-engine/tokens";
import { Response }                                 from "express";


@Component({
  imports:     [
    CommonModule,
  ],
  selector:    "heypoint-website-otherwise-route",
  standalone:  true,
  styleUrls:   [
    "./otherwise.route.component.sass",
  ],
  templateUrl: "./otherwise.route.component.html",
})
export class OtherwiseRouteComponent {

  constructor(
                @Inject(PLATFORM_ID) private readonly platformId: object,
    @Optional() @Inject(RESPONSE)    private readonly response:   Response,

    private readonly meta: Meta,

    public readonly pathService: PathService,
  ) {
    meta
      .updateTag(
        {
          "name": "description",
          "content": "Heypoint is a work in progress. This page was not found.",
        },
      );

    isPlatformBrowser(platformId) || response
      .status(404);
  }

}
