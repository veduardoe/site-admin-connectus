import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AutenticacionService } from 'src/app/shared/services/autenticacion/autenticacion.service';
import { UtilsService } from 'src/app/shared/services/common/utils.service';

@Component({
  selector: 'app-recuperar-clave',
  templateUrl: './recuperar-clave.component.html',
  styleUrls: ['./recuperar-clave.component.scss', './../ingreso/ingreso.component.scss']
})
export class RecuperarClaveComponent implements OnInit {

  @Input() tipoUsuario;
  @Output() moverVista:EventEmitter<number> = new EventEmitter();

  usuario = new FormControl('',[Validators.required, Validators.minLength(8), Validators.maxLength(15)]);
  codigoValidacion = new FormControl('',[Validators.required]);
  clave = new FormControl('',[Validators.required, Validators.minLength(8), Validators.maxLength(15)]);
  confirmarClave = new FormControl('',[Validators.required]);
  
  recuperarClave = {
    solicitar: null,
    validar: null,
    procesar: null
  };

  constructor(
    private autenticacionService: AutenticacionService,
    private utils: UtilsService

  ) { }

  ngOnInit(): void {
  }

  solicitarClave(){

    let error = false;

    if(this.usuario.hasError('required')){
      this.usuario.markAsTouched();
      this.usuario.setErrors({ required: true});
      error = true;
    }

    if(this.usuario.hasError('minLength') || this.usuario.hasError('maxLength')){
      this.usuario.markAsTouched();
      this.usuario.setErrors({ minLength: true});
      error = true;
    }

    if(error){
      return;
    }

    const data = {
      usuario: this.usuario.value,
    }

    this.utils.fnLoginLoaderState().setLoginLoaderState(true);
    this.autenticacionService.solicitarClave(data).then( res => {
      this.utils.fnLoginLoaderState().setLoginLoaderState(false);
      this.recuperarClave.solicitar = res;
    }).catch( err =>{ 
      this.utils.fnLoginLoaderState().setLoginLoaderState(false);
      this.utils.fnError();
    });

  }

  validarSolicitudClave(){
    
    let error = false;

    if(this.codigoValidacion.hasError('required')){
      this.codigoValidacion.markAsTouched();
      this.codigoValidacion.setErrors({ required: true});
      error = true;
    }

    if(error){
      return;
    }

    const data = {
      id: this.recuperarClave.solicitar.id,
      codigoValidacion : this.codigoValidacion.value
    };

    this.utils.fnLoginLoaderState().setLoginLoaderState(true);
    this.autenticacionService.validarSolicitudClave(data).then( res => {
      this.utils.fnLoginLoaderState().setLoginLoaderState(false);
      this.recuperarClave.validar = res;
    }).catch( err =>{ 
      this.utils.fnLoginLoaderState().setLoginLoaderState(false);
      this.utils.fnError();
    });

  }

  procesarSolicitudClave(){
    
    let error = false;

    if(this.clave.hasError('required')){
      this.clave.markAsTouched();
      this.clave.setErrors({ required: true});
      error = true;
    }

    if(this.confirmarClave.hasError('required')){
      this.confirmarClave.markAsTouched();
      this.confirmarClave.setErrors({ required: true});
      error = true;
    }

    if(this.clave.hasError('minLength') || this.clave.hasError('maxLength')){
      this.clave.markAsTouched();
      this.clave.setErrors({ minLength: true});
      error = true;
    }

    if(this.clave.value !== this.confirmarClave.value){
      this.confirmarClave.markAsTouched();
      this.confirmarClave.setErrors({ compare: true});
      error = true;
    }else{
      this.confirmarClave.markAsUntouched();
      error = false;
    }

    if(error){
      return;
    }

    const data = {
      id : this.recuperarClave.solicitar.id,
      clave: this.clave.value,
      codigoValidacion: this.codigoValidacion.value
    };

    this.utils.fnLoginLoaderState().setLoginLoaderState(true);
    this.autenticacionService.procesarSolicitudClave(data).then( (res:any) => {
      this.utils.fnLoginLoaderState().setLoginLoaderState(false);
      this.recuperarClave.procesar = res;
      if(res.response){
        this.utils.fnMainDialog('Clave cambiada', 'La clave ha sido modificada exitosamente.', 'message');
        this.irLogin();
      }
    }).catch(err => {
      this.utils.fnError();
      this.utils.fnLoginLoaderState().setLoginLoaderState(false);
    });

  }

  irLogin(){
    this.recuperarClave = {
      solicitar: null,
      validar: null,
      procesar: null
    };
    this.usuario.reset();
    this.clave.reset();
    this.confirmarClave.reset();
    this.codigoValidacion.reset();
    this.moverVista.emit(0);
  }

}
