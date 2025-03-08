import {InventoryPagination} from "../../../users-module/admin/list-admin/admin.types";
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
import { cloneDeep } from 'lodash-es';
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
import { RouterLink } from '@angular/router';
import {ServiceInclusion} from "../../../../../../shared/services/settings/serviceInclusion.model";
import {ServiceService} from "../../../../../../shared/services/settings/services.service";
import {User} from "../../../../../../shared/services/authauthentication/user.model";
import {ServiceModalComponent} from "../service-modal/service-modal.component";
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-list-services',
  templateUrl: './list-services.component.html',
  styles: [
    /* language=SCSS */
    `
      .inventory-grid {
        grid-template-columns: 48px auto 40px;

        @screen sm {
          grid-template-columns: 48px auto 112px 72px;
        }

        @screen md {
          grid-template-columns: 48px 112px auto 112px 72px;
        }

        @screen lg {
          grid-template-columns: 180px auto 150px ;
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
})
export class ListServicesComponent implements OnInit , OnDestroy
{
  @ViewChild(MatPaginator) private _paginator: MatPaginator;

  services$: Observable<ServiceInclusion[]>;
  pagination: InventoryPagination;
  private _unsubscribeAll = new Subject<void>();
  isLoading: boolean = false;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  public col: string = '3';
  users: any [] = [];
  page!: number;
  confirmDelete: UntypedFormGroup;
  isAdmin: boolean;
  isSubadmin: boolean;
  isOwner: boolean;
  isRead :boolean;
  isDelete :boolean;
  isWrite :boolean;
  isUpdate :boolean;
  currentUser:User;
  /**
   * Constructor
   */
  constructor(
      private _fuseConfirmationService: FuseConfirmationService,
      private _formBuilder: UntypedFormBuilder,
      private _changeDetectorRef: ChangeDetectorRef,
      private _serviceService: ServiceService,
      protected translate: TranslocoService,
      private _matDialog: MatDialog,
  ) {}
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (this.currentUser && this.currentUser.role) {
      const role = this.currentUser.role;
      if (role === "ADMIN") {
        this.isAdmin = true;
        this.isRead= true;
        this.isWrite= true;
        this.isDelete= true;
        this.isUpdate= true;
      }
      else if (role === "SUB_ADMIN" || role === "OWNER" ) {
        if (role === "SUB_ADMIN") {
          this.isSubadmin = true;
        }
        else {
          this.isOwner= true;
        }
        // verification des privileges
        const privilegeSet = new Set(this.currentUser.privilegeStrings);
        // Vérifier les privilèges directement avec `has()`
        this.isRead = privilegeSet.has("SETTINGS:SERVICES:READ");
        this.isWrite = privilegeSet.has("SETTINGS:SERVICES:WRITE");
        this.isUpdate = privilegeSet.has("SETTINGS:SERVICES:UPDATE");
        this.isDelete = privilegeSet.has("SETTINGS:SERVICES:DELETE");
      }
    }
    // Charge les admins pour la première fois
    this._serviceService.getServices$( 0, 20);

    // Get the pagination
    this._serviceService.pagination$
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


    this.services$ = this._serviceService.services$;

  }
  onPageChange(event: PageEvent): void {
    this._serviceService.getServices$(event.pageIndex, event.pageSize);
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


  deleteService(service: ServiceInclusion): void {
    this._serviceService.deleteService(service.id).subscribe(
        () => console.log(`Utilisateur ${service.name} supprimé avec succès.`),
        (error) => {
           this._fuseConfirmationService.open({
            title: this.translate.translate(`Erreur`),
            message: this.translate.translate(`Le service ne peut pas être supprimé car il est lié à d'autres entités.`),
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
  openConfirmationDialog(service: ServiceInclusion): void {
    const dialogRef = this._fuseConfirmationService.open({
      title: `${this.translate.translate('Supprimer le service')} ${service.name} ?`,
      message: this.translate.translate(`Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.`),
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
        this.deleteService(service);
      }
    });
  }
  addNewNSevice(): void {
    this._matDialog.open(ServiceModalComponent, {
      autoFocus: false,
      data: {
        service: {},
      },
    });
  }

  openEditDialog(service: any) {
    this._matDialog.open(ServiceModalComponent, {
      autoFocus: false,
      data: {
        service: cloneDeep(service),
      },
    });
  }
}
