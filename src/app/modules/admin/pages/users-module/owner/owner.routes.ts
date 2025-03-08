import { Routes } from '@angular/router';
import {ListOwnerComponent} from "./list-owner/list-owner.component";
import {CreateOwnerComponent} from "./create-owner/create-owner.component";
import {EditOwnerComponent} from "./edit-owner/edit-owner.component";
export default [
    {
        path: '',
        children: [
            {
                path: '',
                component: ListOwnerComponent,
                data: {
                    defaultSort: 'activated,asc',
                },
            },
            {
                path: 'create-owner',
                component: CreateOwnerComponent,
            },
            {
                path: 'edit-owner',
                component: EditOwnerComponent,
            }


        ],
    },
] as Routes;
