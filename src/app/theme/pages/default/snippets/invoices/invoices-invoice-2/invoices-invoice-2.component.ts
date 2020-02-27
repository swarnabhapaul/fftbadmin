import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Helpers } from '../../../../../../helpers';
import { OrdersService } from '../../../../../../services/orders.service';
import { ActivatedRoute } from '@angular/router';
import { AlertComponent } from '../../../../../../auth/_directives/alert.component';
import { AlertService } from '../../../../../../auth/_services/alert.service';

@Component({
    selector: "app-invoices-invoice-2",
    templateUrl: "./invoices-invoice-2.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [OrdersService]
})
export class InvoicesInvoice2Component implements OnInit, AfterViewInit {

    @ViewChild('alertOrderDetail',
        { read: ViewContainerRef }) alertOrderDetail: ViewContainerRef;

    private orderDetail: any;
    private billingAddress: any;
    readonly FULLFILL_ORDER_STATUS: string = 'fulfilled';

    constructor(
        private _order: OrdersService,
        private _route: ActivatedRoute,
        private cfr: ComponentFactoryResolver,
        private _alertService: AlertService,
    ) { }

    ngOnInit() { }

    ngAfterViewInit() {
        // fetch order information
        this.viewOrder(this._route.snapshot.params['orderUUID']);
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    // fetch order-uuid Information
    viewOrder(orderUUID: string) {
        this._order.view(orderUUID).subscribe(data => {
            this.orderDetail = data.data;
            // check if billing address exists
            for (let address of this.orderDetail.customer.address) {
                // set current address as billing address
                this.billingAddress = address;

                // check if billing address already exists
                if (address.type === 'billing') {
                    // break the look
                    break;
                }
            }
        }, error => {
            this.showAlert('alertOrderDetail');
            this._alertService.error(JSON.stringify(JSON.parse(error._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
        })
    }

    /**
     * Calculate total order price
     */
    calculateTotalOrderPrice(shippingCharge: string, orderItems: Array<any>): number {
        let charge = 0;

        // check if orderItems not empty
        if (orderItems && orderItems.length) {
            charge = parseFloat(shippingCharge)

            // sum each product price
            for (let item of orderItems) {
                charge += parseFloat(item.price) * parseInt(item.quantity);
            }
        }

        return charge;
    }

    displayOrderUUID(orderUUID: string): string {
        return orderUUID ? orderUUID.substr(-5) : null;
    }

    fullfillOrder(orderUUID: string) {
        Helpers.setLoading(true);
        this._order.fullfillOrder(orderUUID, this.FULLFILL_ORDER_STATUS).subscribe(data => {
            Helpers.setLoading(false);
            this.showAlert('alertOrderDetail');
            this._alertService.success(data.message);
            this.viewOrder(orderUUID);
        }, err => {
            Helpers.setLoading(false);
            this.showAlert('alertOrderDetail');
            this._alertService.error(JSON.stringify(JSON.parse(err._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
        })
    }

    displaytn() {
        if (this.orderDetail && this.orderDetail['status'] && ['admin', 'brewery'].includes((JSON.parse(localStorage.userDetail)).role)) {
            return true;
        }
        return false;
    }
}