import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import {
    ListServicesComponent
} from "./modules/admin/pages/settings-module/services/list-services/list-services.component";
import {
    ListInclusionsComponent
} from "./modules/admin/pages/settings-module/inclusions/list-inclusions/list-inclusion.component";

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/dashboards/project'
    {path: '', pathMatch: 'full', redirectTo: 'dashboard'},

    // Redirect signed in user to the '/dashboards/project'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'dashboard'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {
                path: 'confirmation-required',
                loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes')
            },
            {
                path: 'forgot-password',
                loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes')
            },
            {
                path: 'reset-password',
                loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes')
            },
            {
                path: 'sign-in',
                loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes')
            },
            {
                path: 'sign-up',
                loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes')
            }
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {
                path: 'sign-out',
                loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes')
            },
            {
                path: 'unlock-session',
                loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes')
            }
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {
                path: 'home',
                loadChildren: () => import('app/modules/landing/home/home.routes')
            },
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        data: {
            authorities: ['ROLE_ADMIN', 'ROLE_USER'],
        },
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver,
        },
        children: [

            // Dashboards
            {
                path: 'dashboard', children: [
                    {
                        path: '',
                        loadChildren: () => import('app/modules/admin/dashboards/project/project.routes')
                    },
                ]
            },

            // Pages
            {
                path: 'pages',
                canActivate: [AuthGuard],
                data: {
                    authorities: ['ROLE_ADMIN', 'ROLE_USER'],
                },
                children: [

                    // Coming Soon
                    /*{
                        path: 'users',
                        loadChildren: () => import('app/modules/admin/pages/users/users.routes')
                    },

                    {
                        path: 'unit-types',
                        loadChildren: () => import('app/modules/admin/pages/config/unit-type/unit-type.routes')
                    },

                    {
                        path: 'radiations',
                        loadChildren: () => import('app/modules/admin/pages/radition/radition.routes')
                    },

                    {
                        path: 'statistics',
                        loadChildren: () => import('app/modules/admin/pages/statistics/statistics.routes')
                    },

                    {
                        path: 'gratuites',
                        loadChildren: () => import('app/modules/admin/pages/gratuite/gratuite.routes')
                    },
                    {
                        path: 'vacants',
                        loadChildren: () => import('app/modules/admin/pages/vacants/vacants.routes')
                    },

                    {
                        path: 'discounts',
                        loadChildren: () => import('app/modules/admin/pages/discounts/discounts.routes')
                    },

                    {
                        path: 'suppliers',
                        loadChildren: () => import('app/modules/admin/pages/supplier/supplier.routes')
                    },
                    {
                        path: 'type-expenses',
                        loadChildren: () => import('app/modules/admin/pages/type-depense/type-depense.routes')
                    },

                    {
                        path: 'expenses',
                        loadChildren: () => import('app/modules/admin/pages/expenses/expenses.routes')
                    },


                    {
                        path: 'reglements',
                        loadChildren: () => import('app/modules/admin/pages/reglements/reglements.routes')
                    },


                    {
                        path: 'debits',
                        loadChildren: () => import('app/modules/admin/pages/debits/debits.routes')
                    },

                    {
                        path: 'balance',
                        loadChildren: () => import('app/modules/admin/pages/open-ap-ar/open-ap-ar.routes')
                    },

                    {
                        path: 'reclamations',
                        loadChildren: () => import('app/modules/admin/pages/complaints/complaints.routes')
                    },


                    {
                        path: 'request',
                        loadChildren: () => import('app/modules/admin/pages/request/request.routes')
                    },

                    {
                        path: 'properties',
                        loadChildren: () => import('app/modules/admin/pages/properties/properties.routes')
                    },


                    {
                        path: 'units',
                        loadChildren: () => import('app/modules/admin/pages/units/units.routes')
                    },


                    {
                        path: 'leases',
                        loadChildren: () => import('app/modules/admin/pages/leases/leases.routes')
                    },

                    {
                        path: 'features',
                        loadChildren: () => import('app/modules/admin/pages/features/features.routes')
                    },

                    {
                        path: 'company',
                        component: CompanyComponent
                    },
                    {
                        path: 'type_reclamations',
                        component: TypeReclamationsComponent
                    },
                    {
                        path: 'services',
                        component: ServicesComponent
                    },
                    {
                        path: 'bank-account',
                        loadChildren: () => import('app/modules/admin/pages/bank-account/bank-account.routes')
                    },
                    {
                        path: 'chart-management',
                        loadChildren: () => import('app/modules/admin/pages/chart-managment/chart-managment.routes')
                    },
                    {
                        path: 'config',
                        loadChildren: () => import('app/modules/admin/pages/config/config.routes')
                    },
                    // Settings
                    {
                        path: 'profile',
                        loadChildren: () => import('app/modules/admin/pages/settings/settings.routes')
                    },
                    {
                        path: 'all-users',
                        loadChildren: () => import('app/modules/admin/pages/all-users/users.routes')
                    }*/
                    //new routes

                    {
                        path: 'admins',
                        loadChildren: () => import('app/modules/admin/pages/users-module/admin/admin.routes')
                    },
                    {
                        path: 'owners',
                        loadChildren: () => import('app/modules/admin/pages/users-module/owner/owner.routes')
                    },
                    {
                        path: 'tenants',
                        loadChildren: () => import('app/modules/admin/pages/users-module/tenant/tenant.routes')
                    },
                    {
                        path: 'sub-admins',
                        loadChildren: () => import('app/modules/admin/pages/users-module/sub-admin/sub-admin.routes')
                    },
                    {
                        path: 'properties',
                        loadChildren: () => import('app/modules/admin/pages/management-module/property/property.routes')
                    },
                    {
                        path: 'leases',
                        loadChildren: () => import('app/modules/admin/pages/management-module/leases/leases.routes')
                    },
                    {
                        path: 'services',
                        component: ListServicesComponent
                    },
                    {
                        path: 'features',
                        component: ListInclusionsComponent
                    },
                    {
                        path: 'units',
                        loadChildren: () => import('app/modules/admin/pages/management-module/unit/unit.routes')
                    },
                ]
            },
            // 404 & Catch all
            {
                path: '404-not-found',
                pathMatch: 'full',
                loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.routes')
            },
            {path: '**', redirectTo: '404-not-found'}
        ]
    }
];
