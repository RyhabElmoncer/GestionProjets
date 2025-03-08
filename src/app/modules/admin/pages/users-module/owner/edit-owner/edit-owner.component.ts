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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import {User} from "../../../../../../shared/services/authauthentication/user.model";
@Component({
  selector: 'app-edit-owner',
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
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    {
      provide: Loader,
      useValue: new Loader({apiKey: 'AIzaSyCLP3xkkv62Pk_D1Z8VJe55uaCCaCb2wsY', libraries: ['places']})
    }
  ],
  standalone: true,
  templateUrl: './edit-owner.component.html'
})
export class EditOwnerComponent  implements OnInit {
  editForm: FormGroup;
  owner: User;
  id :string;
  enebled : boolean;
  modules = modules;
  monthNames = [];
  constructor(
      private formBuilder: FormBuilder ,
      private adminService: AdminService ,
      private _fuseConfirmationService: FuseConfirmationService,
      protected translate: TranslocoService,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.createAdminForm();

    this.owner = history.state.user;
    this.id=this.owner.id;
    this.enebled=this.owner.enabled;
    console.log('this.owner :', this.owner);

    if (this.owner) {
      this.editForm.patchValue({
        ...this.owner,
        address: {
          street: this.owner.address?.street || '',
          city: this.owner.address?.city || '',
          state: this.owner.address?.state || '',
          country: this.owner.address?.country || '',
          zip: this.owner.address?.zip || '',
        }
      });
      if (this.owner.privilegeStrings) {
        this.applyPrivileges(this.owner.privilegeStrings);
      }
      console.log('Données mises à jour :', this.editForm.value);
    } else {
      this.router.navigate(['/pages/owners']);
    }
    this.monthNames = [ "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December" ];
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
      monthlyReport : [null],
      dateOfBirth: [null],
      taxRegistrationNumber: [null],
      taxRegistered : [false],
      paymentMethod : [null],

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
        role:"OWNER",
        type : formValues.type,
        note  : formValues.note ,
        monthlyReport : formValues.monthlyReport,
        dateOfBirth: formValues.dateOfBirth,
        taxRegistrationNumber: formValues.taxRegistrationNumber,
        taxRegistered : formValues.taxRegistered,
        paymentMethod : formValues.paymentMethod,
        privilegeStrings: this.generatePrivileges(),
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
        this.router.navigate(['/pages/owners']);
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


  protected readonly Number = Number;



  toggleModule(module: any) {
    module.isActive = !module.isActive;
    module.subModules.forEach(sub => {
      sub.privileges.forEach(priv => priv.isActive = module.isActive);
    });
  }

  // Active/Désactive un privilège spécifique d’un sous-module
  togglePrivilege(subModule: any, privilege: any) {
    privilege.isActive = !privilege.isActive;
  }
  generatePrivileges() {
    let privilegeStrings = [];

    // Parcourir les modules
    this.modules.forEach(module => {
      if (module.isActive) {
        // Parcourir les sous-modules si le module est activé
        module.subModules.forEach(subModule => {
          // Parcourir les privilèges de chaque sous-module
          subModule.privileges.forEach(privilege => {
            if (privilege.isActive) { // Si le privilège est activé
              privilegeStrings.push(`${module.name.toUpperCase()}:${subModule.name.toUpperCase()}:${privilege.name.toUpperCase()}`);
              console.log("privilegeStrings", privilegeStrings);
            }
          });
        });
      }
    });

    return privilegeStrings;
  }
  private applyPrivileges(privilegeStrings: string[]): void {
    privilegeStrings.forEach(privilege => {
      const parts = privilege.split(':'); // Exemple: "USERS:TENANTS:READ"
      if (parts.length === 3) {
        const [moduleName, subModuleName, privilegeName] = parts;

        // Trouver le module correspondant
        const module = this.modules.find(m => m.name.toUpperCase() === moduleName);
        if (module) {
          module.isActive = true; // Activer le module

          // Trouver le sous-module correspondant
          const subModule = module.subModules.find(sm => sm.name.toUpperCase() === subModuleName);
          if (subModule) {
            // Trouver le privilège et l'activer
            const privilegeObj = subModule.privileges.find(p => p.name.toUpperCase() === privilegeName);
            if (privilegeObj) {
              privilegeObj.isActive = true;
            }
          }
        }
      }
    });
  }
  onCancel(): void {
    this.router.navigate(['/pages/owners']);
  }
}
