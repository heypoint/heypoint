import { CommonModule } from "@angular/common";
import { Component }    from "@angular/core";


@Component({
  imports: [
    CommonModule,
  ],
  selector: "heypoint-button",
  standalone: true,
  styleUrls: [
    "./button.component.sass"
  ],
  templateUrl: "./button.component.html",
})
export class ButtonComponent {}
