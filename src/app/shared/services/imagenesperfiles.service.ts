import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "src/environments/environment";

@Injectable()
export class ImagenesPerfilesService {

    constructor(
        private http: HttpClient,
    ) { }

    find(data) {
        let str = Object.entries(data).map(([key, val]) => `${key}=${val}`).join('&');
        return this.http.get(`${ENV.BACKEND}/common/imagenes-perfiles?${str}`).toPromise();
    }

    post(data){
        return this.http.post(`${ENV.BACKEND}/common/imagenes-perfiles`, data).toPromise();
    }

    put(id, data){
        return this.http.put(`${ENV.BACKEND}/common/imagenes-perfiles/` + id, data).toPromise();
    }

}