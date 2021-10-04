import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "src/environments/environment";

@Injectable()
export class UsuariosService {

    constructor(
        private http: HttpClient,
    ) { }

    find(data) {
        let str = Object.entries(data).map(([key, val]) => `${key}=${val}`).join('&');
        return this.http.get(`${ENV.BACKEND}/usuarios/obtener-usuarios?${str}`).toPromise();
    }

    findMisDatos() {
        return this.http.get(`${ENV.BACKEND}/usuarios/obtener-mis-datos`).toPromise();
    }

    findUsuariosRS(data) {
        let str = Object.entries(data).map(([key, val]) => `${key}=${val}`).join('&');
        return this.http.get(`${ENV.BACKEND}/usuarios-rs/obtener-datos-usuarios?${str}`).toPromise();
    }

    setStatusUser(idUsuario, status) {
        return this.http.put(ENV.BACKEND + '/usuarios-rs/status/' + idUsuario, { status }).toPromise();
    }

    post(data){
        return this.http.post(`${ENV.BACKEND}/usuarios/crear-usuario`, data).toPromise();
    }

    put(id, data){
        return this.http.put(`${ENV.BACKEND}/usuarios/modificar-usuario/` + id, data).toPromise();
    }

  
}