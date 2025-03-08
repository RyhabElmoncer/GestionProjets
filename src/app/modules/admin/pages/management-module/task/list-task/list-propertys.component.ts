import {
  AsyncPipe, CommonModule,
  CurrencyPipe, DatePipe,
  NgClass,
  NgTemplateOutlet,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup
} from '@angular/forms';
import { RouterLink ,Router} from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { PageEvent } from '@angular/material/paginator';
import {
  InventoryPagination,
} from 'app/modules/admin/pages/users-module/admin/list-admin/admin.types';
import {
  Observable,
  Subject,
  takeUntil
} from 'rxjs';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {PropertyService} from "../../../../../../shared/services/property/property.service";
import {Property} from "../../../../../../shared/services/property/property.model";
import {User} from "../../../../../../shared/services/authauthentication/user.model";

@Component({
  selector: 'app-list-propertys',
  templateUrl: './list-propertys.component.html',
  styles: [
    /* language=SCSS */
    `
      .custom-center {
        text-align: center;
      }

      .inventory-grid {
        grid-template-columns: 48px auto 40px;

        @screen sm {
          grid-template-columns: 48px auto 112px 72px;
        }

        @screen md {
          grid-template-columns: 48px 112px auto 112px 72px;
        }

        @screen lg {
          grid-template-columns: 180px auto 100px 150px 150px 150px 150px 150px 150px ;
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSortModule,
    NgTemplateOutlet,
    MatPaginatorModule,
    NgClass,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatRippleModule,
    AsyncPipe,
    CurrencyPipe,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    NgSelectModule,
    NgbModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CdkScrollableModule,
    MatMenuModule,
    MatDividerModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterLink
  ],
  standalone: true,
  providers: [DatePipe]
})
export class ListPropertysComponent
    implements OnInit , OnDestroy
{
  @ViewChild(MatPaginator) private _paginator: MatPaginator;

  propertys$: Observable<Property[]>;
  pagination: InventoryPagination;
  private _unsubscribeAll = new Subject<void>();
  isLoading: boolean = false;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  public col: string = '3';
  propertys: Property [] = [];
  page!: number;
  owner : User
  configForm: UntypedFormGroup;
  /**
   * Constructor
   */
  constructor(
      private _fuseConfirmationService: FuseConfirmationService,
      private _formBuilder: UntypedFormBuilder,
      private _changeDetectorRef: ChangeDetectorRef,
      private _propertyService: PropertyService,
      protected translate: TranslocoService,
      private router: Router
  ) {}
  ngOnInit(): void {
    // Get the pagination
    this._propertyService.pagination$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((pagination: InventoryPagination) => {
          this.pagination = pagination;

          // Met à jour MatPaginator
          if (this._paginator) {
            this._paginator.pageIndex = pagination.page;
            this._paginator.pageSize = pagination.size;
          }

          this._changeDetectorRef.markForCheck();
        });

    // Charge les admins pour la première fois
    this._propertyService.getPropertysPageable$(0, 20);
    this.propertys$ = this._propertyService.propertys$;

    // Build the config form
    this.configForm = this._formBuilder.group({
      title: 'Remove contact',
      message:
          'Are you sure you want to remove this contact permanently? <span class="font-medium">This action cannot be undone!</span>',
      icon: this._formBuilder.group({
        show: true,
        name: 'heroicons_outline:exclamation-triangle',
        color: 'warn',
      }),
      actions: this._formBuilder.group({
        confirm: this._formBuilder.group({
          show: true,
          label: 'Remove',
          color: 'warn',
        }),
        cancel: this._formBuilder.group({
          show: true,
          label: 'Cancel',
        }),
      }),
      dismissible: true,
    });
  }
  onPageChange(event: PageEvent): void {
    this._propertyService.getPropertysPageable$(event.pageIndex, event.pageSize);
  }

  /**
   * Nettoyage des subscriptions pour éviter les fuites mémoire
   */
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
  deleteProperty(property: Property): void {
    this._propertyService.deleteProperty(property.id).subscribe(
        () => console.log(`Property ${property.name} supprimé avec succès.`),
        (error) => {
          this._fuseConfirmationService.open({
            title: this.translate.translate(`Erreur`),
            message: this.translate.translate(`Le Property ne peut pas être supprimé car il est lié à d'autres entités.`),
            icon: {
              show: true,
              name: 'heroicons_outline:exclamation-triangle',
              color: 'info',
            },
            actions: {
              confirm: {
                show: false,
              },
              cancel: {
                show: true,
                label: 'OK',
              },
            },
            dismissible: true,
          });
        }
    );
  }
  openConfirmationDialog(property: Property): void {
    const dialogRef = this._fuseConfirmationService.open({
      title: `${this.translate.translate('Supprimer le property')} ${property.name} ?`,
      message: this.translate.translate(`Êtes-vous sûr de vouloir supprimer ce property ? Cette action est irréversible.`),
      icon: {
        show: true,
        name: 'heroicons_outline:exclamation-triangle',
        color: 'warn',
      },
      actions: {
        confirm: {
          show: true,
          label: this.translate.translate('Supprimer'),
          color: 'warn',
        },
        cancel: {
          show: true,
          label: this.translate.translate('action.cancel'),
        },
      },
      dismissible: true,
    });

    // Après la fermeture du dialogue
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.deleteProperty(property);
      }
    });
  }
  navigateToEdit(property: Property): void {
    console.log('Property envoyé :', property); // Debugging
    this.router.navigate(['/pages/properties/update-property'], { state: { property } });
  }
  //TODO:ajouter une methode changeVisibility BE et FE pour changer la Visibility rapidement apartir de table
  changeVisibility(property: any) {
  }
}

