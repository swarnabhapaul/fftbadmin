import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { User } from "../_models/index";

@Injectable()
export class UserService {
    constructor(private http: Http) {
    }

    readonly BACKEND_URL = "http://api.fftb.co.uk";
    // readonly BACKEND_URL = "http://localhost:3000";

    verify() {
        return this.http.get(this.BACKEND_URL + '/users/verify-token', this.jwt()).map((response: Response) => response.json());
    }

    verifyEmail(token: string) {
        return this.http.get(this.BACKEND_URL + '/users/verify-email/' + token, this.jwt()).map((response: Response) => response.json());
    }

    forgotPassword(email: string) {
        return this.http.post(this.BACKEND_URL + '/users/forgot-password', JSON.stringify({ email }), this.jwt()).map((response: Response) => response.json());
    }

    saveCard(creditCard: Object) {
        return this.http.put(this.BACKEND_URL + '/users/card', JSON.stringify(creditCard), this.jwt()).map((response: Response) => response.json());
    }

    getLoginUser() {
        return this.http.get(this.BACKEND_URL + '/users', this.jwt()).map((response: Response) => response.json());
    }

    // register brewery user
    signupBrewery(user: User) {
        return this.http.post(this.BACKEND_URL + '/users/brewery', user, this.jwt()).map((response: Response) => response.json());
    }

    update(user) {
        return this.http.put(this.BACKEND_URL + '/users', user, this.jwt()).map((response: Response) => response.json());
    }

    changeLoginUserEmail(email: String, password: String) {
        return this.http.put(this.BACKEND_URL + '/users/change-email', { email: email, password: password }, this.jwt()).map((response: Response) => response.json());
    }

    changeLoginUserPassword(oldPassword: String, password: String) {
        return this.http.put(this.BACKEND_URL + '/users/change-password', { oldPassword: oldPassword, password: password }, this.jwt()).map((response: Response) => response.json());
    }

    // delete(id: number) {
    //     return this.http.delete('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    // }

    completeRegistration(registration: Object) {
        return this.http.put(this.BACKEND_URL + '/users/complete-registration', registration, this.jwt()).map((response: Response) => response.json());
    }

    resetPassword(token: string, password: string) {
        return this.http.put(this.BACKEND_URL + '/users/reset-password/' + token, JSON.stringify({ password: password }), this.jwt()).map((response: Response) => response.json());
    }

    verifyEmailRequest() {
        return this.http.get(this.BACKEND_URL + '/users/verify-email', this.jwt()).map((response: Response) => response.json());
    }

    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.access_token) {
            let headers = new Headers({ 'Authorization': currentUser.token_type + ' ' + currentUser.access_token, 'Content-Type': 'application/json' });
            return new RequestOptions({ headers: headers });
        } else {
            let headers = new Headers({ 'Content-Type': 'application/json' });
            return new RequestOptions({ headers: headers });
        }
    }
}