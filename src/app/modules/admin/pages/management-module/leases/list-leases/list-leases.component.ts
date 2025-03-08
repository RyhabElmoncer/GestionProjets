import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {AsyncPipe, CommonModule, CurrencyPipe, DatePipe, NgClass, NgIf, NgTemplateOutlet} from "@angular/common";
import {MatFormField, MatFormFieldModule, MatPrefix} from "@angular/material/form-field";

import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup
} from "@angular/forms";

import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import { HttpClient } from '@angular/common/http';
import {TranslocoDirective, TranslocoModule, TranslocoService} from '@jsverse/transloco';
import {ITEMS_PER_PAGE} from "../../../../../../shared/constants/pagination.constants";
import {NgbDate, NgbModule, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {MatMenu, MatMenuModule, MatMenuTrigger} from "@angular/material/menu";
import {
  MatDatepickerModule,
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker
} from "@angular/material/datepicker";
import {MatOption, MatSelect, MatSelectModule} from "@angular/material/select";
import {MatTooltip} from "@angular/material/tooltip";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatPaginator, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {Observable, Subject, takeUntil} from "rxjs";
import {InventoryPagination} from "../../../users-module/admin/list-admin/admin.types";
import {User} from "../../../../../../shared/services/authauthentication/user.model";
import {FuseConfirmationService} from "../../../../../../../@fuse/services/confirmation";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatNativeDateModule, MatOptionModule, MatRippleModule} from "@angular/material/core";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {NgSelectModule} from "@ng-select/ng-select";
import {CdkScrollableModule} from "@angular/cdk/scrolling";
import {MatDividerModule} from "@angular/material/divider";
import {MatProgressBar} from "@angular/material/progress-bar";
import {fuseAnimations} from "../../../../../../../@fuse/animations";
import {BailsService} from "../../../../../../shared/services/leases/BailService";
import {Bails} from "../../../../../../shared/services/leases/Bails";

@Component({
  selector: 'app-list-leases',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSortModule,
    MatPaginatorModule,
    NgClass,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatRippleModule,
    AsyncPipe,
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
    RouterLink,
    MatProgressBar

  ],
  templateUrl: './list-leases.component.html',
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
})
export class ListLeasesComponent  implements OnInit , OnDestroy
{
  @ViewChild(MatPaginator) private _paginator: MatPaginator;

  Bailss$: Observable<Bails[]>;
  pagination: InventoryPagination;
  private _unsubscribeAll = new Subject<void>();
  isLoading: boolean = false;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  public col: string = '3';
  Bails: Bails [] = [];
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
      private _Bailservice: BailsService,
      protected translate: TranslocoService,
      private router: Router
  ) {}
  ngOnInit(): void {
    // Get the pagination
    this._Bailservice.pagination$
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
    this._Bailservice.getBailsPageable$(0, 20);
    this.Bailss$ = this._Bailservice.Bailsss$;

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
    this._Bailservice.getBailsPageable$(event.pageIndex, event.pageSize);
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
  deleteBails(Bails: Bails): void {
    this._Bailservice.deleteBails(Bails.id).subscribe(
        () => console.log(`Bails ${Bails.bailNum} supprimé avec succès.`),
        (error) => {
          this._fuseConfirmationService.open({
            title: this.translate.translate(`Erreur`),
            message: this.translate.translate(`Le Bails ne peut pas être supprimé car il est lié à d'autres entités.`),
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
  openConfirmationDialog(Bails: Bails): void {
    const dialogRef = this._fuseConfirmationService.open({
      title: `${this.translate.translate('Supprimer le Bails')} ${Bails.bailNum} ?`,
      message: this.translate.translate(`Êtes-vous sûr de vouloir supprimer ce Bails ? Cette action est irréversible.`),
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
        this.deleteBails(Bails);
      }
    });
  }
  navigateToEdit(Bails: Bails): void {
    console.log('Bails envoyé :', Bails); // Debugging
    this.router.navigate(['/pages/properties/update-Bails'], { state: { Bails } });
  }
  //TODO:ajouter une methode changeVisibility BE et FE pour changer la Visibility rapidement apartir de table
  changeVisibility(Bails: any) {
  }
}

