/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [

    {
        id   : 'pages.users',
        title: 'Users Management',
        subtitle: '',
        type: 'collapsable',
        icon : 'heroicons_outline:user-group',
        children: [
            {
                id: 'pages.admins',
                title: 'Admins',
                type: 'basic',
                link : '/pages/admins',
            },
            {
                id: 'pages.sub-admins',
                title: 'Sub admins',
                type: 'basic',
                link : '/pages/sub-admins',
            },

        ]
    },
    {
        id: 'pages.management',
        title: 'Management',
        subtitle: '',
        type: 'collapsable',
        icon: 'heroicons_outline:building-office',
        children: [
            {
                id: 'pages.properties',
                title: 'Properties',
                type: 'basic',
                link: '/pages/properties'
            },

            {
                id: 'pages.units',
                title: 'Units',
                type: 'basic',
                link: '/pages/units'
            },

            {
                id: 'pages.leases',
                title: 'Leases',
                type: 'basic',
                link: '/pages/leases'
            },
            {
                id: 'pages.request',
                title: 'Requests',
                type: 'basic',
                link: '/pages/request'
            }
        ]
    },
    {
        id: 'pages.reclamations',
        title: 'Reclamations',
        subtitle: '',
        type: 'collapsable',
        icon: 'heroicons_outline:pencil-square',
        children: [
            {
                id: 'pages.reclamations',
                title: 'Reclamations',
                type: 'basic',
                link: '/pages/reclamations'
            },
            {
                id: 'pages.type_reclamations',
                title: 'Type of reclamations',
                type: 'basic',
                link: '/pages/type_reclamations'
            },
        ]
    },
    {
        id: 'pages.incomes&expenses',
        title: 'Incomes & Expenses',
        subtitle: '',
        type: 'collapsable',
        icon: 'heroicons_outline:currency-euro',
        children: [
            {
                id: 'pages.suppliers',
                title: 'Suppliers',
                type: 'basic',
                link: '/pages/suppliers'
            },

            {
                id: 'pages.expenses',
                title: 'Expenses',
                type: 'basic',
                link: '/pages/expenses'
            },
            {
                id: 'pages.reglements',
                title: 'Reglements',
                type: 'basic',
                link: '/pages/reglements'
            },
            {
                id: 'pages.debits',
                title: 'Debits',
                type: 'basic',
                link: '/pages/debits'
            },
            {
                id: 'pages.radiations',
                title: 'Radiations',
                type: 'basic',
                link: '/pages/radiations'
            },

            {
                id: 'pages.gratuites',
                title: 'Free',
                type: 'basic',
                link: '/pages/gratuites'
            },
            {
                id: 'pages.vacants',
                title: 'Vacants',
                type: 'basic',
                link: '/pages/vacants'
            },
            {
                id: 'pages.discount',
                title: 'Discounts',
                type: 'basic',
                link: '/pages/discounts'
            },
            {
                id: 'pages.openAp',
                title: 'Open Ap',
                type: 'basic',
                link: '/pages/balance/open-ap'
            },
            {
                id: 'pages.openAr',
                title: 'Open Ar',
                type: 'basic',
                link: '/pages/balance/open-ar'
            },
        ]
    },
    {
        id: 'pages.accounting',
        title: 'accounting',
        subtitle: '',
        type: 'collapsable',
        icon: 'heroicons_outline:currency-euro',
        children: [
            {
                id: 'pages.chartmanagment',
                title: 'chartmanagment',
                type: 'basic',
                link: '/pages/chart-management'
            }
        ]
    },

    {
        id: 'pages.statistics',
        title: 'Statistics',
        subtitle: '',
        type: 'collapsable',
        icon: 'heroicons_outline:chart-bar',
        children: [
            {
                id: 'pages.properties',
                title: 'Properties',
                type: 'basic',
                link: '/pages/statistics/properties'
            },
        ]
    },
    {
        id: 'pages.settings',
        title: 'Settings',
        subtitle: '',
        type: 'collapsable',
        icon: 'heroicons_outline:cog',
        children: [
            {
                id: 'pages.features',
                title: 'Features',
                type: 'basic',
                link: '/pages/features'
            },
            {
                id   : 'pages.banks',
                title: 'Bank account',
                type : 'basic',
                link : '/pages/bank-account'
            },
            {
                id: 'pages.service',
                title: 'Services',
                type: 'basic',
                link: '/pages/services'
            },
            {
                id: 'pages.unitTypes',
                title: 'Unit type',
                type: 'basic',
                link: '/pages/unit-types'
            },
            {
                id: 'pages.payment',
                title: 'Payment methods',
                type: 'basic',
                link: '/pages/config/payment-methods'
            },
            {
                id: 'pages.type.expenses',
                title: 'Type expenses',
                type: 'basic',
                link: '/pages/type-expenses'
            },
            {
                id: 'pages.type.account',
                title: 'Type account',
                type: 'basic',
                link: '/pages/config/typeAccount'
            }
        ]
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Dashboards',
        tooltip : 'Dashboards',
        type    : 'aside',
        icon    : 'heroicons_outline:home',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'apps',
        title   : 'Apps',
        tooltip : 'Apps',
        type    : 'aside',
        icon    : 'heroicons_outline:qrcode',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'pages',
        title   : 'Pages',
        tooltip : 'Pages',
        type    : 'aside',
        icon    : 'heroicons_outline:document-duplicate',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'user-interface',
        title   : 'UI',
        tooltip : 'UI',
        type    : 'aside',
        icon    : 'heroicons_outline:collection',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'navigation-features',
        title   : 'Navigation',
        tooltip : 'Navigation',
        type    : 'aside',
        icon    : 'heroicons_outline:menu',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'DASHBOARDS',
        type    : 'group',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'apps',
        title   : 'APPS',
        type    : 'group',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id   : 'others',
        title: 'OTHERS',
        type : 'group'
    },
    {
        id      : 'pages',
        title   : 'Pages',
        type    : 'aside',
        icon    : 'heroicons_outline:document-duplicate',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'user-interface',
        title   : 'User Interface',
        type    : 'aside',
        icon    : 'heroicons_outline:collection',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'navigation-features',
        title   : 'Navigation Features',
        type    : 'aside',
        icon    : 'heroicons_outline:menu',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Dashboards',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'apps',
        title   : 'Apps',
        type    : 'group',
        icon    : 'heroicons_outline:qrcode',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'pages',
        title   : 'Pages',
        type    : 'group',
        icon    : 'heroicons_outline:document-duplicate',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'user-interface',
        title   : 'UI',
        type    : 'group',
        icon    : 'heroicons_outline:collection',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'navigation-features',
        title   : 'Misc',
        type    : 'group',
        icon    : 'heroicons_outline:menu',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    }
];
