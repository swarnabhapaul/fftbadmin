import { Injectable } from '@angular/core';

import { Http, Response, RequestOptions, Headers } from "@angular/http";

@Injectable()
export class AdminService {

    constructor(private http: Http) { }

    readonly BACKEND_URL = "http://api.fftb.co.uk";

    listProducts(page:number, paginate:number) {
        let url = new URL (this.BACKEND_URL + '/brewery/products');
        url.searchParams.append ('page', page.toString());
        url.searchParams.append ('paginate', paginate.toString());
        return this.http.get (url.href).map((response: Response) => response.json());
    }

    saveProduct(values: Object) {
        return this.http.post(this.BACKEND_URL + '/add-product', JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }

    


    // ===================== Banner ==============================
    addMainBanner(values: Object) {
        return this.http.post(this.BACKEND_URL + '/insert-mainsite-banner', JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }

    getMainBannerById(bannerId: number) {
        return this.http.get(this.BACKEND_URL + '/get-mainsite-banner-by-id/' + bannerId, this.jwt()).map((response: Response) => response.json());
    }

    getMainBannerDetails() {
        return this.http.get(this.BACKEND_URL + '/get-mainsite-banner', this.jwt()).map((response: Response) => response.json());
    }

    updateMainBanner(values: Object) {
        return this.http.post(this.BACKEND_URL + '/update-mainsite-banner' , JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }

    updateMainBannerStatus(bId: number) {
        return this.http.get(this.BACKEND_URL + '/update-mainsite-banner-status/' + bId, this.jwt()).map((response: Response) => response.json());
    }


    deleteMainBannerById(bId: number) {
        return this.http.get(this.BACKEND_URL + '/delete-mainsite-banner-by-id/' + bId, this.jwt()).map((response: Response) => response.json());
    }

    // ===================== Why Choose ==============================
    addWhyChoose(values: Object) {
        return this.http.post(this.BACKEND_URL + '/insert-mainsite-whychoose', JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }

    getWhyChooseById(Id: number) {
        return this.http.get(this.BACKEND_URL + '/get-mainsite-whychoose-by-id/' + Id, this.jwt()).map((response: Response) => response.json());
    }

    getWhyChooseDetails() {
        return this.http.get(this.BACKEND_URL + '/get-mainsite-whychoose', this.jwt()).map((response: Response) => response.json());
    }

    updateWhyChoose(values: Object) {
        return this.http.post(this.BACKEND_URL + '/update-mainsite-whychoose' , JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }


    deleteWhyChooseById(bId: number) {
        return this.http.get(this.BACKEND_URL + '/delete-mainsite-whychoose-by-id/' + bId, this.jwt()).map((response: Response) => response.json());
    }

    private jwt(body: Object = null): RequestOptions {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let headers = new Headers({ 'Authorization': currentUser.token_type + ' ' + currentUser.access_token, 'Content-Type': 'application/json' });
        return new RequestOptions({ headers: headers, body: body });
    }

}
