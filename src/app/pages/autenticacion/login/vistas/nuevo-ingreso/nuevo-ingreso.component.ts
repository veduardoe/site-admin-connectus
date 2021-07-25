import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AutenticacionService } from 'src/app/shared/services/autenticacion/autenticacion.service';
import { UtilsService } from 'src/app/shared/services/common/utils.service';

@Component({
  selector: 'app-nuevo-ingreso',
  templateUrl: './nuevo-ingreso.component.html',
  styleUrls: ['./nuevo-ingreso.component.scss', './../ingreso/ingreso.component.scss']
})
export class NuevoIngresoComponent implements OnInit {

  @Input() tipoUsuario;
  @Output() moverVista:EventEmitter<number> = new EventEmitter();

  rut = new FormControl('',[Validators.required]);
  codigoValidacion = new FormControl('',[Validators.required]);
  usuario = new FormControl('',[Validators.required, Validators.minLength(8), Validators.maxLength(15)]);
  clave = new FormControl('',[Validators.required, Validators.minLength(8), Validators.maxLength(15)]);
  confirmarClave = new FormControl('',[Validators.required]);

  nuevoIngreso = {
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

  solicitarIngreso(){

    let error = false;

    if(this.rut.hasError('required')){
      this.rut.markAsTouched();
      this.rut.setErrors({ required: true});
      error = true;
    }

    if(error){
      return;
    }

    const data = {
      rut: this.rut.value,
      tipoUsuario : this.tipoUsuario
    }

    this.utils.fnLoginLoaderState().setLoginLoaderState(true);
    this.autenticacionService.solicitarNuevoIngreso(data).then( res => {
      this.utils.fnLoginLoaderState().setLoginLoaderState(false);
      this.nuevoIngreso.solicitar = res;
    }).catch( err =>{ 
      this.utils.fnLoginLoaderState().setLoginLoaderState(false);
      this.utils.fnError();
    });

  }

  validarIngreso(){

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
      id: this.nuevoIngreso.solicitar.id,
      codigoValidacion : this.codigoValidacion.value
    };

    this.utils.fnLoginLoaderState().setLoginLoaderState(true);
    this.autenticacionService.validarNuevoIngreso(data).then( res => {
      this.utils.fnLoginLoaderState().setLoginLoaderState(false);
      this.nuevoIngreso.validar = res;
    }).catch( err =>{ 
      this.utils.fnLoginLoaderState().setLoginLoaderState(false);
      this.utils.fnError();
    });
  }
  
  procesarIngreso(){

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
      id : this.nuevoIngreso.solicitar.id,
      usuario : this.usuario.value.toLowerCase(),
      clave: this.clave.value,
      codigoValidacion: this.codigoValidacion.value
    };

    this.utils.fnLoginLoaderState().setLoginLoaderState(true);
    this.autenticacionService.procesarNuevoIngreso(data).then( (res:any) => {
      this.utils.fnLoginLoaderState().setLoginLoaderState(false);
      this.nuevoIngreso.procesar = res;
      if(res.response){
        this.utils.fnMainDialog('Cuenta Creada', 'La cuenta ha sido creada exitosamente.', 'message');
        this.irLogin();
      }
    }).catch(err => {
      this.utils.fnError();
      this.utils.fnLoginLoaderState().setLoginLoaderState(false);
    });
  }

  irLogin(){
    this.nuevoIngreso = {
      solicitar: null,
      validar: null,
      procesar: null
    };
    this.rut.reset();
    this.usuario.reset();
    this.clave.reset();
    this.confirmarClave.reset();
    this.codigoValidacion.reset();
    this.moverVista.emit(0);
  }
}
