import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "../_services/authentication.service";
import { Helpers } from "../../helpers";

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class LogoutComponent implements OnInit {

    constructor(private _router: Router,
        private _authService: AuthenticationService) {
    }

    ngOnInit(): void {
        Helpers.setLoading(true);
        // reset login status
        this._authService.logout().subscribe(data => {
            Helpers.setLoading(false);

            localStorage.removeItem('userDetail');
            // remove user from local storage to log user out
            localStorage.removeItem('currentUser');

            // redirect to login page
            this._router.navigate(['/login']);
        }, err => {
            Helpers.setLoading(false);

            localStorage.removeItem('userDetail');
            // remove user from local storage to log user out
            localStorage.removeItem('currentUser');

            // redirect to login page
            this._router.navigate(['/login']);
        })

    }
}