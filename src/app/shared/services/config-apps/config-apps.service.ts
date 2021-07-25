import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "src/environments/environment";

@Injectable()
export class ConfigAppsService {

    constructor(
        private http: HttpClient,
    ) { }

    find(data) {
        let str = Object.entries(data).map(([key, val]) => `${key}=${val}`).join('&');
        return this.http.get(`${ENV.BACKEND}/config-apps/get?${str}`).toPromise();
    }

    post(data) {
        return this.http.post(`${ENV.BACKEND}/config-apps/set`, data).toPromise();
    }

    put(id, data) {
        return this.http.put(`${ENV.BACKEND}/config-apps/update/` + id, data).toPromise();
    }


}