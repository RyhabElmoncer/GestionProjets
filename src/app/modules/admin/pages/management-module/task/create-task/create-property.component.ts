import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormArray ,
  FormControl,
  FormBuilder
} from '@angular/forms';
import {
  AsyncPipe, CommonModule,
  NgClass,
  NgTemplateOutlet,
} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';
import { Loader } from '@googlemaps/js-api-loader';
import { Observable } from 'rxjs';
import {ServiceService} from "../../../../../../shared/services/settings/services.service";
import {PropertyService} from "../../../../../../shared/services/property/property.service";
import { NgSelectModule } from '@ng-select/ng-select';
import {UserService} from "../../../../../../shared/services/user/user.service";
import {User} from "../../../../../../shared/services/authauthentication/user.model";
import {PropertyStatus} from "../../../../../../shared/services/property/property-status.model";
import {PropertyType} from "../../../../../../shared/services/property/property-type.model";
import {FuseConfirmationService} from "../../../../../../../@fuse/services/confirmation";
import { Router } from '@angular/router';
@Component({
  selector: 'forms-wizards',
  templateUrl: 'create-property.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../../../../../../../../node_modules/@ng-select/ng-select/themes/material.theme.css',
      "create-property.component.scss"
  ],
  imports: [
    NgSelectModule,
    CommonModule,
    AsyncPipe,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    TranslocoModule,
    NgxGpAutocompleteModule,
  ],
  providers: [
    {
      provide: Loader,
      useValue: new Loader({apiKey: 'AIzaSyCLP3xkkv62Pk_D1Z8VJe55uaCCaCb2wsY', libraries: ['places']})
    }
  ],
  standalone: true
})
export class CreatePropertyComponent implements OnInit {
  propertyStepperForm: UntypedFormGroup;
  longitude: String;
  altitude: String;
  servicesNames$: Observable<{ id: string, name: string }[]>;
  ownersList: any[] = [];
  agentsList: any[] = [];
  selectedOwners: any[] = []; // Liste des owners sélectionnés
  selectedAgents: any[] = [];
  users: any[] = [];
  propertyStatusList = Object.values(PropertyStatus);
  propertyTypeList = Object.values(PropertyType);
  monthNames = [];
  /**
   * Constructor
   */
  constructor(
      protected  _formBuilder: UntypedFormBuilder,
      protected translate: TranslocoService,
      private _serviceService: ServiceService,
      private propertyService : PropertyService,
      private  userService :UserService,
      private router: Router,
      private _fuseConfirmationService: FuseConfirmationService, ) {

  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {

    this.loadUsersData();
    this.monthNames = [ "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December" ];
    this._serviceService.getAllServicesNames$();
    this.servicesNames$ = this._serviceService.servicesNames$;

    // property Vertical stepper form
    this.initializeForm();
  }
// ✅ Méthode correcte pour obtenir le FormArray des services sélectionnés
  get selectedServices(): FormArray {
    return this.propertyStepperForm.get('step4.selectedServices') as FormArray;
  }

  onServiceChange(serviceId: string, isChecked: boolean): void {
    if (isChecked) {
      // Ajouter uniquement si l'ID n'est pas déjà présent
      if (!this.selectedServices.value.includes(serviceId)) {
        this.selectedServices.push(this._formBuilder.control(serviceId));
      }
    } else {
      // Supprimer l'ID décoché
      const index = this.selectedServices.controls.findIndex(c => c.value === serviceId);
      if (index !== -1) {
        this.selectedServices.removeAt(index);
      }
    }
  }

  handleAddressChange(address: any) {
    let street = '';
    let streetNumber = '';

    if (!address || !address.address_components) return;

    const address_components = address.address_components;

    for (let component of address_components) {
      if (component.types.includes("country")) {
        this.propertyStepperForm.get('step1.country')?.setValue(component.long_name);
      }

      if (component.types.includes("administrative_area_level_1")) {
        this.propertyStepperForm.get('step1.state')?.setValue(component.long_name);
      }

      if (component.types.includes("locality")) {
        this.propertyStepperForm.get('step1.city')?.setValue(component.long_name);
      }

      if (component.types.includes("route")) {
        street = component.long_name; // Ex: "Sands Ave"
      }

      if (component.types.includes("street_number")) {
        streetNumber = component.long_name; // Ex: "255"
      }

      if (component.types.includes("postal_code")) {
        this.propertyStepperForm.get('step1.zip')?.setValue(component.long_name);
      }
    }

    // Mise à jour du champ "street"
    this.propertyStepperForm.get('step1.street')?.setValue(streetNumber ? `${streetNumber} ${street}` : street);

    // Forcer la mise à jour de l'UI
    this.propertyStepperForm.get('step1.street')?.markAsTouched();
    this.propertyStepperForm.get('step1.street')?.markAsDirty();
    this.propertyStepperForm.updateValueAndValidity();

    // Mise à jour des coordonnées géographiques
    if (address.geometry?.location) {
      this.longitude = address.geometry.location.lng();
      this.altitude = address.geometry.location.lat();
    }
  }
  selectedDefaultImage: File | null = null;
  selectedImages: File[] = [];

  onFileSelected(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    if (field === 'defaultImage') {
      this.selectedDefaultImage = input.files[0];
      this.propertyStepperForm.get('step3.defaultImage')?.setValue(this.selectedDefaultImage);
    }

    if (field === 'images') {
      this.selectedImages = Array.from(input.files);
      this.propertyStepperForm.get('step3.images')?.setValue(this.selectedImages);
    }
  }
  createProperty(): void {
    if (this.propertyStepperForm.invalid) {
      console.error('Le formulaire est invalide');
      return;
    }
// Mettre à jour users avant la création de propertyDTO
    this.users = [
      ...this.propertyStepperForm.get('step1.owners')?.value || [],
      ...this.propertyStepperForm.get('step1.agents')?.value || []
    ];

    // Construction de l'objet PropertyDTO
    const propertyDTO = {
      name: this.propertyStepperForm.get('step1.name')?.value,
      typeProperty: this.propertyStepperForm.get('step1.typeProperty')?.value,
      propertyStatus: this.propertyStepperForm.get('step1.propertyStatus')?.value,
      address: {
        street: this.propertyStepperForm.get('step1.street')?.value,
        city: this.propertyStepperForm.get('step1.city')?.value,
        state: this.propertyStepperForm.get('step1.state')?.value,
        country: this.propertyStepperForm.get('step1.country')?.value,
        zip: this.propertyStepperForm.get('step1.zip')?.value,
      },
      ownerReserves: this.propertyStepperForm.get('step2.ownerReserves')?.value,
      applicationFee: this.propertyStepperForm.get('step2.applicationFee')?.value,
      feesPercentage: this.propertyStepperForm.get('step2.feesPercentage')?.value,
      feesMinimum: this.propertyStepperForm.get('step2.feesMinimum')?.value,
      fiscalYearEnd: this.propertyStepperForm.get('step2.fiscalYearEnd')?.value,
      notes: this.propertyStepperForm.get('step2.note')?.value,
      isOneApplicantPerUnit: this.propertyStepperForm.get('step2.isOneApplicantPerUnit')?.value,
      descriptionFr: this.propertyStepperForm.get('step2.descriptionFr')?.value,
      descriptionEn: this.propertyStepperForm.get('step2.descriptionEn')?.value,
      isHome: this.propertyStepperForm.get('step2.isHome')?.value,
      serviceIds: this.selectedServices.value, // Liste des services sélectionnés
      users:this.users
    };

    // Création de FormData
    const formData = new FormData();
    formData.append('property', JSON.stringify(propertyDTO)); // Ajout du JSON en string
    console.log("formData 'property'", formData.get('property'))
    if (this.selectedDefaultImage) {
      formData.append('defaultImage', this.selectedDefaultImage);
    }
    this.selectedImages.forEach((image, index) => {
      formData.append(`images`, image);
    });
    console.log("formData 2", formData)
    this.propertyService.createProperty(formData)
        .subscribe({
          next: (response) => {
            console.log('Property créé avec succès');
            this._fuseConfirmationService.open({
              title: this.translate.translate(`Succès`),
              message: this.translate.translate(`Property créé avec succès`),
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
            this.router.navigate(['/pages/properties']);
          },
          error: (error) => {
            console.error('Erreur lors de la creation de Property', error);
            this._fuseConfirmationService.open({
              title: this.translate.translate(`Erreur`),
              message: this.translate.translate(`Erreur lors de la creation de Property`),
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

// Nouvelle méthode pour charger les données des utilisateurs
  loadUsersData(): void {
    this.userService.getAllUsersNames().subscribe(
        (response: User[]) => {
          // Filtrer les utilisateurs par rôle et ajouter un champ fullName
          this.ownersList = response.filter(user => user.role === 'owner').map(user => ({
            ...user,
            fullName: `${user.firstname} ${user.lastname}`  // Crée un champ fullName combiné
          }));
          this.agentsList = response.filter(user => user.role === 'sub_admin').map(user => ({
            ...user,
            fullName: `${user.firstname} ${user.lastname}`  // Crée un champ fullName combiné
          }));
        },
        (error) => {
          console.error('Error fetching users:', error);
        }
    );
  }
  initializeForm(): void {
    this.propertyStepperForm = this._formBuilder.group({
      step1: this._formBuilder.group({
        name: ['', Validators.required],
        typeProperty: ['', Validators.required],
        propertyStatus: ['', Validators.required],
        owners: [[]],
        agents: [[]],
        address: ['', Validators.required],
        street: [null, [Validators.required, Validators.minLength(3)]],
        city: [null, [Validators.required, Validators.minLength(2)]],
        state: [null, [Validators.required, Validators.minLength(2)]],
        country: [null, [Validators.required, Validators.minLength(2)]],
        zip: [null, [Validators.required, Validators.minLength(2)]],
      }),
      step2: this._formBuilder.group({
        ownerReserves: ['', Validators.required],
        applicationFee: ['', Validators.required],
        feesPercentage: ['', Validators.required],
        feesMinimum: ['', Validators.required],
        fiscalYearEnd: ['', Validators.required],
        note: [''],
        isOneApplicantPerUnit: [false, Validators.required],
        descriptionFr: ['', Validators.required],
        descriptionEn: ['', Validators.required],
        isHome: [false, Validators.required],
      }),
      step3: this._formBuilder.group({
        defaultImage: ['', Validators.required],
        images: [''],
      }),
      step4: this._formBuilder.group({
        selectedServices: this._formBuilder.array([])
      }),
    });
  }
}
