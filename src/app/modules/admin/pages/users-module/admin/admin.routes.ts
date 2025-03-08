import { Routes } from '@angular/router';
import {ListAdminComponent} from "./list-admin/list-admin.component";
import {CreateAdminComponent} from "./create-admin/create-admin.component";
import {EditAdminComponent} from "./edit-admin/edit-admin.component";
export default [
    {
        path: '',
        children: [
            {
                path: '',
                component: ListAdminComponent,
                data: {
                    defaultSort: 'activated,asc',
                }
            },
            {
                path: 'create-admin',
                component: CreateAdminComponent,
            }
            ,
            {
                path: 'edit-admin',
                component: EditAdminComponent,
            }

        ],
    },
] as Routes;
