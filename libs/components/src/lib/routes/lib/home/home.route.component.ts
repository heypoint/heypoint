import { CommonModule } from "@angular/common";
import { Component }    from "@angular/core";
import { MapComponent } from "../../../map/map.component";


@Component({
  imports:     [
    CommonModule,
    MapComponent,
  ],
  selector:    "heypoint-home",
  standalone:  true,
  styleUrls:   [
    "./home.route.component.sass",
  ],
  templateUrl: "./home.route.component.html",
})
export class HomeRouteComponent {
}
