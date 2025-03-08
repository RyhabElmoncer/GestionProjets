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
import {FuseConfirmationService} from "../../../../../../../@fuse/services/confirmation";
import { Router } from '@angular/router';
import {InclusionsService} from "../../../../../../shared/services/settings/inclusions.service";
import {UnitStatus} from "../../../../../../shared/services/unit/unit-status.model";
import {UnitService} from "../../../../../../shared/services/unit/unit.service";
@Component({
  selector: 'create-unit-component',
  templateUrl: 'create-unit.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../../../../../../../../node_modules/@ng-select/ng-select/themes/material.theme.css',
      "create-unit.component.scss"
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
export class CreateUnitComponent implements OnInit {
  unitStepperForm: UntypedFormGroup;
  servicesNames$: Observable<{ id: string, name: string }[]>;
  inclusionsNames$: Observable<{ id: string, name: string }[]>;
  propertysNames$: Observable<{propertyId: string, propertyName: string }[]>;
  unitStatusList = Object.entries(UnitStatus).map(([key, value]) => ({ key, value }));
  selectedDefaultImage: File | null = null;
  selectedImages: File[] = [];
  accessControlOptions: { key: string, value: string }[] = [
    { key: 'Badge électronique', value: 'Badge électronique' },
    { key: 'Clé', value: 'Clé' },
    { key: 'Autre', value: 'Autre' }
  ];
  typeOfSizeOptions: { key: string, value: string }[] = [
    { key: 'm²', value: 'Mètre carré' },
    { key: 'pi²', value: 'Pied carré' },
    { key: 'acre', value: 'Acre' }
  ];

  /**
   * Constructor
   * }
   */
  constructor(
      protected  _formBuilder: UntypedFormBuilder,
      protected translate: TranslocoService,
      private _serviceService: ServiceService,
      private _inclusionService: InclusionsService,
      private propertyService : PropertyService,
      private unitService : UnitService,
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

    this._serviceService.getAllServicesNames$();
    this.servicesNames$ = this._serviceService.servicesNames$;

    this._inclusionService.getAllInclusionsNames$();
    this.inclusionsNames$ = this._inclusionService.inclusionsNames$;

    this.propertyService.getAllPropertysNames$();
    this.propertysNames$ = this.propertyService.PropertysNames$;

    // property Vertical stepper form
    this.unitStepperForm = this._formBuilder.group({
      step1: this._formBuilder.group({
        propertyId: ['', Validators.required],
        number: ['', Validators.required],
        name: ['', Validators.required],
        unitType: ['', Validators.required],
        status: ['', Validators.required],
        bedrooms: ['', Validators.required],
        bathrooms: [null, [Validators.required]],
        size: [null, [Validators.required]],
        typeOfSize: [null, [Validators.required]],
        marketRent: [null, [Validators.required]],
        accessControl: [null],
        descriptionFr: [null],
        descriptionEn: [null],
        isHome: [true, [Validators.required]],
      }),
      step2: this._formBuilder.group({
        defaultImage: ['', Validators.required],
        images: [''],
      }),
      step3: this._formBuilder.group({
        selectedServices: this._formBuilder.array([])
      }),
      step4: this._formBuilder.group({
        selectedInclusions: this._formBuilder.array([])
      }),
    });
  }
// Méthode  pour obtenir le FormArray des services sélectionnés
  get selectedServices(): FormArray {
    return this.unitStepperForm.get('step3.selectedServices') as FormArray;
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

  // Méthode pour obtenir le FormArray des inclusions sélectionnés
  get selectedInclusions(): FormArray {
    return this.unitStepperForm.get('step4.selectedInclusions') as FormArray;
  }
  onInclusionChange(inclusionId: string, isChecked: boolean): void {
    if (isChecked) {
      // Ajouter un groupe de formulaires pour l'inclusion
      const inclusionGroup = this._formBuilder.group({
        inclusionId: [inclusionId],
        qty: [''],
        other: ['']
      });
      this.selectedInclusions.push(inclusionGroup);
      console.log(this.selectedInclusions.value); // Vérifier la structure des données
    } else {
      // Supprimer l'inclusion décochée
      const index = this.selectedInclusions.controls.findIndex(c => c.get('inclusionId').value === inclusionId);
      if (index !== -1) {
        this.selectedInclusions.removeAt(index);
      }
    }
  }
  isInclusionSelected(inclusionId: string): boolean {
    return this.selectedInclusions.value.some(c => c.inclusionId === inclusionId);
  }
  onFileSelected(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    if (field === 'defaultImage') {
      this.selectedDefaultImage = input.files[0];
      this.unitStepperForm.get('step2.defaultImage')?.setValue(this.selectedDefaultImage);
    }

    if (field === 'images') {
      this.selectedImages = Array.from(input.files);
      this.unitStepperForm.get('step2.images')?.setValue(this.selectedImages);
    }
  }
  createUnit(): void {
    if (this.unitStepperForm.invalid) {
      console.error('Le formulaire est invalide');
      return;
    }
    
    // Construction de l'objet UnitDTO
    const unitDTO = {
      propertyId: this.unitStepperForm.get('step1.propertyId')?.value,
      number: this.unitStepperForm.get('step1.number')?.value,
      name: this.unitStepperForm.get('step1.name')?.value,
      unitType: this.unitStepperForm.get('step1.unitType')?.value,
      status: this.unitStepperForm.get('step1.status')?.value,
      bedrooms: this.unitStepperForm.get('step1.bedrooms')?.value,
      bathrooms: this.unitStepperForm.get('step1.bathrooms')?.value,
      size: this.unitStepperForm.get('step1.size')?.value,
      typeOfSize: this.unitStepperForm.get('step1.typeOfSize')?.value,
      marketRent: this.unitStepperForm.get('step1.marketRent')?.value,
      accessControl: this.unitStepperForm.get('step1.accessControl')?.value,
      descriptionFr: this.unitStepperForm.get('step1.descriptionFr')?.value,
      descriptionEn: this.unitStepperForm.get('step1.descriptionEn')?.value,
      isHome: this.unitStepperForm.get('step1.isHome')?.value,
      serviceIds: this.selectedServices.value,
      unitInclusions: this.selectedInclusions.value.map(inclusion => ({
        inclusionId: inclusion.inclusionId,
        qty: inclusion.qty,
        other: inclusion.other
      }))
    };

    // Création de FormData
    const formData = new FormData();
    formData.append('unit', JSON.stringify(unitDTO)); // Ajout du JSON en string
    console.log("formData 'property'", formData.get('unit'))
    if (this.selectedDefaultImage) {
      formData.append('defaultImage', this.selectedDefaultImage);
    }
    this.selectedImages.forEach((image, index) => {
      formData.append(`images`, image);
    });
    console.log("formData 2", formData)
    this.unitService.createUnit(formData)
        .subscribe({
          next: (response) => {
            console.log('unit créé avec succès');
            this._fuseConfirmationService.open({
              title: this.translate.translate(`Succès`),
              message: this.translate.translate(`unit créé avec succès`),
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
            this.router.navigate(['/pages/units']);
          },
          error: (error) => {
            console.error('Erreur lors de la creation de unit', error);
            this._fuseConfirmationService.open({
              title: this.translate.translate(`Erreur`),
              message: this.translate.translate(`Erreur lors de la creation de unit`),
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

}
