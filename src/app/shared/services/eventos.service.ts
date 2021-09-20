import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "src/environments/environment";

@Injectable()
export class EventosService {

    constructor(
        private http: HttpClient,
    ) { }

    find(data) {
        let str = Object.entries(data).map(([key, val]) => `${key}=${val}`).join('&');
        return this.http.get(`${ENV.BACKEND}/eventos?${str}`).toPromise();
    }

    post(data){
        return this.http.post(`${ENV.BACKEND}/eventos`, data).toPromise();
    }

    put(id, data){
        return this.http.put(`${ENV.BACKEND}/eventos/` + id, data).toPromise();
    }

    delete(id){
        return this.http.put(`${ENV.BACKEND}/eventos/borrar/` + id, null).toPromise();
    }

  
}