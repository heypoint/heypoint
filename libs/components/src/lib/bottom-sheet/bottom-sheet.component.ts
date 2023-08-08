import { CommonModule }     from "@angular/common";
import { Component }        from "@angular/core";
import { MatButtonModule }  from "@angular/material/button";
import { MatCardModule }    from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule }    from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { SidenavService }   from "@heypoint/services";


@Component({
  imports:     [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatToolbarModule,
  ],
  selector:    "heypoint-bottom-sheet",
  standalone:  true,
  styleUrls:   [
    "./bottom-sheet.component.sass",
  ],
  templateUrl: "./bottom-sheet.component.html",
})
export class BottomSheetComponent {

  constructor(
    public readonly sidenavService: SidenavService,
  ) {
  }

}
