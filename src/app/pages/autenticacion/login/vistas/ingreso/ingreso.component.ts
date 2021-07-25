import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AutenticacionService } from 'src/app/shared/services/autenticacion/autenticacion.service';
import { UtilsService } from 'src/app/shared/services/common/utils.service';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.scss']
})
export class IngresoComponent implements OnInit {

  @Input() tipoUsuario;
  @Output() moverVista: EventEmitter<number> = new EventEmitter();

  enable2FACode = false;
  usuario = new FormControl('', [Validators.required]);
  clave = new FormControl('', [Validators.required]);
  codigo2FA = new FormControl(null);

  constructor(
    private autenticacionService: AutenticacionService,
    private utils: UtilsService
  ) { }

  ngOnInit(): void {
  }

  irA(index) {
    this.moverVista.emit(index);
  }

  login() {

    let error = false;

    if (this.usuario.hasError('required')) {
      this.usuario.markAsTouched();
      this.usuario.setErrors({ required: true });
      error = true;
    }

    if (this.clave.hasError('required')) {
      this.clave.markAsTouched();
      this.clave.setErrors({ required: true });
      error = true;
    }

    if (!this.codigo2FA.value && this.enable2FACode) {
      this.codigo2FA.markAsTouched();
      this.codigo2FA.setErrors({ required: true });
      error = true;
    }

    if (error) {
      return;
    }

    const data = {
      usuario: this.usuario.value.toLowerCase(),
      clave: this.clave.value,
      tipoUsuario: this.tipoUsuario,
      codigo2FA: this.codigo2FA.value
    };

    this.utils.fnLoginLoaderState().setLoginLoaderState(true);
    this.autenticacionService.login(data).then((res: any) => {

      if (res.response) {
        if(res.type && res.type === '2FA'){
          this.enable2FACode = true;
        }else{
          this.autenticacionService.fnLoginState().setLogin(res.token);
        }
      } else {
        if(res.type && res.type === '2FALogin'){
          this.utils.fnMainDialog('Error', 'Código 2FA es incorrecto. Verifique e intente de Nuevo', 'message');
        }else{
          this.utils.fnMainDialog('Error', res.message, 'message');
        }
      }
      this.utils.fnLoginLoaderState().setLoginLoaderState(false);

    }).catch(err => {
      this.utils.fnError();
      this.utils.fnLoginLoaderState().setLoginLoaderState(false);
    });

  }
}
