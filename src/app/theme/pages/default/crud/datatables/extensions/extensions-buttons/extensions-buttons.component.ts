import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { Helpers } from '../../../../../../../helpers';
import { AlertService } from '../../../../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../../../../auth/_directives/alert.component';
import { BreweryService } from '../../../../../../../services/brewery.service';
import { AdminService } from '../../../../../../../services/admin.service';
import { CommonService } from '../../../../../../../services/common.service';
import { ActivatedRoute } from '@angular/router';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';

@Component({
    selector: "app-extensions-buttons",
    templateUrl: "./extensions-buttons.component.html",
    styles: [`
    .show {
        display:block;
    } 
    .hide{
        display:none;
    }
  `],
    encapsulation: ViewEncapsulation.None,
})
export class ExtensionsButtonsComponent implements OnInit, AfterViewInit {

    loading = false;

    readonly MIN_FILE_SIZE_IN_BYTE: number = 1024;
    readonly MAX_FILE_SIZE_IN_BYTE: number = 102400;
    readonly ALLOW_FILE_EXT: Array<String> = ['jpg', 'jpeg', 'png'];
    $: any;

    readonly IMG_DIR: string = 'product';
    productLogo: string;

    productId: number;

    productInfo: any;

    lists: any;

    breweryId: any;
    breweryName: any;
    localstorage: any;
    flag: any;
    flag2: any;



    @ViewChild('alertProduct',
        { read: ViewContainerRef }) alertProduct: ViewContainerRef;

    @ViewChild('alertImage',
        { read: ViewContainerRef }) alertImage: ViewContainerRef;

    constructor(
        private _brewery: BreweryService,
        private _admin: AdminService,
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver,
        private common: CommonService,
        private _route: ActivatedRoute,
        private http: Http,
    ) { }

    ngOnInit() {
        this.getlists();

        this.localstorage = JSON.parse(localStorage.getItem("userDetail"));
        console.log(this.localstorage.brewery);
        this.breweryId = this.localstorage.brewery.id;
        this.breweryName = this.localstorage.brewery.subdomain;
        if (this.breweryId == null || this.breweryId == undefined || this.breweryId == "" || this.breweryId.lenght == 0) {
            this.flag = 'hide';
            this.flag2 = 'show';
            //this.model.brewery_id = this.productInfo.brewery_id;
        } else {

            this.model.brewery_id = this.breweryId;
            this.flag = 'show';
            this.flag2 = 'hide';
        }
        console.log(this.breweryId)
    }

    // onChange(deviceValue) {
    //     alert(deviceValue);
    // }



    getlists() {
        let url = "http://api.fftb.co.uk/get-brewery";
        let search = new URLSearchParams();
        this.http.get(url, {}).subscribe(
            res => {
                this.lists = res.json().data;
            }
        );
    }

    ngAfterViewInit() {
        this.productId = this._route.snapshot.params.productId;

        if (this.productId) {
            this.getProductById(this.productId);
        }

        //this.validateProduct();
    }

    getProductById(productId: number) {
        this._brewery.getProductById(productId).subscribe(data => {

            console.log("=======++++++++++===========================>",data);
            this.productInfo = data.data;
            this.updateModel();
        })
    }

    updateModel() {
        this.model.name = this.productInfo.name;
        this.model.price = this.productInfo.price;
        this.model.description = this.productInfo.description;
        this.productLogo = this.productInfo.picture;
        this.model.currentStock = this.productInfo.stock;
        this.model.type = this.productInfo.type;
        this.model.show_on_page = this.productInfo.show_on_page;
        this.model.alcohol_content = this.productInfo.alcohol_content;
        this.model.size = this.productInfo.size;
        this.model.other_info = this.productInfo.other_info;
        //this.model.brewery_id = this.productInfo.brewery_id;
    }

    model: any = {
        name: null,
        brewery_id: null,
        type: null,
        alcohol_content: null,
        other_info: null,
        size: null,
        price: null,
        image: null,
        description: null,
        show_on_page:null,
        currentStock: 0,
        change: null,
        isIncrease: null,
        status:null,
    };

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
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

                this.productLogo = e.target.result;
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

    /*validateProduct() {
        //document.getElementById('m_button_product_submit').addEventListener('click', e => {
            let form = $(".xyz").closest('form');

            form.validate({
                rules: {
                    brewery_id: {
                        required: true
                    },
                    name: {
                        required: true,
                        maxlength: 100
                    },
                    price: {
                        required: true,
                        maxlength: 10,
                        pattern: /^\$?\d+(,\d{3})*(\.\d*)?$/
                    },
                    image: {
                        required: false,
                        maxlength: 255
                    },
                    description: {
                        required: true,
                        maxlength: 1000
                    },
                    currentStock: {
                        required: true,
                        pattern: /^[\d]*$/
                    },
                    type: {
                        required: true,
                        maxlength: 100
                    },
                    alcohol_content: {
                        required: true,
                        maxlength: 100
                    },
                    size: {
                        required: true,
                        maxlength: 100
                    },
                    other_info: {
                        required: true,
                        maxlength: 100
                    },
                }, messages: {
                    price: {
                        pattern: 'Price must be in money format. ex: 23.00'
                    }
                }
            })

            if (!form.valid()) {
                //e.preventDefault();
                return false;
            }

            this.submitProduct123();
            alert('aaaaaaaaaaa');
        //});
    }*/

    submitProduct() {
        // check for the stock updated
        this.updateStock(this.model.currentStock);

        this.loading = true;

        let values = this.model;

        Object.keys(values).forEach((key) => (values[key] == null) && delete values[key]);

        let product = null;

        console.log(values);


        // check for new product
        if (this.productId) {
            product = this._brewery.updateProduct(this.productId, values);
        } else {
            product = this._admin.saveProduct(values);
        }

        product.subscribe(
            data => {
                this.loading = false;
                this.showAlert('alertProduct');
                this._alertService.success(data.message, true);
                console.log('---------------', data);
                // check for new product
                if (data.data.productId) {
                    this.productId = data.data.productId;
                }

                this.getProductById(this.productId)
            },
            error => {
                this.loading = false;
                this.showAlert('alertProduct');
                this._alertService.error(JSON.stringify(JSON.parse(error._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
            }
        );
    }

    /**
     * Method to manage stock on current-stock field update
     * @param event 
     */
    updateStock(stock: number) {

        // set stock update type
        this.model.isIncrease = true;
        this.model.change = stock;

        // check if product is for update
        if (this.productId) {
            // check of the difference
            this.model.isIncrease = stock > this.productInfo.stock;
            this.model.change = Math.abs(this.productInfo.stock - stock);
        }
    }

}