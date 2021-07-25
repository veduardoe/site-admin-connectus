import { Component, OnInit, HostListener, Input } from '@angular/core';
import { UtilsService } from '../../services/common/utils.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  @Input() isSideNav = true;

  menuItems = [];
  mobileMenuItems = [];
  menuContainerHeight = 0;
  tipoUsuario;

  constructor(
    public utils: UtilsService
  ) { }

  ngOnInit(): void {
    const dataLogin = JSON.parse(sessionStorage.getItem('auth'));
    this.tipoUsuario = dataLogin && dataLogin.data ? dataLogin.data.tipoUsuario : null;
    this.setMenu();
    this.onResize();
  }

  setMenu() {
    this.mobileMenuItems = [{
        groupName: 'Opciones del Sistema',
        icon: 'fal fa-cog',
        items: [
          { name: 'Agentes', path: '/agentes', activateTo: ['ADMIN'], icon: 'fal fa-cog', class: 'winfo' },
          { name: 'Propiedades', path: '/propiedades', activateTo: ['ADMIN', 'AGENTE'], icon: 'fal fa-cog' },
          { name: 'Solicitudes', path: '/solicitudes', activateTo: ['ADMIN', 'AGENTE'], icon: 'fal fa-cog' },
          { name: 'Mantenedores', path: '/mantenedores', activateTo: ['ADMIN'], icon: 'fal fa-cog' },
          { name: 'Pagos y Comisiones', path: '/pagos-comisiones', activateTo: ['ADMIN', 'AGENTE'], icon: 'fal fa-cog' },
          { name: 'Tipos de Propiedades', path: '/extras/tipos-propiedades', activateTo: ['ADMIN'], icon: 'fal fa-cog' },
          { name: 'Amenidades', path: '/extras/amenidades', activateTo: ['ADMIN'], icon: 'fal fa-cog' },
          { name: 'Administradores', path: '/administradores', activateTo: ['ADMIN'], icon: 'fal fa-cog' },
          { name: 'Planes', path: '/planes', activateTo: ['ADMIN'], icon: 'fal fa-cog' },
          { name: 'Clientes', path: '/clientes', activateTo: ['ADMIN','AGENTE'], icon: 'fal fa-cog' },
          { name: 'Config. Asignación', path: '/extras/configuracion', activateTo: ['ADMIN'], icon: 'fal fa-cog' },
          { name: 'Ganancias y Captaciones', path: '/ganancias', activateTo: [ 'AGENTE', 'ADMIN'], icon: 'fal fa-envelope-open-dollar',class: '' },
        ]
      }];

    this.menuItems = [
      { name: 'Agentes', path: '/agentes', activateTo: ['ADMIN'], icon: 'fas fa-user-tie', class: 'center-text' },
      { name: 'Propiedades', path: '/propiedades', activateTo: ['ADMIN', 'AGENTE'], icon: 'fal fa-home-lg', class: 'center-text' },
      { name: 'Solicitudes', path: '/solicitudes', activateTo: ['ADMIN', 'AGENTE'], icon: 'fal fa-clipboard-list-check', class: 'center-text'  },
      { name: 'Ganancias y Captaciones', path: '/ganancias', activateTo: [ 'AGENTE'], icon: 'fal fa-envelope-open-dollar',class: '' },
      { name: 'Clientes', path: '/clientes', activateTo: ['ADMIN', 'AGENTE'], icon: 'fal fa-cog', class: 'center-text'  },
      {
        groupName: 'Más opciones',
        icon: 'fal fa-cog',
        activateTo: ['ADMIN'],
        items: [
          { name: 'Tipos de Propiedades', path: '/extras/tipos-propiedades', activateTo: ['ADMIN'], icon: 'fal fa-cog' },
          { name: 'Amenidades', path: '/extras/amenidades', activateTo: ['ADMIN'], icon: 'fal fa-cog' },
          { name: 'Config. Asignación', path: '/extras/configuracion', activateTo: ['ADMIN'], icon: 'fal fa-cog' },
          { name: 'Administradores', path: '/administradores', activateTo: ['ADMIN'], icon: 'fal fa-cog' },
          { name: 'Planes', path: '/planes', activateTo: ['ADMIN'], icon: 'fal fa-cog' },
        ]
      }

    ]
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.menuContainerHeight = window.innerHeight - 138;
  }

  displayLink(userActivate:any[]){
    const match = userActivate.find( item => item === this.tipoUsuario);
    return match ? true : false;
  }
}
