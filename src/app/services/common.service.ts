import { Injectable } from '@angular/core';

import { Http, Response } from "@angular/http";

@Injectable()
export class CommonService {

    readonly BACKEND_URL = "http://api.fftb.co.uk";

    constructor(private http: Http) { }

    /**
     * Method to upload avatar
     * 
     * @param Object
     * @param string
     * 
     * @returns Observable
     */
    uploadImg(file: File, directory: string) {
        // design form to upload image
        let form = new FormData();
        form.append('directory', directory);
        // append file
        form.append('image[]', file);

        return this.http.post(this.BACKEND_URL + '/image', form).map((response: Response) => response.json());
    }

}
