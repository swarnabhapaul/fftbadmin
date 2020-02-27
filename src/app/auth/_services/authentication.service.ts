import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import "rxjs/add/operator/map";

@Injectable()
export class AuthenticationService {

    readonly BACKEND_URL = "http://api.fftb.co.uk";
    // readonly BACKEND_URL = "http://localhost:3000";
    readonly CLIENT_ID = 2;
    readonly CLIENT_SECRET = 'gAV9mQiP60cnrZT0UKX9F9R0deY4wd8ZRtg8435H';
    readonly GRANT_TYPE = 'password';

    constructor(private http: Http) { }

    login(role: string,email: string, password: string) {

        let url = this.BACKEND_URL + "/users/login";

        let values = {
            role: role,
            username: email,
            password: password,
            client_secret: this.CLIENT_SECRET,
            client_id: this.CLIENT_ID,
            grant_type: this.GRANT_TYPE
        };

        let headers: Headers = new Headers({ 'content-type': 'application/json' });

        return this.http.post(url, JSON.stringify(values), { headers: headers })
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.status && user.data.access_token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user.data));
                }
            });
    }

    logout() {
        // logout the user from server
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        let headers = new Headers({ 'Authorization': currentUser.token_type + ' ' + currentUser.access_token });

        return this.http.delete(
            this.BACKEND_URL + '/users/logout',
            { headers: headers }
        ).map((response: Response) => response.json());
    }
}