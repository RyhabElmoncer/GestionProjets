import { CommonModule, CurrencyPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslocoModule } from '@jsverse/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { UserService } from '../../../../shared/services/user/user.service';
import {User} from "../../../../shared/services/authauthentication/user.model";

@Component({
    selector: 'project',
    templateUrl: './project.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        TranslocoModule,
        MatIconModule,
        MatButtonModule,
        MatRippleModule,
        MatMenuModule,
        MatTabsModule,
        MatButtonToggleModule,
        NgApexchartsModule,
        MatTableModule,
        NgClass,
        CurrencyPipe,
    ],
    standalone: true
})
export class ProjectComponent implements OnInit {
    /**
     * Constructor
     */
    constructor(
        private userService: UserService,

    )
    {}
    user: User;
    users: any;
    totalUsers = 0;
    totalTenant = 0;
    totalOwner = 0;
    totalProperty = 0;
    totalUnit = 0;
    totalLease = 0;
    totalReclamation = 0;
    totalRequest = 0;
    isOwner = false;
    isAdmin = false;
    isSubAdmin = false;
    /**
     * On init
     */
    ngOnInit(): void
    {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        this.user = currentUser;
        if (currentUser && currentUser.role) {
            const role = currentUser.role;
            if(role === "ADMIN") {
                this.isAdmin= true;
                this.userService.getUserCount().subscribe({
                    next: (data) => {
                        this.totalUsers = data.userCount;
                    },
                    error: (err) => {
                        console.error('Erreur lors de la récupération du nombre d’utilisateurs', err);
                    }
                });
                this.userService.getUserCountByRole('OWNER').subscribe({
                    next: (data) => {
                        this.totalOwner = data.userCount;
                    },
                    error: (err) => {
                        console.error('Erreur lors de la récupération des propriétaires', err);
                    }
                });
                this.userService.getUserCountByRole('TENANT').subscribe({
                    next: (data) => {
                        this.totalTenant = data.userCount;
                    },
                    error: (err) => {
                        console.error('Erreur lors de la récupération des locataires', err);
                    }
                });
            }
            if(role === "SUB_ADMIN") {
                this.isSubAdmin= true;
            }
            else if (role === "OWNER"){
                this.isOwner= true;
        }
        }
        else {
            console.log('Role not found');
            //this._router.navigate(['/sign-out']);
        }
        this.userService.getAllUsers().subscribe(res => {
            this.users =  res;
            console.log("all users", this.users)
        });

    }

}
