import { TextFieldModule } from '@angular/cdk/text-field';
import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
    Observable,
    Subject,
    of
} from 'rxjs';
import {ServiceInclusion} from "../../../../../../shared/services/settings/serviceInclusion.model";
import {FuseConfirmationService} from "../../../../../../../@fuse/services/confirmation";
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import {InclusionsService} from "../../../../../../shared/services/settings/inclusions.service";
@Component({
    selector: 'notes-details',
    templateUrl: './inclusion-modal.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatButtonModule,
        MatIconModule,
        FormsModule,
        TextFieldModule,
        MatCheckboxModule,
        NgClass,
        MatRippleModule,
        MatMenuModule,
        MatDialogModule,
        AsyncPipe,
        TranslocoModule,
    ],
    standalone: true
})
export class InclusionModalComponent implements OnInit, OnDestroy {
    inclusion$: Observable<ServiceInclusion>;

    noteChanged: Subject<ServiceInclusion> = new Subject<ServiceInclusion>();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _fuseConfirmationService: FuseConfirmationService,
        protected translate: TranslocoService,
        private _inclusionService: InclusionsService,
        @Inject(MAT_DIALOG_DATA) private _data: { inclusion: ServiceInclusion },
        private _matDialogRef: MatDialogRef<InclusionModalComponent>
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Edit
        if (this._data.inclusion.id) {
            const inclusion = {
                id: this._data.inclusion.id,
                name: this._data.inclusion.name,
                description: this._data.inclusion.description
            };
            // Get the note
            this.inclusion$ = of(inclusion);
        }
        // Add
        else {
            // Create an empty note
            const inclusion = {
                id: null,
                name: '',
                description: ''
            };

            this.inclusion$ = of(inclusion);
        }



    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create a new note
     *
     * @param note
     */
    createInclusion(inclusion: ServiceInclusion): void {
        this._inclusionService.createInclusion(inclusion).subscribe({
            next: (response) => {
                console.log("Service créé avec succès :", response);
                // Close the dialog
                this._matDialogRef.close();
                this._fuseConfirmationService.open({
                        title: this.translate.translate(`Succès`),
                        message:  this.translate.translate(`L inclusion a ete créé avec succès .`),
                        icon: {
                            show: true,
                            name: 'heroicons_outline:check',
                            color: 'success',
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

                // Ajoute ici la gestion du succès (ex: affichage d'un message, redirection...)
            },
            error: (error) => {
                console.error("Erreur lors de la création d inclusion :", error);
                // Ajoute ici la gestion d'erreur (ex: message d'alerte)
            }
        });
    }
    editInclusion(inclusion: ServiceInclusion): void {
        this._inclusionService.editInclusion(inclusion).subscribe({
            next: (response) => {
                console.log("inclusion modifié avec succès :", response);
                // Close the dialog
                this._matDialogRef.close();
                this._fuseConfirmationService.open({
                    title: this.translate.translate(`Succès`),
                    message: this.translate.translate(`L inclusion a ete créé avec succès .`),
                    icon: {
                        show: true,
                        name: 'heroicons_outline:check',
                        color: 'success',
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

                // Ajoute ici la gestion du succès (ex: affichage d'un message, redirection...)
            },
            error: (error) => {
                console.error("Erreur lors de la modification d' inclusion :", error);
                // Ajoute ici la gestion d'erreur (ex: message d'alerte)
            }
        });
    }

}
