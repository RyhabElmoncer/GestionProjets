import { Routes } from '@angular/router';
import {ListTenantComponent} from "./list-tenant/list-tenant.component";
import {CreateTenantComponent} from "./create-tenant/create-tenant.component";
import {EditTenantComponent} from "./edit-tenant/edit-tenant.component";
export default [
    {
        path: '',
        children: [
            {
                path: '',
                component: ListTenantComponent,
                data: {
                    defaultSort: 'activated,asc',
                },
            },
            {
                path: 'create-tenant',
                component: CreateTenantComponent,
            }
            ,
            {
                path: 'edit-tenant',
                component: EditTenantComponent,
            }


        ],
    },
] as Routes;
