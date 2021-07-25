import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { UtilsService } from './shared/services/common/utils.service';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import * as Hammer from 'hammerjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { fadeAnimation } from './shared/animations/route.animation';
import { ENV } from 'src/environments/environment';
import { AutenticacionService } from './shared/services/autenticacion/autenticacion.service';
import jwt_decode from "jwt-decode";
import { TIPO_USUARIOS } from 'src/environments/items';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]

})
export class AppComponent implements OnInit, OnDestroy {

  public stateSidenav;
  public loginState;
  public obsStateSidenav;
  public modeSideNav: string = "side";
  public windowHeight: number;
  public routeDisableOverflow = false;

  constructor(
    public utils: UtilsService,
    private router: Router,
    private deviceService: DeviceDetectorService,
    public autenticacionService: AutenticacionService
  ) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.stateSideNav();
      this.routerEvents();
      this.onResize();
      this.defineSwipeSidenav();
      this.setloginState();
      this.setIndicadores();
    }, 100);

  }

  ngOnDestroy(): void {
    this.obsStateSidenav.unsubscribe();
    this.loginState.unsubscribe();
  }

  setloginState() {
    this.loginState = this.autenticacionService.fnLoginState().getLogin().subscribe(data => {
      try {
        const decodedToken :any = { data: jwt_decode(data), access_token: data };
        sessionStorage.setItem('auth', JSON.stringify(decodedToken));

        switch (decodedToken.data.tipoUsuario) {

          case TIPO_USUARIOS.ADMIN:
            this.router.navigate(['/solicitudes']);
            break;

          case TIPO_USUARIOS.AGENTE:
            this.router.navigate(['/solicitudes']);
            break;
        }

      } catch (err) {
        this.utils.fnError();
      }
    });
  }

  defineSwipeSidenav() {
    if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
      this.setSwipeSidenav();
    }
  }

  stateSideNav() {
    this.obsStateSidenav = this.utils.fnSidenavState().getSidenavState().subscribe(state => {
      this.stateSidenav = state;
    });
  }

  routerEvents() {
    this.router.events.subscribe(data => {
      this.routeDisableOverflow = true;
      if (data instanceof NavigationEnd) {
        this.onResize();
        if (window.innerWidth < 1300) {
          this.utils.fnSidenavState().setSidenavState(false);
        }
        setTimeout(() => {
          this.routeDisableOverflow = false;
        }, 1000);
      
      }
    });
  }

  backDropClick() {
    this.utils.fnSidenavState().setSidenavState(false);
  }

  setSwipeSidenav() {
    var sidenavCnt = document.getElementById('sidenav-cnt');
    var mc1 = new Hammer(sidenavCnt);
    mc1.on("swipeleft", (ev) => {
      this.utils.fnSidenavState().setSidenavState(false);
    });
  }

  @HostListener('window:resize', [])
  onResize(): void {

    if (window.innerWidth >= 1300 && ENV.sideMode) {
      this.modeSideNav = 'side';
      this.utils.fnSidenavState().setSidenavState(true);
    } else {
      this.modeSideNav = 'over';
      this.utils.fnSidenavState().setSidenavState(false);
    }

    this.windowHeight = !this.autenticacionService.isAuth ? window.innerHeight : window.innerHeight - 292;
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  setIndicadores(){
    this.utils.getIndicadores().then( (res:any) => {
      const { uf, dolar, dolar_intercambio, euro, utm } = res;
      const indicadores = { uf, dolar, dolar_intercambio, euro, utm } ;
      localStorage.setItem('indicadores', JSON.stringify(indicadores));
    });
  }

}
