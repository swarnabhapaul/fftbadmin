import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { OrdersService } from '../../../../../../../services/orders.service';
import { Helpers } from '../../../../../../../helpers';
import { NgForm } from '@angular/forms';

@Component({
    selector: "app-basic-paginations",
    templateUrl: "./basic-paginations.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [OrdersService],
    styleUrls: ['./basic-paginations.component.css']
})
export class BasicPaginationsComponent implements OnInit {

    private breweryOrder: any;
    private currentPage: number;
    private totalItems: number;
    readonly pagination_limit: number = 10;
    model: any = {

        "from_date": null,
        "to_date": null
    }

    isfetched = 0;


    constructor(private _order: OrdersService) { }

    ngOnInit() {


        this.getBreweryOrders();
    }

    getBreweryOrders(page: number = 1) {
        Helpers.setLoading(true);
        this._order.getBreweryOrders(page, this.pagination_limit).subscribe(data => {

            this.breweryOrder = data.data.data;
            this.currentPage = data.data.current_page;
            this.totalItems = data.data.total;

            console.log(this.breweryOrder.length)

            this.isfetched = 1
            Helpers.setLoading(false);
        }, err => {
            Helpers.setLoading(false);
        })
    }


    getOrdersbyDate(f: NgForm) {
        console.log(f.value)
        this.isfetched = 0
        let page: number = 1;
        let form: any = {
            "from_date": f.value.from_date,
            "to_date": f.value.to_date
        };

        Helpers.setLoading(true);
        this._order.getBreweryOrdersbyDate(form, page, this.pagination_limit).subscribe(data => {
            this.breweryOrder = data.data;
            // this.currentPage = data.data.current_page;
            this.totalItems = data.data.length;
            console.log(this.breweryOrder.length)
            this.isfetched = 1
            Helpers.setLoading(false);
        }, err => {
            Helpers.setLoading(false);
        })
    }

    fetchShippingType(shippingCharge: number): string {
        return shippingCharge ? 'standard' : 'free';
    }

    // display only last 8 charachet of order UUID
    getOrderUUID(orderUUID: string): string {
        return orderUUID.substr(-8);
    }
}