import { Routes } from '@angular/router';
import {ListPropertysComponent} from "./list-propertys/list-propertys.component";
import {CreatePropertyComponent} from "./create-property/create-property.component";
import {UpdatePropertyComponent} from "./update-property/update-property.component";
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
