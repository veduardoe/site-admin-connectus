import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "src/environments/environment";

@Injectable()
export class CategoriasService {

    constructor(
        private http: HttpClient,
    ) { }

    find() {
        return this.http.get(`${ENV.BACKEND}/common/listado-categorias`).toPromise();
    }

    post(data){
        return this.http.post(`${ENV.BACKEND}/common/listado-categorias`, data).toPromise();
    }

    put(id, data){
        return this.http.put(`${ENV.BACKEND}/common/listado-categorias/` + id, data).toPromise();
    }

}