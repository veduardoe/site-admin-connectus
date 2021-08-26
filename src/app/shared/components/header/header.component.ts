import { Component, OnInit, OnDestroy } from '@angular/core';
import { ENV } from 'src/environments/environment';
import { AutenticacionService } from '../../services/autenticacion/autenticacion.service';
import { PerfilService } from '../../services/common/perfil.service';
import { UtilsService } from '../../services/common/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public stateSidenav;
  public obsStateSidenav;
  public readyMenu = false;
  public sideMode = ENV.sideMode;

  constructor(
    public utils:UtilsService,
    public autenticacionService: AutenticacionService,
    public perfilService: PerfilService
  ) { }

  ngOnInit(): void {

    this.obsStateSidenav = this.utils.fnSidenavState().getSidenavState().subscribe( state => {
      this.stateSidenav = state;
    })

    setTimeout(()=> {
      this.readyMenu = true;
    },100);
  }

  ngOnDestroy() : void {
    this.obsStateSidenav.unsubscribe();
  }

  toggle(){
    this.stateSidenav = (this.stateSidenav) ? false : true;
    this.utils.fnSidenavState().setSidenavState(this.stateSidenav);
  }

  get displayMenu(){
    return this.sideMode || window.innerWidth < 940;
  }

  openProfile(){
    const data = this.autenticacionService.getAuthInfo();
    if(data.tipoUsuario === 'ADMIN'){
      this.perfilService.openFormPerfilAdmin(data.id, true);
    }
  }
}
