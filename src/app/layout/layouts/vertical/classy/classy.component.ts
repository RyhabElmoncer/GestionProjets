import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { FuseFullscreenComponent } from '@fuse/components/fullscreen';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import {
    FuseNavigationItem,
    FuseNavigationService,
    FuseVerticalNavigationComponent,
} from '@fuse/components/navigation';
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
import {User} from "../../../../shared/services/authauthentication/user.model";


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
export class ClassyLayoutComponent implements OnInit{
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
        // Subscribe to navigation data
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                if (currentUser && currentUser.role) {
                    const role = currentUser.role;
                    if(role === "ADMIN") {
                        this.navigation = navigation;
                        this.isShowNotification = true;
                    }
                    if (role === "SUB_ADMIN" || role === "OWNER") {
                        navigation.default = [];
                        this.navigation = navigation;
                        const menu: FuseNavigationItem [] = [{
                            id: 'dashboards.analytics',
                            title: 'Dashboard',
                            type: 'basic',
                            icon: 'heroicons_outline:chart-pie',
                            link: '/dashboard'

                        }];


                        const privileges = currentUser.privilegeStrings;
                        const privilegeMap: Record<string, Record<string, string[]>> = {};
                        privileges.forEach(privilege => {
                            const [module, subModule, action] = privilege.split(':');
                            if (!privilegeMap[module]) {
                                privilegeMap[module] = {};
                            }
                            if (!privilegeMap[module][subModule]) {
                                privilegeMap[module][subModule] = [];
                            }
                            privilegeMap[module][subModule].push(action);
                        });
                        if (privilegeMap['USERS']) {
                            let users: FuseNavigationItem = ({
                                id: 'pages.users',
                                title: 'Users',
                                subtitle: '',
                                type: 'collapsable',
                                icon: 'heroicons_outline:user-group',
                                children: []
                            })
                            if (privilegeMap['USERS']['SUB_ADMINS']) {
                                users.children.push(
                                    {
                                        id: 'pages.sub-admins',
                                        title: 'Sub admins',
                                        type: 'basic',
                                        link : '/pages/sub-admins',
                                    }
                                )
                            }
                            if (privilegeMap['USERS']['OWNERS']) {
                                users.children.push(
                                    {
                                        id: 'pages.owners',
                                        title: 'Owners',
                                        type: 'basic',
                                        link: '/pages/owners'
                                    }
                                )
                            }
                            if (privilegeMap['USERS']['TENANTS']) {
                                users.children.push(
                                    {
                                        id: 'pages.tenants',
                                        title: 'Tenants',
                                        type: 'basic',
                                        link: '/pages/tenants'
                                    }
                                )
                            }
                            menu.push(users)
                        }
                        if (privilegeMap['MANAGEMENT']) {
                            let management: FuseNavigationItem = {
                                        id: 'pages.management',
                                        title: 'Management',
                                        subtitle: '',
                                        type: 'collapsable',
                                        icon: 'heroicons_outline:building-office',
                                        children: []
                            }
                            if (privilegeMap['MANAGEMENT']['BUILDINGS']) {
                                management.children.push(
                                    {
                                        id: 'pages.properties',
                                        title: 'Properties',
                                        type: 'basic',
                                        link: '/pages/properties'
                                    }
                                )
                            }
                            if (privilegeMap['MANAGEMENT']['UNITS']) {
                                management.children.push(
                                    {
                                        id: 'pages.units',
                                        title: 'Units',
                                        type: 'basic',
                                        link: '/pages/units'
                                    }
                                )
                            }
                            if (privilegeMap['MANAGEMENT']['LEASES']) {
                                management.children.push({
                                    id: 'pages.leases',
                                    title: 'Leases',
                                    type: 'basic',
                                    link: '/pages/leases'
                                    }
                                )
                            }
                            if (privilegeMap['MANAGEMENT']['TENANT_REQUESTS']) {
                                management.children.push({
                                    id: 'pages.request',
                                    title: 'Requests',
                                    type: 'basic',
                                    link: '/pages/request'
                                    }
                                )
                            }
                            if (privilegeMap['MANAGEMENT']['UNIT_TYPES']) {
                                management.children.push({
                                    id: 'pages.unitTypes',
                                    title: 'Unit type',
                                    type: 'basic',
                                    link: '/pages/unit-types'
                                    }
                                )
                            }
                            menu.push(management)
                        }
                        if (privilegeMap['INCOME_AND_EXPENSES']) {
                            let income: FuseNavigationItem = {
                                id: 'pages.incomes&expenses',
                                title: 'Incomes & Expenses',
                                type: 'collapsable',
                                icon: 'heroicons_outline:currency-euro',
                                children: []
                            }
                            if (privilegeMap['INCOME_AND_EXPENSES']['SUPPLIERS']) {
                                income.children.push(
                                    {
                                        id: 'pages.suppliers',
                                        title: 'Suppliers',
                                        type: 'basic',
                                        link: '/pages/suppliers'
                                    }
                                )
                            }
                            if (privilegeMap['INCOME_AND_EXPENSES']['EXPENSES']) {
                                income.children.push(
                                    {
                                        id: 'pages.expenses',
                                        title: 'Expenses',
                                        type: 'basic',
                                        link: '/pages/expenses'
                                    }
                                )
                            }
                            if (privilegeMap['INCOME_AND_EXPENSES']['ENCASEMENTS']) {
                                income.children.push(
                                    {
                                        id: 'pages.reglements',
                                        title: 'Reglements',
                                        type: 'basic',
                                        link: '/pages/reglements'
                                    }
                                )
                            }
                            if (privilegeMap['INCOME_AND_EXPENSES']['BILLINGS']) {
                                income.children.push(
                                    {
                                        id: 'pages.debits',
                                        title: 'Debits',
                                        type: 'basic',
                                        link: '/pages/debits'
                                    }
                                )
                            }
                            if (privilegeMap['INCOME_AND_EXPENSES']['RADIATIONS']) {
                                income.children.push(
                                    {
                                        id: 'pages.radiations',
                                        title: 'Radiations',
                                        type: 'basic',
                                        link: '/pages/radiations'
                                    }
                                )
                            }
                            if (privilegeMap['INCOME_AND_EXPENSES']['GRATUITIES']) {
                                income.children.push(
                                    {
                                        id: 'pages.gratuites',
                                        title: 'Free',
                                        type: 'basic',
                                        link: '/pages/gratuites'
                                    }
                                )
                            }
                            if (privilegeMap['INCOME_AND_EXPENSES']['VACANTS']) {
                                income.children.push(
                                    {
                                        id: 'pages.vacants',
                                        title: 'Vacants',
                                        type: 'basic',
                                        link: '/pages/vacants'
                                    }
                                )
                            }
                            if (privilegeMap['INCOME_AND_EXPENSES']['DISCOUNTS']) {
                                income.children.push(
                                    {
                                        id: 'pages.discount',
                                        title: 'Discounts',
                                        type: 'basic',
                                        link: '/pages/discounts'
                                    }
                                )
                            }
                            if (privilegeMap['INCOME_AND_EXPENSES']['OPEN_AP']) {
                                income.children.push(
                                    {
                                        id: 'pages.openAp',
                                        title: 'Open Ap',
                                        type: 'basic',
                                        link: '/pages/balance/open-ap'
                                    }
                                )
                            }
                            if (privilegeMap['INCOME_AND_EXPENSES']['OPEN_AR']) {
                                income.children.push(
                                    {
                                        id: 'pages.openAr',
                                        title: 'Open Ar',
                                        type: 'basic',
                                        link: '/pages/balance/open-ar'
                                    }
                                )
                            }
                            menu.push(income)
                        }
                        if (privilegeMap['SETTINGS']) {
                            let config: FuseNavigationItem = {
                                id: 'pages.settings',
                                title: 'Settings',
                                subtitle: '',
                                type: 'collapsable',
                                icon: 'heroicons_outline:cog',
                                children: []
                            }
                            if (privilegeMap['SETTINGS']['INCLUSIONS']) {
                                config.children.push(
                                    {
                                        id: 'pages.features',
                                        title: 'Features',
                                        type: 'basic',
                                        link: '/pages/features'
                                    },
                                )
                            }
                            if (privilegeMap['SETTINGS']['SERVICES']) {
                                config.children.push(
                                    {
                                        id: 'pages.service',
                                        title: 'Services',
                                        type: 'basic',
                                        link: '/pages/services'
                                    },
                                )
                            }
                            if (privilegeMap['SETTINGS']['PAYMENT_METHODS']) {
                                config.children.push(
                                    {
                                        id: 'pages.payment',
                                        title: 'Payment methods',
                                        type: 'basic',
                                        link: '/pages/config/payment-methods'
                                    }
                                )
                            }
                            if (privilegeMap['SETTINGS']['TYPE_OF_EXPENSES']) {
                                config.children.push(
                                    {
                                        id: 'pages.type.expenses',
                                        title: 'Type expenses',
                                        type: 'basic',
                                        link: '/pages/type-expenses'
                                    }
                                )
                            }
                            if (privilegeMap['SETTINGS']['BANK_ACCOUNTS']) {
                                config.children.push(
                                    {
                                        id   : 'pages.banks',
                                        title: 'Bank account',
                                        type : 'basic',
                                        link : '/pages/bank-account'
                                    }
                                )
                            }
                            menu.push(
                                config
                            )
                        }
                        navigation.default = menu;
                        this.navigation = navigation;
                    }

                    this.user = currentUser;
                    this.name = this.user?.firstname + ' ' ;

                    if(this.user?.lastname) {
                        this.name = this.name + this.user?.lastname;
                    }

                } else {
                    console.log('Role not found');
                    this._router.navigate(['/sign-out']);
                }
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
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
    toggleNavigation(name: string):
        void {
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
