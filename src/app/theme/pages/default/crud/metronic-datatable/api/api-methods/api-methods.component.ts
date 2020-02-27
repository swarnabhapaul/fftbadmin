import { Component, OnInit, ViewEncapsulation, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Helpers } from '../../../../../../../helpers';
import { BreweryService } from '../../../../../../../services/brewery.service';
import { AlertComponent } from '../../../../../../../auth/_directives/alert.component';
import { AlertService } from '../../../../../../../auth/_services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var $: any;

@Component({
    selector: "app-api-methods",
    templateUrl: "./api-methods.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class ApiMethodsComponent implements OnInit {

    @ViewChild('alertAssociateInvitation',
        { read: ViewContainerRef }) alertAssociateInvitation: ViewContainerRef;

    private breweryDetail: any;
    private breweryManagers: any;
    private breweryId: number = null;

    constructor(
        private _brewery: BreweryService,
        private cfr: ComponentFactoryResolver,
        private _alertService: AlertService,
        private _route: ActivatedRoute,
        private _router: Router
    ) { }

    ngOnInit() {
        this.breweryId = this._route.snapshot.params['breweryId'] || null;
        // get brewery detail
        this.getBrewery();
        this.getManagers();
    }

    private model: any = {
        email: null
    };

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    getBrewery() {
        Helpers.setLoading(true)
        this._brewery.get(this.breweryId).subscribe(data => {
            // set brewery information
            this.breweryDetail = data.data;
            Helpers.setLoading(false)
        }, error => {
            Helpers.setLoading(false)
        })
    }

    getManagers() {
        Helpers.setLoading(true)
        this._brewery.getManagers(this.breweryId).subscribe(data => {
            // set brewery information
            this.breweryManagers = data.data;
            Helpers.setLoading(false)
        }, error => {
            Helpers.setLoading(false)
        })
    }

    /**
     * Method to send invitation
     * 
     * @param string email
     */
    sendInvitation(email: string) {
        Helpers.setLoading(true)
        this._brewery.sendInvitation(email, this.breweryId).subscribe(data => {
            Helpers.setLoading(false)
            this.showAlert('alertAssociateInvitation');
            this._alertService.success(data.message, true);

            this.getManagers()
        }, error => {
            Helpers.setLoading(false)
            this.showAlert('alertAssociateInvitation');
            this._alertService.error(JSON.stringify(JSON.parse(error._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
        })
    }


    removeInvitation(email: string) {
        Helpers.setLoading(true)
        this._brewery.removeInvitation(email, this.breweryId).subscribe(data => {
            Helpers.setLoading(false)
            this.showAlert('alertAssociateInvitation');
            this._alertService.success(data.message, true);

            this.getManagers()
        }, error => {
            Helpers.setLoading(false);
            this.showAlert('alertAssociateInvitation');
            this._alertService.error(JSON.stringify(JSON.parse(error._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
        })
    }

    /**
     * Method to add new associate into brewery
     */
    submitAssociateAccount() {
        let from = $('#new_associate_form');
        from.validate({
            rules: {
                email: {
                    required: true,
                    email: true,
                    maxlength: 255
                }
            }
        });

        if (!from.valid()) {
            return;
        }
        $('#m_modal_5').modal('hide');
        let email = this.model.email;
        this.model.email = null;
        this.sendInvitation(email);
    }

    displayDeleteAccount() {
        // display delete account either brewery-admin or admin
        let userDetail = (JSON.parse(localStorage.userDetail));
        if (userDetail.role === 'admin' || (userDetail.role === 'brewery' && userDetail.manager.admin)) {
            return true;
        }

        return false;
    }

    dosplayByRole(role: string): boolean {
        return (JSON.parse(localStorage.userDetail)).role === role;
    }

    deleteBrewery() {
        Helpers.setLoading(true)

        this._brewery.deleteBreweryByAdmin(this.breweryId).subscribe(data => {
            Helpers.setLoading(false)
            this.showAlert('alertAssociateInvitation');
            this._alertService.success(data.message, true);

            // redirect user to breweries
            this._router.navigate(['/admin/breweries']);
        }, err => {
            Helpers.setLoading(false)
            this.showAlert('alertAssociateInvitation');
            this._alertService.error(JSON.stringify(JSON.parse(err._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
        });
    }
}