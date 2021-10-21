import { Component, OnInit, HostListener, Input } from '@angular/core';
import { AutenticacionService } from '../../services/autenticacion/autenticacion.service';
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
  userViews = [];
  loginState;

  constructor(
    public utils: UtilsService,
    public authService: AutenticacionService
  ) { }

  ngOnInit(): void {
    const dataLogin = JSON.parse(sessionStorage.getItem('auth'));
    this.tipoUsuario = dataLogin && dataLogin.data ? dataLogin.data.tipoUsuario : null;
    this.onResize();
    this.prepareMenu();
    this.loginState = this.authService.fnLoginState().getLogin().subscribe(data => {
      try {
        this.prepareMenu();
      } catch (err) {
        this.utils.fnError();
      }
    });

  }

  prepareMenu(){
    const authInfo = this.authService.getAuthInfo();
    this.userViews = authInfo ? authInfo['modulos'] : [];
    this.setMenu();
  }

  setMenu() {

    this.mobileMenuItems = [{
      groupName: 'System Options',
      icon: 'fal fa-cog',
      items: [
        { name: 'Admins', path: '/admins', activateTo: ['ADMIN'], icon: 'fal fa-cog', show: this.chkAv('ADMINS') },
        { name: 'Banners', path: '/banners', activateTo: ['ADMIN'], icon: 'fal fa-cog', show: this.chkAv('BANNERS'), class: 'center-text' },
        { name: 'Events', path: '/eventos', activateTo: ['ADMIN'], icon: 'fal fa-calendar', show: this.chkAv('EVENTS') },
        { name: 'Categories', path: '/categories', activateTo: ['ADMIN'], icon: 'fal fa-calendar', show: this.chkAv('CATEGORIES_MANAGEMENT'), class: 'center-text' },
        { name: 'Files', path: '/downloadable-category', activateTo: ['ADMIN'], icon: 'fal fa-calendar',show: this.chkAv('FILES'), class: 'center-text' },
        { name: 'Articles', path: '/public-articles', activateTo: ['ADMIN'], icon: 'fal fa-calendar', show: this.chkAv('ARTICLES'), class: 'center-text' },
        { name: 'RS Posts & Articles', path: '/social-network/sn-posts-articles', activateTo: ['ADMIN'], show: this.chkAv('SOCIAL_POSTS'), icon: 'fal fa-cog', class: 'center-text' },
        { name: 'SN Users', path: '/social-network/sn-users', activateTo: ['ADMIN'], icon: 'fal fa-cog', show: this.chkAv('SOCIAL_NETWORKS_USERS'), class: 'center-text' },
      ]
    }];

    this.menuItems = [
      { name: 'Admins', path: '/admins', activateTo: ['ADMIN'], icon: 'fal fa-cog', show: this.chkAv('ADMINS'), class: 'center-text' },
      { name: 'Banners', path: '/banners', activateTo: ['ADMIN'], icon: 'fal fa-cog', show: this.chkAv('BANNERS'), class: 'center-text' },
      { name: 'Events', path: '/events', activateTo: ['ADMIN'], icon: 'fal fa-calendar', show: this.chkAv('EVENTS'), class: 'center-text' },
      { name: 'Files', path: '/downloadable-category', activateTo: ['ADMIN'], show: this.chkAv('FILES'), icon: 'fal fa-calendar', class: 'center-text' },
      { name: 'Articles', path: '/public-articles', activateTo: ['ADMIN'], show: this.chkAv('ARTICLES'), icon: 'fal fa-calendar', class: 'center-text' },
      {
        groupName: 'More Opt.',
        icon: 'fal fa-cog',
        class: 'center-text',
        activateTo: ['ADMIN'],
        show: this.chkAv('CATEGORIES_MANAGEMENT') || this.chkAv('SOCIAL_POSTS') || this.chkAv('SOCIAL_NETWORKS_USERS'),
        items: [
          { name: 'Categories', path: '/common/categories', show: this.chkAv('CATEGORIES_MANAGEMENT'), activateTo: ['ADMIN'], icon: 'fal fa-cog', class: 'center-text' },
          { name: 'SN Posts & Articles', path: '/social-network/sn-posts-articles', show: this.chkAv('SOCIAL_POSTS'), activateTo: ['ADMIN'], icon: 'fal fa-cog', class: 'center-text' },
          { name: 'SN Users', path: '/social-network/sn-users', show: this.chkAv('SOCIAL_NETWORKS_USERS'), activateTo: ['ADMIN'], icon: 'fal fa-cog', class: 'center-text' },

        ]
      }

    ]
  }

  chkAv(view) {
    return this.userViews.find(item => item === view);
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
