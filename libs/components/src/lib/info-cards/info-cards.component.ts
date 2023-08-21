import { CommonModule }              from "@angular/common";
import { Component, Inject }         from "@angular/core";
import { MatButtonModule }           from "@angular/material/button";
import { MatCardModule }             from "@angular/material/card";
import { MatDividerModule }          from "@angular/material/divider";
import { MatExpansionModule }        from "@angular/material/expansion";
import { MatIconModule }             from "@angular/material/icon";
import { GIT_INFO, PACKAGE_VERSION } from "@heypoint/injection-tokens";
import { GitInfo }                   from "git-describe";


@Component({
  imports:     [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
  ],
  selector:    "heypoint-components-info-cards",
  standalone:  true,
  styleUrls:   [
    "./info-cards.component.sass",
  ],
  templateUrl: "./info-cards.component.html",
})
export class InfoCardsComponent {
  constructor(
    @Inject(GIT_INFO)        public readonly gitInfo:        Partial<GitInfo>,
    @Inject(PACKAGE_VERSION) public readonly packageVersion: string,
  ) {
  }
}
