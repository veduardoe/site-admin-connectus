import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "src/environments/environment";

@Injectable()
export class SolicitudesService {

    constructor(
        private http: HttpClient,
    ) { }

    find(query) {
        let str = query ? Object.entries(query).map(([key, val]) => `${key}=${val}`).join('&') : '';
        return this.http.get(`${ENV.BACKEND}/solicitudes?${str}`).toPromise();
    }

    findCompletados(query) {
        let str = query ? Object.entries(query).map(([key, val]) => `${key}=${val}`).join('&') : '';
        return this.http.get(`${ENV.BACKEND}/solicitudes/completados?${str}`).toPromise();
    }

    post(data){
        return this.http.post(`${ENV.BACKEND}/solicitudes`, data).toPromise();
    }

    put(id, data){
        return this.http.put(`${ENV.BACKEND}/solicitudes/` + id, data).toPromise();
    }

  
}