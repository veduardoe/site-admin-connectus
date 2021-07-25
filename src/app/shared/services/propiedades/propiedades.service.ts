import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "src/environments/environment";

@Injectable()
export class PropiedadesService {

    constructor(
        private http: HttpClient
    ) { }

    find(query) {
        let str = query ? Object.entries(query).map(([key, val]) => `${key}=${val}`).join('&') : '';
        return this.http.get(`${ENV.BACKEND}/propiedades?${str}`).toPromise();
    }

    findOne(id: string) {
        return this.http.get(`${ENV.BACKEND}/propiedades/${id}`).toPromise();
    }

    post(data: any) {
        return this.http.post(`${ENV.BACKEND}/propiedades`, data).toPromise();
    }

    put(id: string, data: any) {
        return this.http.put(`${ENV.BACKEND}/propiedades/${id}`, data).toPromise();
    }

    putFichero(id, data) {
        return this.http.put(`${ENV.BACKEND}/propiedades/ficheros/${id}`, data).toPromise();
    }

    putBorroFichero(id, data) {
        return this.http.put(`${ENV.BACKEND}/propiedades/borrar-ficheros/${id}`, data).toPromise();
    }

    findAmenidades(){
        return this.http.get(`${ENV.BACKEND}/propiedades/listado/amenidades`).toPromise();
    }

    postAmenidades(data: any) {
        return this.http.post(`${ENV.BACKEND}/propiedades/amenidades`, data).toPromise();
    }

    deleteAmenidades(id: string) {
        return this.http.delete(`${ENV.BACKEND}/propiedades/amenidades/${id}`).toPromise();
    }

    findTiposPropiedades(){
        return this.http.get(`${ENV.BACKEND}/propiedades/listado/tipos-propiedades`).toPromise();
    }

    postTiposPropiedades(data: any) {
        return this.http.post(`${ENV.BACKEND}/propiedades/tipos-propiedades`, data).toPromise();
    }

    deleteTiposPropiedades(id: string) {
        return this.http.delete(`${ENV.BACKEND}/propiedades/tipos-propiedades/${id}`).toPromise();
    }

    enviarDocumento(data: any) {
        return this.http.post(`${ENV.BACKEND}/propiedades/enviar-documento`, data).toPromise();
    }
}