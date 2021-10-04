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
        { name: 'Admins', path: '/administradores', activateTo: ['ADMIN'], icon: 'fal fa-cog' },
        { name: 'Eventos', path: '/eventos', activateTo: ['ADMIN'], icon: 'fal fa-calendar' },
        { name: 'Categories', path: '/categories', activateTo: ['ADMIN'], icon: 'fal fa-calendar', class: 'center-text' },
        { name: 'Files', path: '/downloadable-category', activateTo: ['ADMIN'], icon: 'fal fa-calendar', class: 'center-text' },
        { name: 'Articles', path: '/public-articles', activateTo: ['ADMIN'], icon: 'fal fa-calendar', class: 'center-text' },
        { name: 'RS Posts & Articles', path: '/social-network/sn-posts-articles', activateTo: ['ADMIN'], icon: 'fal fa-cog', class: 'center-text' },
        { name: 'SN Users', path: '/social-network/sn-users', activateTo: ['ADMIN'], icon: 'fal fa-cog', class: 'center-text' },
      ]
    }];

    this.menuItems = [
      { name: 'Admins', path: '/administradores', activateTo: ['ADMIN'], icon: 'fal fa-cog', class: 'center-text' },
      { name: 'Banners', path: '/banners', activateTo: ['ADMIN'], icon: 'fal fa-cog', class: 'center-text' },
      { name: 'Events', path: '/events', activateTo: ['ADMIN'], icon: 'fal fa-calendar', class: 'center-text' },
      
      { name: 'Files', path: '/downloadable-category', activateTo: ['ADMIN'], icon: 'fal fa-calendar', class: 'center-text' },
      { name: 'Articles', path: '/public-articles', activateTo: ['ADMIN'], icon: 'fal fa-calendar', class: 'center-text' },
      {
        groupName: 'More Opt.',
        icon: 'fal fa-cog',
        class: 'center-text',
        activateTo: ['ADMIN'],
        items: [
          { name: 'Categories', path: '/common/categories', activateTo: ['ADMIN'], icon: 'fal fa-cog', class: 'center-text' },
          { name: 'SN Posts & Articles', path: '/social-network/sn-posts-articles', activateTo: ['ADMIN'], icon: 'fal fa-cog', class: 'center-text' },
          { name: 'SN Users', path: '/social-network/sn-users', activateTo: ['ADMIN'], icon: 'fal fa-cog', class: 'center-text' },

        ]
      }

    ]
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.menuContainerHeight = window.innerHeight - 138;
  }

  displayLink(userActivate: any[]) {
    const match = userActivate.find(item => item === this.tipoUsuario);
    return match ? true : false;
  }
}
