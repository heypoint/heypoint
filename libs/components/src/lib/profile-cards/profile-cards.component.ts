import { CommonModule }                           from "@angular/common";
import { Component }                              from "@angular/core";
import { MatButtonModule }                        from "@angular/material/button";
import { MatCardModule }                          from "@angular/material/card";
import { MatDividerModule }                       from "@angular/material/divider";
import { MatExpansionModule }                     from "@angular/material/expansion";
import { MatIconModule }                          from "@angular/material/icon";
import { AuthenticationService, EllipsesService } from "@heypoint/services";


@Component({
  imports:     [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
  ],
  selector:    "heypoint-components-profile-cards",
  standalone:  true,
  styleUrls:   [
    "./profile-cards.component.sass",
  ],
  templateUrl: "./profile-cards.component.html",
})
export class ProfileCardsComponent {
  constructor(
    public readonly authenticationService: AuthenticationService,
    public readonly ellipsesService:       EllipsesService,
  ) {
  }
}
