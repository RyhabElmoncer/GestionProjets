import { Component, ViewEncapsulation , OnInit } from '@angular/core';
import { FormsModule , FormGroup, Validators , FormBuilder , ReactiveFormsModule , AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';
import { Loader } from '@googlemaps/js-api-loader';
import {AdminService} from "../../../../../../shared/services/admin/admin.service";
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import {FuseConfirmationService} from "../../../../../../../@fuse/services/confirmation";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import {modules} from "../modules";
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-sub-admin',
  encapsulation: ViewEncapsulation.None,
  imports: [
    TranslocoModule,
    MatIconModule,
    NgxGpAutocompleteModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDividerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatTableModule,
    CommonModule
  ],
  providers: [
    {
      provide: Loader,
      useValue: new Loader({apiKey: 'AIzaSyCLP3xkkv62Pk_D1Z8VJe55uaCCaCb2wsY', libraries: ['places']})
    }
  ],
  standalone: true,
  templateUrl: './create-sub-admin.component.html'
})
export class CreateSubAdminComponent  implements OnInit {
  createForm: FormGroup;
  hidePassword = true;
  modules = modules;
  constructor(
      private formBuilder: FormBuilder ,
      private adminService: AdminService ,
      private _fuseConfirmationService: FuseConfirmationService,
      protected translate: TranslocoService,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.createAdminForm();

  }

  private createAdminForm(): void {
      this.createForm = this.formBuilder.group({
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        role: ['USER']  // Définir le rôle USER par défaut
      });
    }
  longitude: String;
  altitude: String;
  addressPro;
onSubmit(): void {
    console.log("Form Values:", this.createForm.value); // Vérification des données

    if (this.createForm.invalid) {
        console.log("Formulaire invalide !");
        return;
    }

    const formValues = this.createForm.value;
    const userData = {
        firstname: formValues.firstname,
        lastname: formValues.lastname,
        email: formValues.email,
        password: formValues.password,
        role: "USER"
    };


    console.log("Données envoyées:", userData); // Vérification avant envoi

    this.adminService.createUser(userData).subscribe({
        next: (response) => {
            console.log('Utilisateur créé avec succès', response);
            this.createForm.reset();
            this.router.navigate(['/pages/user']);
        },
        error: (error) => {
            console.error('Erreur lors de la création de l’utilisateur', error);
        }
    });
}


  protected readonly Number = Number;



  toggleModule(module: any) {
    module.isActive = !module.isActive;
    module.subModules.forEach(sub => {
      sub.privileges.forEach(priv => priv.isActive = module.isActive);
    });
  }



  onCancel(): void {
    this.router.navigate(['/pages/user']);
  }
}
