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

}