import { CommonModule }                                                                               from "@angular/common";
import { Component }                                                                                  from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { MatButtonModule }                                                                            from "@angular/material/button";
import { MatCardModule }                                                                              from "@angular/material/card";
import { MatDividerModule }                                                                           from "@angular/material/divider";
import { MatExpansionModule }                                                                         from "@angular/material/expansion";
import { MatIconModule }                                                                              from "@angular/material/icon";
import { MatInputModule }                                                                             from "@angular/material/input";
import { UniversityDocument }                                                                         from "@heypoint/interfaces";
import { UniversitiesService }                                                                        from "@heypoint/services";
import { firstValueFrom, map }                                                                        from "rxjs";


@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  selector:    "heypoint-components-profile-cards",
  standalone:  true,
  styleUrls:   [
    "./profile-cards.component.sass",
  ],
  templateUrl: "./profile-cards.component.html",
})
export class ProfileCardsComponent {

  public readonly signInFormGroup: FormGroup<{ "email": FormControl<string> }>;

  constructor(
    private readonly universitiesService: UniversitiesService,
  ) {
    this
      .signInFormGroup = new FormGroup<{ "email": FormControl<string> }>(
        {
          email: new FormControl<string>(
            "",
            {
              nonNullable: true,
              validators: [
                Validators.email,
                Validators.required,
              ],
              asyncValidators: (abstractControl: AbstractControl<string, string>): Promise<ValidationErrors | null> => firstValueFrom<ValidationErrors | null>(
                universitiesService.universityDocumentsObservable.pipe<ValidationErrors | null>(
                  map<UniversityDocument[], ValidationErrors | null>(
                    (universityDocuemnts: UniversityDocument[]): ValidationErrors | null => universityDocuemnts.find(
                      (universityDocument: UniversityDocument) => universityDocument.domain === abstractControl.value.split("@")[1],
                    ) ? null : {
                      "university": true,
                    },
                  ),
                ),
              ),
            },
          ),
        },
      );
  }
}
