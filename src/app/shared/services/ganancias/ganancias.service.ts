import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "src/environments/environment";

@Injectable()
export class GananciasService {

    constructor(
        private http: HttpClient,
    ) { }

    find(query) {
        let str = query ? Object.entries(query).map(([key, val]) => `${key}=${val}`).join('&') : '';
        return this.http.get(`${ENV.BACKEND}/ganancias?${str}`).toPromise();
    }

    post(data){
        return this.http.post(`${ENV.BACKEND}/ganancias`, data).toPromise();
    }

    put(id, data){
        return this.http.put(`${ENV.BACKEND}/ganancias/` + id, data).toPromise();
    }

  
}