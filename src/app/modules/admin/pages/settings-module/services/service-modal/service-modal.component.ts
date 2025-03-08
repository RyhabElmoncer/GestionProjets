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
import {ServiceService} from "../../../../../../shared/services/settings/services.service";
import {FuseConfirmationService} from "../../../../../../../@fuse/services/confirmation";
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
@Component({
    selector: 'notes-details',
    templateUrl: './service-modall.component.html',
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
export class ServiceModalComponent implements OnInit, OnDestroy {
    service$: Observable<ServiceInclusion>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _fuseConfirmationService: FuseConfirmationService,
        protected translate: TranslocoService,
        private _serviceService: ServiceService,
        @Inject(MAT_DIALOG_DATA) private _data: { service: ServiceInclusion },
        private _matDialogRef: MatDialogRef<ServiceModalComponent>
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Edit
        if (this._data.service.id) {
            const service = {
                id: this._data.service.id,
                name: this._data.service.name,
                description: this._data.service.description
            };
            // Get the note
            this.service$ = of(service);
        }
        // Add
        else {
            // Create an empty note
            const service = {
                id: null,
                name: '',
                description: ''
            };

            this.service$ = of(service);
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
    createService(service: ServiceInclusion): void {
        this._serviceService.createService(service).subscribe({
            next: (response) => {
                console.log("Service créé avec succès :", response);
                // Close the dialog
                this._matDialogRef.close();
                this._fuseConfirmationService.open({
                        title: this.translate.translate(`Succès`),
                        message:  this.translate.translate(`Le service a ete créé avec succès .`),
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
                console.error("Erreur lors de la création du service :", error);
                // Ajoute ici la gestion d'erreur (ex: message d'alerte)
            }
        });
    }
    editService(service: ServiceInclusion): void {
        this._serviceService.editService(service).subscribe({
            next: (response) => {
                console.log("Service modifié avec succès :", response);
                // Close the dialog
                this._matDialogRef.close();
                this._fuseConfirmationService.open({
                    title: this.translate.translate(`Succès`),
                    message: this.translate.translate(`Le service a ete modifié avec succès .`),
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
                console.error("Erreur lors de la modification du service :", error);
                // Ajoute ici la gestion d'erreur (ex: message d'alerte)
            }
        });
    }

}
