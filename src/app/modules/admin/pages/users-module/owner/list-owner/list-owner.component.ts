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
import {AdminService} from "../../../../../../shared/services/admin/admin.service";
import {User} from "../../../../../../shared/services/authauthentication/user.model";
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { RouterLink ,Router } from '@angular/router';
@Component({
  selector: 'app-list-owner',
  templateUrl: './list-owner.component.html',
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
          grid-template-columns: 180px 200px 150px 200px 120px 150px 150px 150px ;
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
export class ListOwnerComponent implements OnInit , OnDestroy
{
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  users$: Observable<User[]>;
  pagination: InventoryPagination;
  private _unsubscribeAll = new Subject<void>();
  isLoading: boolean = false;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  public col: string = '3';
  users: any [] = [];
  page!: number;
  configForm: UntypedFormGroup;
  isAdmin: boolean;
  isSubadmin: boolean;
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
      private _adminService: AdminService,
      protected translate: TranslocoService,
      private router: Router
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
        // Charge les admins pour la première fois
        this._adminService.getAdmins$('OWNER', 0, 20);
      }
      else if (role === "SUB_ADMIN") {
        this.isSubadmin = true;
        //todo modifier la liste de owners sous le sub admin et non pas tous les owners
        // Charge les owners pour la première fois
        this._adminService.getAdmins$('OWNER', 0, 20);
        // verification des privileges
        const privilegeSet = new Set(this.currentUser.privilegeStrings);
        // Vérifier les privilèges directement avec `has()`
        this.isRead = privilegeSet.has("USERS:OWNERS:READ");
        this.isWrite = privilegeSet.has("USERS:OWNERS:WRITE");
        this.isUpdate = privilegeSet.has("USERS:OWNERS:UPDATE");
        this.isDelete = privilegeSet.has("USERS:OWNERS:DELETE");
      }
    }
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
    this._adminService.getAdmins$('OWNER', event.pageIndex, event.pageSize);
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
    if (this.isUpdate){
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
    this.router.navigate(['/pages/owners/edit-owner'], { state: { user } });
  }
}
