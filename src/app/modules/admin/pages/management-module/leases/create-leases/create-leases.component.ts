import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AsyncPipe, CommonModule} from "@angular/common";
import { MatButtonModule} from "@angular/material/button";
import {MatCheckbox, MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatOption, MatOptionModule} from "@angular/material/core";
import {MatSelect, MatSelectModule} from "@angular/material/select";
import {

  MatStepperModule,

} from "@angular/material/stepper";
import {NgSelectComponent, NgSelectModule} from "@ng-select/ng-select";
import {NgxGpAutocompleteModule} from "@angular-magic/ngx-gp-autocomplete";
import {
  FormArray, FormControl,

  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup, Validators
} from "@angular/forms";
import {MatRadioModule} from "@angular/material/radio";
import {TranslocoModule, TranslocoService} from "@jsverse/transloco";
import {map, Observable, startWith} from "rxjs";

import {ServiceService} from "../../../../../../shared/services/settings/services.service";
import {PropertyService} from "../../../../../../shared/services/property/property.service";
import {UserService} from "../../../../../../shared/services/user/user.service";
import {Router} from "@angular/router";
import {FuseConfirmationService} from "../../../../../../../@fuse/services/confirmation";

import {Loader} from "@googlemaps/js-api-loader";

import {IUser} from "../../../../../../shared/services/user/user.model";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {UnitService} from "../../../../../../shared/services/unit/unit.service";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {BailsService} from "../../../../../../shared/services/leases/BailService";

@Component({
selector: 'app-create-leases',
    templateUrl: './create-leases.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrl: './create-leases.component.scss',

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
    MatSlideToggle,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,


  ],
    providers: [
  {
    provide: Loader,
    useValue: new Loader({apiKey: 'AIzaSyCLP3xkkv62Pk_D1Z8VJe55uaCCaCb2wsY', libraries: ['places']})
  }
],
    standalone: true
})
export class CreateLeasesComponent implements  OnInit{
  bailStepperForm: UntypedFormGroup;
  longitude: String;
  altitude: String;
  servicesNames$: Observable<{ id: string; name: string }[]>;
  inclusions$: Observable<{ id: string, qty: string, other: string }[]>;
  users: any[] = [];
  monthNames = [];
  locataireCtrl = new FormControl('');
  selectedLocataires: IUser[] = [];
  allLocataires: IUser[] = [];
  filteredLocataires!: Observable<IUser[]>;
  propertysNamess$: Observable<{propertyId: string, propertyName: string }[]>;
  unites$: Observable<any>;

  constructor(
      protected  _formBuilder: UntypedFormBuilder,
      protected translate: TranslocoService,
      private _serviceService: ServiceService,
      private propertyService : PropertyService,
      private  userService :UserService,
      private  unitService :UnitService,
     private bailsService:BailsService,
      private router: Router,
      private _fuseConfirmationService: FuseConfirmationService, ) {

  }

  /**
   * On init
   */
  ngOnInit(): void {

    this.userService.getUserByRole('TENANT').subscribe({

      next: (response) => {
        console.log('Réponse de l\'API :', response.body);

        if (response.body && response.body.content) {
          // Filtrage des utilisateurs ayant le rôle "TENANT" et ajout de `fullname`
          this.allLocataires = response.body.content
              .filter(user => user.role?.includes('TENANT'))
              .map(user => ({
                ...user,
                fullname: `${user.firstname} ${user.lastname}` // Ajout de fullname
              }));

          this.setupFiltering(); // Configuration du filtrage
        } else {
          console.warn("La réponse de l'API ne contient pas de contenu valide.");
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des locataires :', err);
      }
    });

    this.propertyService.getAllPropertysNames$();
    this.propertysNamess$ = this.propertyService.PropertysNames$;
    // Vérifier s'il y a un immeuble sélectionné dans localStorage et charger les unités
    const storedPropertyId = localStorage.getItem('propertyId');
    if (storedPropertyId) {
      this.unitService.getUnitsByPropertyId(storedPropertyId);
    }

    // Observer les unités mises à jour
    this.unites$ = this.unitService.units$;
    this.monthNames = [ "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December" ];
    const unitid = localStorage.getItem('unitid');
    if (unitid) {
      this.unitService.getServicesByUnitId(unitid);
    }

    // ubail Vertical stepper form
    this.bailStepperForm = this._formBuilder.group({
      step1: this._formBuilder.group({
        Locataires: ['', Validators.required],
        immeubleId: ['', Validators.required],
        uniteId: ['', Validators.required],
        dateDebut: ['', Validators.required],
        terme: [''],
        dateFin: ['', Validators.required],
        notificationRenouvellement: [''],
        residenceSeule: [false],
      }),
      step2: this._formBuilder.group({
        loyer: ['', Validators.required],
        coutTotalService: ['', Validators.required],
        premiereDatePaiement: ['', Validators.required],
        periodePaiement: ['', Validators.required],
        methodePaiement: ['', Validators.required],
        lieuPaiement: ['', Validators.required],
        subventionLoyer: [false],  // Doit être bien défini
        specificationSubvention: [''],
        chequesPostdates: [false]
      }),
      step3: this._formBuilder.group({
        selectedServices: new FormArray([]),

      }),
      step4: this._formBuilder.group({
        selectedInclusions: this._formBuilder.array([])
      }),
    });
  }
  setupFiltering() {
    this.filteredLocataires = this.locataireCtrl.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterLocataires(value || ''))
    );
  }
  onImmeubleSelected(event: any): void {
    const selectedPropertyId = event.value;
    localStorage.setItem('propertyId', selectedPropertyId);
    this.unitService.getUnitsByPropertyId(selectedPropertyId);
  }
  onUnitSelected(event: any): void {
    const selectedUnitId = event.value;
    localStorage.setItem('UnitId', selectedUnitId);
    this.unitService.getUnitsByPropertyId(selectedUnitId);
  }


  filterLocataires(value: string): IUser[] {
    const filterValue = value.toLowerCase();
    return this.allLocataires.filter(
        (user) =>
            user.firstname?.toLowerCase().includes(filterValue) ||
            user.lastname?.toLowerCase().includes(filterValue) ||
            user.login?.toLowerCase().includes(filterValue)
    );
  }
  onUnitSelectionChange(unitId: string): void {
    if (unitId) {
      localStorage.setItem('unitId', unitId);
    } else {
      console.warn('Aucune unité sélectionnée');
    }
  }
  onStepperSelectionChange(event: StepperSelectionEvent): void {
    if (event.selectedIndex === 2) {  // Step 3 is at index 2 (0-based index)
      const unitId = localStorage.getItem('UnitId');  // Retrieve unitId from localStorage

      if (unitId) {
        // Fetch services as an observable and assign it to servicesNames$
        this.servicesNames$ = this.unitService.getServicesByUnitId(unitId);
        this.inclusions$ = this.unitService.getInclusionByUnitId(unitId);

      } else {
        console.warn('❌ unitId not found in localStorage');
      }
    }
  }


  selectLocataire(event: any) {
    const locataire = event.option.value;
    if (!this.selectedLocataires.some((l) => l.id === locataire.id)) {
      this.selectedLocataires.push(locataire);
    }
    this.locataireCtrl.setValue('');
  }



  // onServiceChange(serviceId: string, isChecked: boolean): void {
  //   if (isChecked) {
  //     // Ajouter uniquement si l'ID n'est pas déjà présent
  //     if (!this.selectedServices.value.includes(serviceId)) {
  //       this.selectedServices.push(this._formBuilder.control(serviceId));
  //     }
  //   } else {
  //     // Supprimer l'ID décoché
  //     const index = this.selectedServices.controls.findIndex(c => c.value === serviceId);
  //     if (index !== -1) {
  //       this.selectedServices.removeAt(index);
  //     }
  //   }
  // }

  handleAddressChange(address: any) {
    console.log("handleAddressChange appelé !");
    console.log("Adresse sélectionnée :", address);

    if (!address || !address.address_components) {
      console.error("Problème : L'adresse reçue est vide ou incorrecte !");
      return;
    }

    let street = '';
    let streetNumber = '';

    for (let component of address.address_components) {
      if (component.types.includes("route")) {
        street = component.long_name;
      }
      if (component.types.includes("street_number")) {
        streetNumber = component.long_name;
      }
    }

    // Utiliser `formatted_address` si `street` est vide
    const fullAddress = (street || streetNumber) ? `${streetNumber} ${street}`.trim() : address.formatted_address;

    // Vérifie si l'adresse est toujours vide après mise à jour
    if (!fullAddress) {
      console.warn("⚠ L'adresse récupérée est vide !");
      return;
    }

    // Mise à jour du champ `lieuPaiement`
    const lieuPaiementControl = this.bailStepperForm.get('step2.lieuPaiement');
    if (lieuPaiementControl) {
      lieuPaiementControl.setValue(fullAddress);
      lieuPaiementControl.markAsTouched();
      lieuPaiementControl.markAsDirty();
      console.log("✅ Lieu de paiement mis à jour :", fullAddress);
    } else {
      console.error("❌ Impossible de mettre à jour 'lieuPaiement'.");
    }
  }

  createBail(): void {
    if (this.bailStepperForm.invalid) {
      console.error('Le formulaire est invalide');
      return;
    }

    // Construction de l'objet BailDTO avec les valeurs des champs du formulaire
    const bailDTO = {
      // Step 1: Renseignements personnels
      locataires: this.bailStepperForm.get('step1.Locataires')?.value, // Liste des locataires
      immeubleId: this.bailStepperForm.get('step1.immeubleId')?.value, // Immeuble sélectionné
      uniteId: this.bailStepperForm.get('step1.uniteId')?.value, // Unité sélectionnée
      dateDebut: this.bailStepperForm.get('step1.dateDebut')?.value, // Date de début
      terme: this.bailStepperForm.get('step1.terme')?.value, // Terme en jours
      dateFin: this.bailStepperForm.get('step1.dateFin')?.value, // Date de fin
      notificationRenouvellement: this.bailStepperForm.get('step1.notificationRenouvellement')?.value, // Notification de renouvellement
      residenceSeule: this.bailStepperForm.get('step1.residenceSeule')?.value, // Logement résidentiel

      // Step 2: Paiement
      loyer: this.bailStepperForm.get('step2.loyer')?.value, // Loyer
      coutTotalService: this.bailStepperForm.get('step2.coutTotalService')?.value, // Coût total du service
      periodePaiement: this.bailStepperForm.get('step2.periodePaiement')?.value, // Période de paiement (mois, semaine)
      premiereDatePaiement: this.bailStepperForm.get('step2.premiereDatePaiement')?.value, // Première date de paiement
      methodePaiement: this.bailStepperForm.get('step2.methodePaiement')?.value, // Méthode de paiement
      lieuPaiement: this.bailStepperForm.get('step2.lieuPaiement')?.value, // Lieu de paiement
      subventionLoyer: this.bailStepperForm.get('step2.subventionLoyer')?.value, // Subvention de loyer
      specificationSubvention: this.bailStepperForm.get('step2.specificationSubvention')?.value, // Spécification de la subvention
      chequesPostdates: this.bailStepperForm.get('step2.chequesPostdates')?.value, // Postdated cheques

      // Step 3: Services
      serviceIds: this.selectedServices?.value, // Liste des services sélectionnés

      // Step 4: Inclusions
      unitInclusions: this.selectedInclusions.value.map(inclusion => ({
        inclusionId: inclusion.inclusionId,
        qty: inclusion.qty,
        other: inclusion.other
      }))
    };

    // Création de FormData pour l'envoi
    const formData = new FormData();
    formData.append('bail', JSON.stringify(bailDTO)); // Ajout du bailDTO sous forme de chaîne JSON
    console.log("formData 'bail'", formData.get('bail'));
    console.log("formData complet", formData);

    // Appel au service pour créer le bail
    this.bailsService.createBails(formData).subscribe({
      next: (response) => {
        console.log('Bail créé avec succès');
        this._fuseConfirmationService.open({
          title: this.translate.translate(`Succès`),
          message: this.translate.translate(`Bail créé avec succès`),
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
              "label": "OK"
            }
          },
          "dismissible": true
        });
        this.router.navigate(['/pages/bails']);
      },
      error: (error) => {
        console.error('Erreur lors de la création du bail', error);
        console.log('Error details:', error.error); // Log specific error from the response body

        this._fuseConfirmationService.open({
          title: this.translate.translate(`Erreur`),
          message: this.translate.translate(`Erreur lors de la création du bail`),
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
              "label": "OK"
            }
          },
          "dismissible": true
        });
      }
    });
  }

  // Getter to access the FormArray
  get selectedServices(): FormArray {
    return this.bailStepperForm.get('step3.selectedServices') as FormArray;
  }

  // Method to handle checkbox changes
  onServiceChange(serviceId: string, checked: boolean): void {
    const currentValue = this.selectedServices.value || [];  // Default to empty array if null

    if (checked) {
      // Add serviceId to selected services if checked
      this.selectedServices.push(new FormControl(serviceId));
    } else {
      // Remove serviceId from selected services if unchecked
      const index = currentValue.indexOf(serviceId);
      if (index !== -1) {
        this.selectedServices.removeAt(index);
      }
    }
  }
  isInclusionSelected(inclusionId: string): boolean {
    return this.selectedInclusions.value.some(c => c.inclusionId === inclusionId);
  }

  // Méthode pour obtenir le FormArray des inclusions sélectionnés
  get selectedInclusions(): FormArray {
    return this.bailStepperForm.get('step4.selectedInclusions') as FormArray;
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
}
