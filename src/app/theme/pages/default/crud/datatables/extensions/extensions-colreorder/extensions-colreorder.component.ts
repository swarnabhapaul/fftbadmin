import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { Helpers } from '../../../../../../../helpers';
import { AlertService } from '../../../../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../../../../auth/_directives/alert.component';
import { ActivatedRoute } from '@angular/router';

import { BreweryService } from '../../../../../../../services/brewery.service';
import { CommonService } from '../../../../../../../services/common.service';

@Component({
    selector: "app-extensions-colreorder",
    templateUrl: "./extensions-colreorder.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class ExtensionsColreorderComponent implements OnInit {

    readonly MIN_FILE_SIZE_IN_BYTE: number = 1024;
    readonly MAX_FILE_SIZE_IN_BYTE: number = 102400;
    readonly ALLOW_FILE_EXT: Array<String> = ['jpg', 'jpeg', 'png'];
    $: any;
    private breweryId: number = null;

    readonly IMG_DIR: string = 'brewery';

    breweryLogo: string;

    @ViewChild('alertBrewery',
        { read: ViewContainerRef }) alertBrewery: ViewContainerRef;

    @ViewChild('alertImage',
        { read: ViewContainerRef }) alertImage: ViewContainerRef;

    @ViewChild('alertBreweryAmt',
        { read: ViewContainerRef }) alertBreweryAmt: ViewContainerRef;

    constructor(
        private _brewery: BreweryService,
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver,
        private common: CommonService,
        private _route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.breweryId = this._route.snapshot.params['breweryId'] || null;
        Helpers.setLoading(false)
        this.getBrewery();
        this.validateSubmitBrewery();
    }

    breweryDetail: any;

    model: any = {
        name: null,
        image: null,
        vat: null,
        company: null,
        description: null,
        supportEmail: null,
        supportPhone: null,
        subdomain: null,
        isAddressVisible: null,
        group: {
            facebook: null,
            twitter: null,
            instagram: null
        }
    }

    shippingModel: any = {
        standardShippingAmount: null
    };

    /**
     * Method to get detail of brewery User
     */
    getBrewery() {
        Helpers.setLoading(true)
        this._brewery.get(this.breweryId).subscribe(data => {
            Helpers.setLoading(false)
            this.breweryDetail = data.data;

            // update fields value
            this.updateModel();
        }, err => {
            Helpers.setLoading(false)
        });
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    updateModel() {
        this.model.name = this.breweryDetail.name;
        this.breweryLogo = this.breweryDetail.logo;
        this.model.subdomain = this.breweryDetail.subdomain;

        if (this.breweryDetail.profile) {
            this.model.isAddressVisible = this.breweryDetail.profile.isAddressVisible;
            this.model.vat = this.breweryDetail.profile.vat;
            this.model.company = this.breweryDetail.profile.company;
            this.model.description = this.breweryDetail.profile.description;
            this.model.supportEmail = this.breweryDetail.profile.supportEmail;
            this.model.supportPhone = this.breweryDetail.profile.supportPhone;
            this.shippingModel.standardShippingAmount = this.breweryDetail.profile.standardShippingAmount;
        }

        // check for social fields
        if (this.breweryDetail.social) {
            for (let s in this.breweryDetail.social) {
                this.model.group[this.breweryDetail.social[s].name] = this.breweryDetail.social[s].link;
            }
        }
    }

    /**
     * Method to upload image
     */
    uploadImg(event) {
        const file: File = event.target.files[0];

        // check if file is not empty 
        if (!file || !file.size) {
            return false;
        }

        // check for file size
        if ((file.size < this.MIN_FILE_SIZE_IN_BYTE) && (file.size > this.MAX_FILE_SIZE_IN_BYTE)) {
            this.showAlert('alertImage');
            return this._alertService.error(`Image size must be between ${this.MIN_FILE_SIZE_IN_BYTE / 1024} KB and ${this.MAX_FILE_SIZE_IN_BYTE / 1024} KB`);
        }

        let ext = /(?:\.([^.]+))?$/.exec(file.name)[1];

        // check for file extension
        if (!(this.ALLOW_FILE_EXT).includes(ext)) {
            let allowExt = (this.ALLOW_FILE_EXT).join(', ');
            this.showAlert('alertImage');
            return this._alertService.error(`Allow image extension: ${allowExt}`);
        }

        // check for allow extension
        let reader = new FileReader();
        reader.onload = (e: any) => {
            // show loader
            Helpers.setLoading(true);
            // upload avatar img on server
            this.common.uploadImg(file, this.IMG_DIR).subscribe(data => {
                // hide loader
                Helpers.setLoading(false)

                this.breweryLogo = e.target.result;
                this.model.image = data.data[0];

                // show success notification
                this.showAlert('alertImage');
                this._alertService.success(data.message, true);

            }, error => {
                // hide loader
                Helpers.setLoading(false)
                // show login error
                this.showAlert('alertImage');
                this._alertService.error(JSON.stringify(JSON.parse(error._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
            })
        }
        reader.readAsDataURL(file);
    }

    validateSubmitBrewery() {
        document.getElementById('btn_submit_brewery_update').addEventListener('click', (e) => {
            // manage social
            let form = $(e.target).closest('form');

            form.validate({
                rules: {
                    name: {
                        required: true,
                        maxlength: 100,
                    },
                    image: {
                        required: false,
                        maxlength: 255
                    },
                    vat: {
                        required: true,
                        maxlength: 255,
                    },
                    company: {
                        required: true,
                        maxlength: 255,
                    },
                    supportEmail: {
                        required: true,
                        maxlength: 255,
                        email: true
                    },
                    supportPhone: {
                        required: true,
                        maxlength: 15,
                        pattern: /^[\d]{10,15}/
                    },
                    subdomain: {
                        required: true,
                        maxlength: 50,
                        pattern: /^[a-zA-Z]*$/
                    },
                    'group[facebook]': {
                        required: false,
                        maxlength: 255,
                        pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
                    },
                    'group[twitter]': {
                        required: false,
                        maxlength: 255,
                        pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
                    },
                    'group[instagram]': {
                        required: false,
                        maxlength: 255,
                        pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
                    },
                }, messages: {
                    subdomain: {
                        pattern: 'The field must contain only letters without white-space and special character.'
                    }, supportPhone: {
                        pattern: 'The field must be number upto 10 to 15 digits.'
                    }, 'group[facebook]': {
                        pattern: 'The field must be valid web-URL.'
                    }, 'group[twitter]': {
                        pattern: 'The field must be valid web-URL.'
                    }, 'group[instagram]': {
                        pattern: 'The field must be valid web-URL.'
                    }
                }
            });

            if (!form.valid()) {
                e.preventDefault();
                return;
            }

            this.submitBrewery();
        });

        document.getElementById('m_brewery_shipping_amt_submit').addEventListener('click', (e) => {
            let form = $(e.target).closest('form');

            form.validate({
                rules: {
                    standardShippingAmount: {
                        required: true,
                        pattern: /^\$?\d+(,\d{3})*(\.\d*)?$/
                    },
                    messages: {
                        standardShippingAmount: {
                            pattern: 'The field must be in money format (ex: 2.33).'
                        }
                    }
                }
            })

            if (!form.valid()) {
                e.preventDefault();
                return;
            }

            this.updateBreweryAmt();
        });
    }

    submitBrewery() {
        // update model for social
        let social = this.model.group;
        this.model.social = [];
        for (let s in social) {
            if ((social[s]).trim()) {
                (this.model.social).push({ name: s, link: social[s] });
            }
        }

        let values = this.model;
        

        // remove empty values from object
        Object.keys(values).forEach((key) => (values[key] == null) && delete values[key]);

        // update brewery
        Helpers.setLoading(true);
        console.log('values>>>>>>>>>>>>>>>>>',values)
        this._brewery.update(values, this.breweryId).subscribe(data => {
            Helpers.setLoading(false)

            this.showAlert('alertBrewery');
            this._alertService.success(data.message, true);
        }, error => {
            Helpers.setLoading(false)

            this.showAlert('alertBrewery');
            this._alertService.error(JSON.stringify(JSON.parse(error._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
        });
    }

    updateBreweryAmt() {
        // update brewery
        Helpers.setLoading(true);

        this._brewery.update(this.shippingModel).subscribe(data => {
            Helpers.setLoading(false)
            this.showAlert('alertBreweryAmt');
            this._alertService.success(data.message, true);
        }, error => {
            Helpers.setLoading(false)

            this.showAlert('alertBreweryAmt');
            this._alertService.error(JSON.stringify(JSON.parse(error._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
        });
    }
}