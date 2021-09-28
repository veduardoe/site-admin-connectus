import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "src/environments/environment";

@Injectable()
export class ContenidosDescargablesService {

    constructor(
        private http: HttpClient,
    ) { }

    findCategory(data) {
        let str = Object.entries(data).map(([key, val]) => `${key}=${val}`).join('&');
        return this.http.get(`${ENV.BACKEND}/contenidosdescargables/categorias?${str}`).toPromise();
    }

    postCategory(data){
        return this.http.post(`${ENV.BACKEND}/contenidosdescargables/categorias`, data).toPromise();
    }

    putCategory(id, data){
        return this.http.put(`${ENV.BACKEND}/contenidosdescargables/categorias/` + id, data).toPromise();
    }

    findContent(data) {
        let str = Object.entries(data).map(([key, val]) => `${key}=${val}`).join('&');
        return this.http.get(`${ENV.BACKEND}/contenidosdescargables/contenidos?${str}`).toPromise();
    }

    postContent(data){
        return this.http.post(`${ENV.BACKEND}/contenidosdescargables/contenidos`, data).toPromise();
    }

    putContent(id, data){
        return this.http.put(`${ENV.BACKEND}/contenidosdescargables/contenidos/` + id, data).toPromise();
    }

}