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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {User} from "../../../../../../shared/services/authauthentication/user.model";
import { Router } from '@angular/router';
@Component({
  selector: 'app-edit-tenant',
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
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    {
      provide: Loader,
      useValue: new Loader({apiKey: 'AIzaSyCLP3xkkv62Pk_D1Z8VJe55uaCCaCb2wsY', libraries: ['places']})
    }
  ],
  templateUrl: './edit-tenant.component.html',
  standalone: true
})
export class EditTenantComponent implements OnInit {
  editForm: FormGroup;
  tenant: User;
  id :string;
  enebled : boolean;

  constructor(
      private formBuilder: FormBuilder ,
      private adminService: AdminService ,
      private _fuseConfirmationService: FuseConfirmationService,
      protected translate: TranslocoService,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.createAdminForm();

    this.tenant = history.state.user;
    this.id=this.tenant.id;
    this.enebled=this.tenant.enabled;
    console.log('this.tenant :', this.tenant);

    if (this.tenant) {
      this.editForm.patchValue({
        ...this.tenant,
        address: {
          street: this.tenant.address?.street || '',
          city: this.tenant.address?.city || '',
          state: this.tenant.address?.state || '',
          country: this.tenant.address?.country || '',
          zip: this.tenant.address?.zip || '',
        }
      });
      console.log('Données mises à jour :', this.editForm.value);
    } else {
      this.router.navigate(['/pages/tenants']);
    }
  }

  private createAdminForm(): void {
    this.editForm = this.formBuilder.group({
      firstname: [null, [Validators.required, Validators.minLength(3)]],
      lastname: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      phoneNumber:  ['', [Validators.required, Validators.pattern(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/)]],
      lanKey: [null],
      type : [null , [Validators.required]],
      note  : [null],
      paymentMethod : [null],
      dateOfBirth: [null],
      occupation : [null],
      numAssurance : [null],
      startJobDate: [null],
      monthlyIncome : [null],
      monthToMonth: [true],
      // ✅ Regroupement des champs d'adresse sous un FormGroup "address"
      address: this.formBuilder.group({
        street: [null, [Validators.required, Validators.minLength(3)]],
        city: [null, [Validators.required, Validators.minLength(2)]],
        state: [null, [Validators.required, Validators.minLength(2)]],
        country: [null, [Validators.required, Validators.minLength(2)]],
        zip: [null, [Validators.required, Validators.minLength(2)]],
      }),

    });
  }
  longitude: String;
  altitude: String;
  addressPro;

  handleAddressChange(address: any) {
    this.addressPro = address.formatted_address;

    let street = '';
    let streetNumber = '';
    const address_components = address.address_components;

    for (let j = 0; j < address_components.length; j++) {
      const type = address_components[j].types[0];

      if (type === "country") {
        this.editForm.patchValue({
          address: { country: address_components[j].long_name }
        });
      }

      if (type === "administrative_area_level_1") {
        this.editForm.patchValue({
          address: { state: address_components[j].long_name }
        });
      }

      if (type === "locality") {
        this.editForm.patchValue({
          address: { city: address_components[j].long_name }
        });
      }

      if (type === "route") {
        street = address_components[j].long_name; // Ex: "Sands Ave"
      }

      if (type === "street_number") {
        streetNumber = address_components[j].long_name; // Ex: "255"
      }

      if (type === "postal_code" || address_components[j]?.types.includes("postal_code")) {
        this.editForm.patchValue({
          address: { zip: address_components[j].long_name }
        });
      }
    }

    this.editForm.patchValue({
      address: { street: streetNumber ? `${streetNumber} ${street}` : street }
    });

    if (address?.geometry?.location) {
      this.longitude = address.geometry.location.lat();
      this.altitude = address.geometry.location.lng();
    }
  }
  onSubmit(): void {
    if (this.editForm.invalid) {
      return;
    }

    const formValues = this.editForm.value;

    const userData = {
      user: {
        id: this.id,
        firstname: formValues.firstname,
        lastname: formValues.lastname,
        email: formValues.email,
        phoneNumber: formValues.phoneNumber,
        lanKey: formValues.lanKey,
        role:"TENANT",
        type : formValues.type,
        note  : formValues.note,
        paymentMethod : formValues.paymentMethod,
        dateOfBirth: formValues.dateOfBirth,
        occupation : formValues.occupation,
        numAssurance : formValues.numAssurance,
        startJobDate: formValues.startJobDate,
        monthlyIncome : formValues.monthlyIncome,
        monthToMonth: formValues.monthToMonth,
        enabled:this.enebled
      },
      address: {
        street: formValues.address?.street,
        city: formValues.address?.city,
        state: formValues.address?.state,
        country: formValues.address?.country,
        zip: formValues.address?.zip,
        longitude: this.longitude,
        altitude: this.altitude
      }
    };

    this.adminService.editUser(userData).subscribe({
      next: (response) => {
        console.log('Utilisateur créé avec succès');
        this._fuseConfirmationService.open({
          title: this.translate.translate(`Succès`),
          message: this.translate.translate(`Utilisateur modifié avec succès`),
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
        this.router.navigate(['/pages/tenants']);
      },
      error: (error) => {
        console.error('Erreur lors de la modifcation de l’utilisateur', error);
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
  onCancel(): void {
    this.router.navigate(['/pages/tenants']);
  }

  protected readonly Number = Number;
}
