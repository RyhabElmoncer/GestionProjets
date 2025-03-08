import { Routes } from '@angular/router';
import {CreateLeasesComponent} from "./create-leases/create-leases.component";
import {ListLeasesComponent} from "./list-leases/list-leases.component";
export default [
    {
        path: '',
        children: [
            {
                path: '',
                component: ListLeasesComponent,
                data: {
                    defaultSort: 'activated,asc',
                }
            },
            {
                path: 'create-leases',
                component: CreateLeasesComponent,
            }
        ],
    },
] as Routes;
