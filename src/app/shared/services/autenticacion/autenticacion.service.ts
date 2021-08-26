import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ENV } from "src/environments/environment";
import { Observable, Subject } from "rxjs";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { UtilsService } from "../common/utils.service";
import { TIPO_USUARIOS } from "src/environments/items";

@Injectable()
export class AutenticacionService implements CanActivate {

    public loginState = new Subject();

    constructor(
        private http: HttpClient,
        private router: Router,
        private utils: UtilsService
    ) { }

    solicitarNuevoIngreso(data) {
        return this.http.post(`${ENV.BACKEND}/nuevo-ingreso/solicitar`, data).toPromise();
    }

    validarNuevoIngreso(data) {
        return this.http.post(`${ENV.BACKEND}/nuevo-ingreso/validar`, data).toPromise();
    }

    procesarNuevoIngreso(data) {
        return this.http.post(`${ENV.BACKEND}/nuevo-ingreso/procesar`, data).toPromise();
    }

    login(data) {
        return this.http.post(`${ENV.BACKEND}/login`, data).toPromise();
    }

    solicitarClave(data) {
        return this.http.post(`${ENV.BACKEND}/login/recuperar-clave/solicitar`, data).toPromise();
    }

    validarSolicitudClave(data) {
        return this.http.post(`${ENV.BACKEND}/login/recuperar-clave/validar`, data).toPromise();
    }

    procesarSolicitudClave(data) {
        return this.http.post(`${ENV.BACKEND}/login/recuperar-clave/procesar`, data).toPromise();
    }

    fnLoginState() {
        return {
            setLogin: (data: any) => {
                this.loginState.next(data)
            },
            getLogin: (): Observable<any> => {
                return this.loginState.asObservable();
            }
        }
    }

    get isAuth() {
        try {
            const data: any = JSON.parse(sessionStorage.getItem('auth'));
            return data.hasOwnProperty('access_token') && data.hasOwnProperty('data');
        } catch (err) {

            return false;
        }
    }

    getAuthInfo() {
        try {
            const info: any = sessionStorage.getItem('auth');
            return JSON.parse(info).data;
        } catch (err) {
            return false;
        }
    }

    removeAuthInfo() {
        sessionStorage.clear();
        localStorage.clear();
    }

    logout() {
        const tipoUsuario = this.getAuthInfo() ? this.getAuthInfo()['tipoUsuario'].toLowerCase() : '';
        this.router.navigate(['/login/' + tipoUsuario]);
        this.removeAuthInfo();
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {

        try{

            const perfilesPermitidos = route.data.expected ? route.data.expected : [];
            const perfilActual = this.getAuthInfo()['tipoUsuario'];
            const accesoPorPerfil = perfilesPermitidos.find(pp => pp.toLowerCase() === perfilActual.toLowerCase());
    
            if (this.isAuth && (perfilActual === TIPO_USUARIOS.ADMIN || perfilesPermitidos[0] === '*' || accesoPorPerfil)) {
                return true;
            } else {
                this.router.navigate(['/login/' + perfilActual.toLowerCase()]);
                this.removeAuthInfo();
                this.utils.fnMessage("Acceso Denegado. No tiene permisos para ver el contenido del sitio.");
                return false;
            }

        }catch(err){
            this.router.navigate(['/login/agente']);
            this.utils.fnMessage("Acceso Denegado. No tiene permisos para ver el contenido del sitio.");

        }

    }
}