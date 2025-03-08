import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import {AuthenticationService} from "../../../shared/services/authauthentication/authauthentication.service";

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    imports: [
        RouterLink,
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
    ],
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;
     errorMessage = "";

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private authService: AuthenticationService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email     : ['', [Validators.required, Validators.email]],
            password  : ['', Validators.required],
            rememberMe: [!!localStorage.getItem('rememberedEmail')]
        });
        const token = this._authService.accessToken;
        console.log("token", token)
        //this.getCurrentUser("af4b150c-a37e-4522-b24b-77c6a21fcd42");
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {

        if (this.signInForm.invalid) {
            return;
        }
        this.signInForm.disable();
        this.showAlert = false;
        const { email, password, rememberMe } = this.signInForm.value;

        this._authService.authenticate(email, password).subscribe(
            (response) => {
                console.log('Authentication successful:', response);

                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }
                const token = this._authService.accessToken;

                if (token) {
                    console.log('User UUID:', this.authService.getClaim(token, 'uuid'));
                    this.getCurrentUser(this.authService.getClaim(token, 'uuid'));
                }
                const redirectURL =
                    this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/dashboard';
                this._router.navigateByUrl(redirectURL);
            },
            (error) => {
                this.signInForm.enable();

                if (this.signInNgForm) {
                    this.signInNgForm.resetForm();
                }
                this.alert = {
                    type: 'error',
                    message: error.error?.message || 'Invalid email or password',
                };

                // Afficher l'alerte
                this.showAlert = true;
            }
        );
    }
    getCurrentUser(id: string): void {
        this.errorMessage = null; // Réinitialise les erreurs
        this.authService.getUserById(id).subscribe(
            (response) => {
                console.log("response", response)
                localStorage.setItem('currentUser', JSON.stringify(response));
                console.log('currentUser',localStorage.getItem('currentUser'))
            },
            (error) => {
                console.error('Error fetching user data', error);
                this.errorMessage =
                    'Could not fetch user data. Please try again later.';
            }
        );
    }


}
