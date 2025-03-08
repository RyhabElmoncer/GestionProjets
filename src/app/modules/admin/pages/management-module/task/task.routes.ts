import { Routes } from '@angular/router';
import {ListPropertysComponent} from "./list-task/list-propertys.component";
import {CreatePropertyComponent} from "./create-task/create-property.component";
import {UpdatePropertyComponent} from "./update-task/update-property.component";
export default [
    {
        path: '',
        children: [
            {
                path: '',
                component: ListPropertysComponent,
                data: {
                    defaultSort: 'activated,asc',
                }
            },
            {
                path: 'create-property',
                component: CreatePropertyComponent,
            }
            ,
            {
                path: 'update-property',
                component: UpdatePropertyComponent,
            }


        ],
    },
] as Routes;
