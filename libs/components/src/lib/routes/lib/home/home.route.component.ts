import { CommonModule }                                            from "@angular/common";
import { Component }                                               from "@angular/core";
import { MatBottomSheet, MatBottomSheetModule, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { BottomSheetComponent }                                    from "../../../bottom-sheet/bottom-sheet.component";
import { MapComponent }                                            from "../../../map/map.component";


@Component({
  imports:     [
    CommonModule,
    MapComponent,
    MatBottomSheetModule,
  ],
  selector:    "heypoint-home",
  standalone:  true,
  styleUrls:   [
    "./home.route.component.sass",
  ],
  templateUrl: "./home.route.component.html",
})
export class HomeRouteComponent {

  private readonly bottomSheetRef: MatBottomSheetRef;

  constructor(
    matBottomSheet: MatBottomSheet,
  ) {
    this
      .bottomSheetRef = matBottomSheet
      .open(
        BottomSheetComponent,
        {
          disableClose: true,
          hasBackdrop:  false,
        },
      );
  }
}
