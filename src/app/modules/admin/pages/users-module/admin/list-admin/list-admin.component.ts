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
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { take, map } from 'rxjs/operators';
import { MatNativeDateModule, MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
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
import { ITEMS_PER_PAGE } from '../../../../../../shared/constants/pagination.constants';
import {AdminService} from "../../../../../../shared/services/admin/admin.service";
import {User} from "../../../../../../shared/services/authauthentication/user.model";
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-admin',
  templateUrl: './list-admin.component.html',
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
          grid-template-columns: 180px auto 100px 150px 300px ;
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
    RouterLink,
  ],
  standalone: true,
  providers: [DatePipe]
})
export class ListAdminComponent
    implements OnInit , OnDestroy
{
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  users$: Observable<User[]>;
  pagination: InventoryPagination;
  private _unsubscribeAll = new Subject<void>();
  isLoading: boolean = false;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  public openSidebar: boolean = false;
  public col: string = '3';
  users: any [] = [];
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  loadPage: boolean;
  configForm: UntypedFormGroup;
  /**
   * Constructor
   */
  constructor(
      private _fuseConfirmationService: FuseConfirmationService,
      private _formBuilder: UntypedFormBuilder,
      private _changeDetectorRef: ChangeDetectorRef,
      private _adminService: AdminService,
      protected translate: TranslocoService,
      private router: Router
  ) {}
  ngOnInit(): void {
    // Get the pagination
    this._adminService.pagination$
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
    this._adminService.getAdmins$('ADMIN', 0, 20);
    this.users$ = this._adminService.users$;

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
    this._adminService.getAdmins$('ADMIN', event.pageIndex, event.pageSize);
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
  changeEnabled(user: User): void {
    const request = { userId: user.id, enabled: !user.enabled };

    this._adminService.activateOrDeactivateUser(request).subscribe(
        response => {
          console.log('Réponse de l\'API :', response);

          // Mise à jour de la liste des utilisateurs dans le BehaviorSubject
          this._adminService.users$.pipe(take(1)).subscribe(users => {
            if (users) {
              const updatedUsers = users.map(u => u.id === user.id ? { ...u, enabled: !u.enabled } : u);
              this._adminService._users.next(updatedUsers); // Met à jour le BehaviorSubject
            }
          });
        },
        error => {
          console.error('Erreur lors de la mise à jour de l\'état : ', error);
        }
    );
  }

  deleteUser(user: User): void {
    this._adminService.deleteUser(user.id).subscribe(
        () => console.log(`Utilisateur ${user.firstname} supprimé avec succès.`),
        (error) => console.error('Erreur lors de la suppression :', error)
    );
  }
  openConfirmationDialog(user: User): void {
    const dialogRef = this._fuseConfirmationService.open({
      title: `Supprimer ${user.firstname} ${user.lastname} ?`,
      message: `Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.`,
      icon: {
        show: true,
        name: 'heroicons_outline:exclamation-triangle',
        color: 'warn',
      },
      actions: {
        confirm: {
          show: true,
          label: 'Supprimer',
          color: 'warn',
        },
        cancel: {
          show: true,
          label: 'Annuler',
        },
      },
      dismissible: true,
    });

    // Après la fermeture du dialogue
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.deleteUser(user);
      }
    });
  }
  navigateToEdit(user: User): void {
    console.log('Utilisateur envoyé :', user); // Debugging
    this.router.navigate(['/pages/admins/edit-admin'], { state: { user } });
  }
}
