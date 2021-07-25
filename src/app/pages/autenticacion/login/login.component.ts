import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/common/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  tipoUsuario: string;
  curIndex = 0;
  loaderSubscriber;
  activeLoading = false;

  constructor(
    public utils: UtilsService,
    private router: Router,
    private activateRoute: ActivatedRoute,

  ) { }

  ngOnInit(): void {

    this.activateRoute.params.subscribe(params => {

      const validParams = ['agente',  'admin'];
      const tipoUsuario = params.tipoUsuario ? params.tipoUsuario.toLowerCase() : null;
      const tipoUsuarioFound = validParams.find(item => {
        return item === tipoUsuario;
      });

      if (tipoUsuarioFound) {
        this.tipoUsuario = tipoUsuarioFound;
        this.router.navigate(['/login/' + this.tipoUsuario]);

      } else {
        this.router.navigate(['/login/agente']);
      }

    });

    this.loaderSubscriber = this.utils.fnLoginLoaderState().getLoginLoaderState().subscribe( state => {
      this.activeLoading = state;
    });

  }

  ngOnDestroy(){
    this.loaderSubscriber.unsubscribe();
  }

}
