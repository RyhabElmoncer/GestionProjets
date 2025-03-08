import { Routes } from '@angular/router';
import {ListUnitsComponent} from "./list-units/list-units.component";
import {CreateUnitComponent} from "./create-unit/create-unit.component";
import {UpdateUnitComponent} from "./update-unit/update-unit.component";
export default [
    {
        path: '',
        children: [
            {
                path: '',
                component: ListUnitsComponent,
                data: {
                    defaultSort: 'activated,asc',
                }
            },
            {
                path: 'create-unit',
                component: CreateUnitComponent,
            },
            {
                path: 'update-unit',
                component: UpdateUnitComponent,
            }

        ],
    },
] as Routes;
