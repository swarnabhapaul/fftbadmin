import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';

import { OrdersService } from '../../../services/orders.service';

declare let mLayout: any;
@Component({
    selector: "app-aside-nav",
    templateUrl: "./aside-nav.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [OrdersService]
})
export class AsideNavComponent implements OnInit, AfterViewInit {

    private orderCount: number = 0;

    constructor(private _order: OrdersService) { }

    private userRole: string;

    ngOnInit() {
        this.userRole = JSON.parse(localStorage.getItem('userDetail')).role
    }

    ngAfterViewInit() {
        mLayout.initAside();
        this.countOrder();
    }

    countOrder() {
        this._order.orderCount().subscribe(data => {
            this.orderCount = data.data.count;
        })
    }

    displayLinkByRole(roles: Array<string>): boolean {
        // check for user role
        return roles.includes(this.userRole)
    }

}