// modules.ts
export const modules = [
    {
        name: 'Users',
        isActive: false,
        subModules: [
            /*{
                name: 'Owners',
                privileges: [
                    { name: 'read', isActive: false },
                    { name: 'write', isActive: false },
                    { name: 'update', isActive: false },
                    { name: 'delete', isActive: false }
                ]
            },*/
            // {
            //     name: 'Sub_Admins',
            //     privileges: [
            //         { name: 'read', isActive: false },
            //         { name: 'write', isActive: false },
            //         { name: 'update', isActive: false },
            //         { name: 'delete', isActive: false }
            //     ]
            // },
            {
                name: 'Tenants',
                privileges: [
                    { name: 'read', isActive: false },
                    { name: 'write', isActive: false },
                    { name: 'update', isActive: false },
                    { name: 'delete', isActive: false }
                ]
            },
            // {
            //     name: 'Admins',
            //     privileges: [
            //         { name: 'read', isActive: false },
            //         { name: 'write', isActive: false },
            //         { name: 'update', isActive: false },
            //         { name: 'delete', isActive: false }
            //     ]
            // }
        ]
    },
    {
        name: 'Management',
        isActive: false,
        subModules: [
            {
                name: 'Tenant_Requests',
                privileges: [
                    { name: 'read', isActive: false },
                    { name: 'write', isActive: false },
                    { name: 'update', isActive: false },
                    { name: 'delete', isActive: false }
                ]
            },
            {
                name: 'Leases',
                privileges: [
                    { name: 'read', isActive: false },
                    { name: 'write', isActive: false },
                    { name: 'update', isActive: false },
                    { name: 'delete', isActive: false }
                ]
            },
            {
                name: 'Units',
                privileges: [
                    { name: 'read', isActive: false },
                    { name: 'write', isActive: false },
                    { name: 'update', isActive: false },
                    { name: 'delete', isActive: false }
                ]
            },
            {
                name: 'Buildings',
                privileges: [
                    { name: 'read', isActive: false },
                    { name: 'write', isActive: false },
                    { name: 'update', isActive: false },
                    { name: 'delete', isActive: false }
                ]
            },
            {
                title:'Unit Types',
                name: 'Unit_Types',
                privileges: [
                    { name: 'read', isActive: false },
                    { name: 'write', isActive: false },
                    { name: 'update', isActive: false },
                    { name: 'delete', isActive: false }
                ]
            }
        ]
    },
    {
        name: 'Income_and_Expenses',
        isActive: false,
        subModules: [
            {
                name: 'Discounts',
                privileges: [
                    { name: 'read', isActive: false },
                    { name: 'write', isActive: false },
                    { name: 'update', isActive: false },
                    { name: 'delete', isActive: false }
                ]
            },
            {
                name: 'Gratuities',
                privileges: [
                    { name: 'read', isActive: false },
                    { name: 'write', isActive: false },
                    { name: 'update', isActive: false },
                    { name: 'delete', isActive: false }
                ]
            },
            {
                name: 'Radiations',
                privileges: [
                    { name: 'read', isActive: false },
                    { name: 'write', isActive: false },
                    { name: 'update', isActive: false },
                    { name: 'delete', isActive: false }
                ]
            },
            {
                name: 'Suppliers',
                privileges: [
                    { name: 'read', isActive: false },
                    { name: 'write', isActive: false },
                    { name: 'update', isActive: false },
                    { name: 'delete', isActive: false }
                ]
            },
            {
                name: 'Billings',
                privileges: [
                    { name: 'read', isActive: false },
                    { name: 'write', isActive: false },
                    { name: 'update', isActive: false },
                    { name: 'delete', isActive: false }
                ]
            },
            {
                name: 'Open_AR',
                privileges: [
                    { name: 'read', isActive: false },
                    { name: 'write', isActive: false },
                    { name: 'update', isActive: false },
                    { name: 'delete', isActive: false }
                ]
            },
            {
                name: 'Expenses',
                privileges: [
                    { name: 'read', isActive: false },
                    { name: 'write', isActive: false },
                    { name: 'update', isActive: false },
                    { name: 'delete', isActive: false }
                ]
            },
            {
                name: 'Encasements',
                privileges: [
                    { name: 'read', isActive: false },
                    { name: 'write', isActive: false },
                    { name: 'update', isActive: false },
                    { name: 'delete', isActive: false }
                ]
            },
            {
                name: 'Vacants',
                privileges: [
                    { name: 'read', isActive: false },
                    { name: 'write', isActive: false },
                    { name: 'update', isActive: false },
                    { name: 'delete', isActive: false }
                ]
            },
            {
                name: 'Open_AP',
                privileges: [
                    { name: 'read', isActive: false },
                    { name: 'write', isActive: false },
                    { name: 'update', isActive: false },
                    { name: 'delete', isActive: false }
                ]
            }
        ]
    },
    {
        name: 'Settings',
        isActive: false,
        subModules: [
            {
                name: 'Inclusions',
                privileges: [
                    { name: 'read', isActive: false },
                    { name: 'write', isActive: false },
                    { name: 'update', isActive: false },
                    { name: 'delete', isActive: false }
                ]
            },
            {
                name: 'Services',
                privileges: [
                    { name: 'read', isActive: false },
                    { name: 'write', isActive: false },
                    { name: 'update', isActive: false },
                    { name: 'delete', isActive: false }
                ]
            },
            {
                name: 'Payment_Methods',
                privileges: [
                    { name: 'read', isActive: false },
                    { name: 'write', isActive: false },
                    { name: 'update', isActive: false },
                    { name: 'delete', isActive: false }
                ]
            },
            {
                name: 'Bank_Accounts',
                privileges: [
                    { name: 'read', isActive: false },
                    { name: 'write', isActive: false },
                    { name: 'update', isActive: false },
                    { name: 'delete', isActive: false }
                ]
            },
            {
                name: 'Type_Of_Expenses',
                privileges: [
                    { name: 'read', isActive: false },
                    { name: 'write', isActive: false },
                    { name: 'update', isActive: false },
                    { name: 'delete', isActive: false }
                ]
            }
        ]
    }
];
