import { Component, OnInit, ViewEncapsulation, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { AlertComponent } from '../../../../../../auth/_directives/alert.component';
import { BreweryService } from '../../../../../../services/brewery.service';
import { AlertService } from '../../../../../../auth/_services/alert.service';
import { AuthenticationService } from '../../../../../../auth/_services/authentication.service';
import { Router } from "@angular/router";
import { Helpers } from '../../../../../../helpers';

@Component({
    selector: "app-timeline-timeline-2",
    templateUrl: "./timeline-timeline-2.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class TimelineTimeline2Component implements OnInit {

    private model: any = {
        password: null
    };

    loading = false;

    constructor(
        private cfr: ComponentFactoryResolver,
        private _alertService: AlertService,
        private _brewery: BreweryService,
        private _auth: AuthenticationService,
        private _router: Router
    ) { }

    @ViewChild('alertBrewery',
        { read: ViewContainerRef }) alertBrewery: ViewContainerRef;

    ngOnInit() {
        this.completeBreweryDelete();
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    completeBreweryDelete() {
        document.getElementById('m_delete_brewery').addEventListener('click', (e) => {
            let form = $(e.target).closest('form');

            form.validate({
                rules: {
                    password: {
                        required: true,
                        maxlength: 20
                    }
                }
            });

            if (!form.valid()) {
                e.preventDefault();
                return;
            }

            this.deleteBrewery();
        });
    }

    deleteBrewery() {
        this.loading = true;
        this._brewery.deleteBrewery(this.model.password).subscribe(data => {

            // check for the user-role
            if (JSON.parse(localStorage.userDetail).role === 'brewery') {
                Helpers.setLoading(true);
                // logout the user
                this._auth.logout().subscribe(data => {
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
            } else if (JSON.parse(localStorage.userDetail).role === 'admin') {
                // to admin return to breweries page
                this._router.navigate(['/admin/breweries']);
            }
        }, err => {
            this.showAlert('alertBrewery');
            this._alertService.error(JSON.stringify(JSON.parse(err._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
            this.loading = false;
        })
    }
}