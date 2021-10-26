import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "src/environments/environment";

@Injectable()
export class ConfiguracionesService {

    constructor(
        private http: HttpClient,
    ) { }

    find(data) {
        let str = Object.entries(data).map(([key, val]) => `${key}=${val}`).join('&');
        return this.http.get(`${ENV.BACKEND}/common/configuraciones?${str}`).toPromise();
    }

    put(data) {
        return this.http.put(`${ENV.BACKEND}/common/configuraciones`, data).toPromise();
    }
}