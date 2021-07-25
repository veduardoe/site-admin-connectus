import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "src/environments/environment";

@Injectable()
export class PlanesAgentesService {

    constructor(
        private http: HttpClient,
    ) { }

    find(query) {
        let str = query ? Object.entries(query).map(([key, val]) => `${key}=${val}`).join('&') : '';
        return this.http.get(`${ENV.BACKEND}/planes-agentes/obtener?${str}`).toPromise();
    }

    post(data){
        return this.http.post(`${ENV.BACKEND}/planes-agentes/crear`, data).toPromise();
    }

    put(id, data){
        return this.http.put(`${ENV.BACKEND}/planes-agentes/modificar/` + id, data).toPromise();
    }

  
}