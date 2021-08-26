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

      this.router.navigate(['/login/admin']);
    });

    this.loaderSubscriber = this.utils.fnLoginLoaderState().getLoginLoaderState().subscribe( state => {
      this.activeLoading = state;
    });

  }

  ngOnDestroy(){
    this.loaderSubscriber.unsubscribe();
  }

}
