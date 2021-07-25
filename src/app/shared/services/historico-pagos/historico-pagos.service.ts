import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "src/environments/environment";

@Injectable()
export class HistoricoPagosService {

    constructor(
        private http: HttpClient,
    ) { }

    find(query) {
        let str = query ? Object.entries(query).map(([key, val]) => `${key}=${val}`).join('&') : '';
        return this.http.get(`${ENV.BACKEND}/historico-pagos-planes/get?${str}`).toPromise();
    }

    post(data) {
        return this.http.post(`${ENV.BACKEND}/historico-pagos-planes/set`, data).toPromise();
    }

    put(id, data) {
        return this.http.put(`${ENV.BACKEND}/historico-pagos-planes/update/` + id, data).toPromise();
    }


}