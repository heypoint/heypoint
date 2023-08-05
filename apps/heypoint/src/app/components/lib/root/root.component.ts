import { Component, Inject }         from "@angular/core";
import { GIT_INFO, PACKAGE_VERSION } from "@heypoint/injection-tokens";
import { ResponsivityService }       from "@heypoint/services";
import { GitInfo }                   from "git-describe";


@Component({
  selector:    "app-root",
  styleUrls:   [
    "./root.component.sass",
  ],
  templateUrl: "./root.component.html",
})
export class RootComponent {

  constructor(
    @Inject(GIT_INFO)        public readonly gitInfo: Partial<GitInfo>,
    @Inject(PACKAGE_VERSION) public readonly packageVersion: string,

    public readonly responsivityService: ResponsivityService,
  ) {
  }

}
