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
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-admin',
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
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: Loader,
      useValue: new Loader({apiKey: 'AIzaSyCLP3xkkv62Pk_D1Z8VJe55uaCCaCb2wsY', libraries: ['places']})
    }
  ],
  templateUrl: './create-admin.component.html',
  standalone: true,
  styleUrl: './create-admin.component.scss'
})
export class CreateAdminComponent implements OnInit {
  createForm: FormGroup;
  hidePassword = true;

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
      firstname: [null, [Validators.required, Validators.minLength(3)]],
      lastname: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(3)]],
      phoneNumber:  ['', [Validators.required, Validators.pattern(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/)]],
      lanKey: [null],
      street: [null, [Validators.required, Validators.minLength(3)]],
      city: [null, [Validators.required, Validators.minLength(2)]],
      state: [null, [Validators.required, Validators.minLength(2)]],
      country: [null, [Validators.required, Validators.minLength(2)]],
      zip: [null, [Validators.required, Validators.minLength(2)]],

    });
  }
  longitude: String;
  altitude: String;
  addressPro;

  handleAddressChange(address: any) {
    this.addressPro = address.formatted_address
    let street = '';
    let streetNumber = '';
    const  address_components = address.address_components;
    for (let j = 0; j < address_components.length; j++) {
      if(address_components[j].types[0]=== "country") {
        this.createForm.patchValue({
          country:  address_components[j].long_name,
        });
      }

      if(address_components[j].types[0]=== "administrative_area_level_1") {
        this.createForm.patchValue({
          state:  address_components[j].long_name,
        });
      }

      if(address_components[j].types[0]=== "locality") {
        this.createForm.patchValue({
          city:  address_components[j].long_name,
        });
      }
      if (address_components[j].types[0] === "route") {
        street = address_components[j].long_name; // Ex: "Sands Ave"
      }

      if (address_components[j].types[0] === "street_number") {
        streetNumber = address_components[j].long_name; // Ex: "255"
      }

      if(address_components[j]?.types[0]=== "postal_code" || address_components[j]?.types[1]=== "postal_code") {
        this.createForm.patchValue({
          zip:  address_components[j].long_name,
        });
      }

    }
    this.createForm.patchValue({
      street: streetNumber ? `${streetNumber} ${street}` : street
    });

    if( address?.geometry?.location){
      this.longitude = address?.geometry?.location?.lat();
      this.altitude =  address?.geometry?.location?.lng() ;
    }
  }
  onSubmit(): void {
    if (this.createForm.invalid) {
      return;
    }

    const formValues = this.createForm.value;

    const userData = {
      user: {
        firstname: formValues.firstname,
        lastname: formValues.lastname,
        email: formValues.email,
        password: formValues.password,
        phoneNumber: formValues.phoneNumber,
        lanKey: formValues.lanKey,
        role:"ADMIN"
      },
      address: {
        adresse: formValues.adresse,
        street: formValues.street,
        city: formValues.city,
        state: formValues.state,
        country: formValues.country,
        zip: formValues.zip,
        longitude: this.longitude,
        altitude: this.altitude
      }
    };

    this.adminService.createUser(userData).subscribe({
      next: (response) => {
        console.log('Utilisateur créé avec succès');
        this._fuseConfirmationService.open({
          title: this.translate.translate(`Succès`),
          message: this.translate.translate(`Utilisateur créé avec succès`),
          "icon": {
            "show": true,
            "name": "heroicons_outline:check-circle",
            "color": "success"
          },
          "actions": {
            "confirm": {
              "show": false,
              "label": "Remove",
              "color": "primary"
            },
            "cancel": {
              "show": true,
              "label": "ok"
            }
          },
          "dismissible": true
        });
        this.createForm.reset();  // Réinitialiser le formulaire
        this.createForm.markAsPristine();
        this.createForm.markAsUntouched();
        this.createForm.updateValueAndValidity();
        this.addressPro = "";
        this.longitude=""
        this.altitude=""
        this.router.navigate(['/pages/admins']);
      },
      error: (error) => {
        console.error('Erreur lors de la création de l’utilisateur', error);
        this._fuseConfirmationService.open({
          title: this.translate.translate(`Erreur`),
          message: this.translate.translate(`Erreur lors de la création de l’utilisateur`),
          "icon": {
            "show": true,
            "name": "heroicons_outline:exclamation-triangle",
            "color": "warn"
          },
          "actions": {
            "confirm": {
              "show": false,
              "label": "Remove",
              "color": "warn"
            },
            "cancel": {
              "show": true,
              "label": "ok"
            }
          },
          "dismissible": true
        });
      }
    });
  }


  protected readonly Number = Number;

  onCancel(): void {
    this.router.navigate(['/pages/admins']);
  }
}
