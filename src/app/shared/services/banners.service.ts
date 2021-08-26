import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "src/environments/environment";

@Injectable()
export class BannersService {

    constructor(
        private http: HttpClient,
    ) { }

    find(data) {
        let str = Object.entries(data).map(([key, val]) => `${key}=${val}`).join('&');
        return this.http.get(`${ENV.BACKEND}/common/banners?${str}`).toPromise();
    }

    post(data){
        return this.http.post(`${ENV.BACKEND}/common/banners`, data).toPromise();
    }

    put(id, data){
        return this.http.put(`${ENV.BACKEND}/common/banners/` + id, data).toPromise();
    }

    delete(id){
        return this.http.delete(`${ENV.BACKEND}/common/banners/` + id).toPromise();
    }
  
}