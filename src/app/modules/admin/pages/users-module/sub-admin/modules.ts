// modules.ts
export const modules = [
    {
        name: 'Users',
        isActive: false,
        subModules: [
            {
                name: 'Owners',
                privileges: [
                    { name: 'read', isActive: false },
                    { name: 'write', isActive: false },
                    { name: 'update', isActive: false },
                    { name: 'delete', isActive: false }
                ]
            },



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
