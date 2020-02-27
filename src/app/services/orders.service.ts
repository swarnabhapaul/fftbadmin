import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from "@angular/http";

@Injectable()
export class OrdersService {

    constructor(private _http: Http) { }

    readonly BACKEND_URL = "http://api.fftb.co.uk";

    // get brewery detail
    get(page: number = 1, paginate: number = 6) {
        let url = new URL(this.BACKEND_URL + '/orders');
        url.searchParams.append('page', page.toString());
        url.searchParams.append('paginate', paginate.toString());

        return this._http.get(url.href, this.jwt()).map((response: Response) => response.json());
    }

    orderCount() {
        return this._http.get(this.BACKEND_URL + '/orders/count', this.jwt()).map((response: Response) => response.json());
    }

    // fetch order detail
    view(orderUUID: string) {
        return this._http.get(this.BACKEND_URL + '/orders/' + orderUUID, this.jwt()).map((response: Response) => response.json());
    }

    // get brewery orders
    getBreweryOrders(page: number, paginate: number) {

        let url = new URL(this.BACKEND_URL + '/orders/brewery');
        url.searchParams.append('page', page.toString());
        url.searchParams.append('paginate', paginate.toString());

        return this._http.get(url.href, this.jwt()).map((response: Response) => response.json());
    }

    getBreweryOrdersbyDate(from: any, page: number, paginate: number) {

        let url = new URL(this.BACKEND_URL + '/search-order');
        url.searchParams.append('page', page.toString());
        url.searchParams.append('paginate', paginate.toString());
        // return this._http.post(url.href, from).map((response: Response) => response.json());
        return this._http.post(url.href, from, this.jwt()).map((response: Response) => response.json());
    }

    // get brewery payments
    getBreweryPayments(page: number, paginate: number) {
        let url = new URL(this.BACKEND_URL + '/orders/payments');
        url.searchParams.append('page', page.toString());
        url.searchParams.append('paginate', paginate.toString());

        return this._http.get(url.href, this.jwt()).map((response: Response) => response.json());
    }

    fullfillOrder(orderUUID: string, status: string) {
        return this._http.put(this.BACKEND_URL + '/orders/' + orderUUID, JSON.stringify({ status: status }), this.jwt()).map((response: Response) => response.json());
    }

    private jwt(): RequestOptions {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let headers = new Headers({ 'Authorization': currentUser.token_type + ' ' + currentUser.access_token, 'Content-Type': 'application/json' });
        return new RequestOptions({ headers: headers });
    }
}
