import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "src/environments/environment";

@Injectable()
export class ArticulosService {

    constructor(
        private http: HttpClient,
    ) { }

    find(data) {
        let str = Object.entries(data).map(([key, val]) => `${key}=${val}`).join('&');
        return this.http.get(`${ENV.BACKEND}/articulospublicos?${str}`).toPromise();
    }

    post(data){
        return this.http.post(`${ENV.BACKEND}/articulospublicos`, data).toPromise();
    }

    put(id, data){
        return this.http.put(`${ENV.BACKEND}/articulospublicos/` + id, data).toPromise();
    }

}