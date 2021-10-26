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
        this.router.navigate(['/login/admin']);
        this.removeAuthInfo();
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {

        try{

            const perfilesPermitidos = route.data.expected ? route.data.expected : [];
            const perfilActual = this.getAuthInfo()['modulos'].join(";");
            const accesoPorPerfil = perfilesPermitidos.find(pp => perfilActual.toLowerCase().includes(pp.toLowerCase()));
            console.log(this.getAuthInfo())
            if (this.isAuth && ( perfilesPermitidos[0] === '*' || accesoPorPerfil || this.getAuthInfo()['isSuper'])) {
                return true;
            } else {
                this.router.navigate(['/login/admin']);
                this.removeAuthInfo();
                this.utils.fnMessage("Access denied. You cannot access to the content");
                return false;
            }

        }catch(err){
            console.log(err)
            this.router.navigate(['/login/admin']);
            this.removeAuthInfo();
            this.utils.fnMessage("Access denied. You cannot access to the content.");
        }

    }
}