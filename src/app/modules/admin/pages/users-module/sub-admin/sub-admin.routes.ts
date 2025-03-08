import { Routes } from '@angular/router';
import {ListSubAdminComponent} from "./list-sub-admin/list-sub-admin.component";
import {CreateSubAdminComponent} from "./create-sub-admin/create-sub-admin.component";
import {EditSubAdminComponent} from "./edit-sub-admin/edit-sub-admin.component";
export default [
    {
        path: '',
        children: [
            {
                path: '',
                component: ListSubAdminComponent,
                data: {
                    defaultSort: 'activated,asc',
                },
            },
            {
                path: 'create-sub-admin',
                component: CreateSubAdminComponent,
            }
            ,
            {
                path: 'edit-sub-admin',
                component: EditSubAdminComponent,
            }


        ],
    },
] as Routes;
