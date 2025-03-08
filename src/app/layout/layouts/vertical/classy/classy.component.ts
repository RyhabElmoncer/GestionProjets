import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { FuseFullscreenComponent } from '@fuse/components/fullscreen';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { FuseNavigationItem, FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';
import { MessagesComponent } from 'app/layout/common/messages/messages.component';
import { NotificationsComponent } from 'app/layout/common/notifications/notifications.component';
import { QuickChatComponent } from 'app/layout/common/quick-chat/quick-chat.component';
import { SearchComponent } from 'app/layout/common/search/search.component';
import { ShortcutsComponent } from 'app/layout/common/shortcuts/shortcuts.component';
import { UserComponent } from 'app/layout/common/user/user.component';
import { Subject, takeUntil } from 'rxjs';
import { AccountService } from '../../../../core/user/account.service';
import { TranslocoService } from '@jsverse/transloco';
import { CommonModule } from '@angular/common';
import { User } from "../../../../shared/services/authauthentication/user.model";

@Component({
    selector: 'classy-layout',
    templateUrl: './classy.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        FuseLoadingBarComponent,
        FuseVerticalNavigationComponent,
        NotificationsComponent,
        UserComponent,
        MatIconModule,
        MatButtonModule,
        LanguagesComponent,
        FuseFullscreenComponent,
        SearchComponent,
        ShortcutsComponent,
        MessagesComponent,
        RouterOutlet,
        QuickChatComponent,
    ],
    standalone: true
})
export class ClassyLayoutComponent implements OnInit {
    isScreenSmall: boolean;
    navigation: Navigation;
    user: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isShowNotification = false;
    name = '';

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _navigationService: NavigationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Directly set the navigation structure
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                const defaultNavigation: FuseNavigationItem[] = [
                    {
                        id: 'dashboards.analytics',
                        title: 'Dashboard',
                        type: 'basic',
                        icon: 'heroicons_outline:chart-pie',
                        link: '/dashboard'
                    },
                  {
                                                id: 'pages.sub-admins',
                                                title: 'Users Managment',
                                                type: 'basic',
                                                link: '/pages/user',
                                                icon: 'heroicons_outline:user-group',
                                            },
                                         {
                                                                        id: 'pages.properties',
                                                                        title: 'Tasks Managment',
                                                                        type: 'basic',
                                                                        link: '/pages/task',
                                                                         icon: 'heroicons_outline:building-office',
                                                                    },
                                                                 {
                                                                                                id: 'pages.units',
                                                                                                title: 'Scrumboard',
                                                                                                type: 'basic',
                                                                                                link: '/pages/Scrumboard',
                                                                                                                        icon: 'heroicons_outline:building-office',

                                                                                            },

                    {
                        id: 'pages.settings',
                        title: 'Settings',
                        type: 'collapsable',
                        icon: 'heroicons_outline:cog',
                        children: [

                        ]
                    }
                ];

                this.navigation = { ...navigation, default: defaultNavigation };
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }

    refresh() {
        /*this.leaseService.refresh().subscribe(res => {
            Swal.fire({
                icon: 'success',
                title: this._translocoService.translate('The lease status has been successfully changed.'),
                showConfirmButton: true,
                confirmButtonText: this._translocoService.translate('Oui'),
            });
        })*/
    }
}
